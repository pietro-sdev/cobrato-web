"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação dos dados recebidos do formulário
const schema = z.object({
  empresaCnpj: z.string(),
  cliente: z.string(),
  cpfCnpj: z.string(),
  tipoPessoa: z.enum(["FISICA", "JURIDICA"]),
  email: z.string().email(),
  telefone: z.string(),
  endereco: z.string(),
  numero: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  uf: z.string(),
  cep: z.string(),
  valor: z.string(),      // Ex: "R$ 100,00"
  vencimento: z.string(), // Ex: "dd/MM/yyyy"
  descricao: z.string().optional(),
  seuNumero: z.string().optional(),
  numDiasAgenda: z.string().optional(),
});

export async function emitirCobrancaAsaas(data: unknown) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    console.error("Erro de validação:", parsed.error.format());
    return { success: false, error: "Dados inválidos." };
  }

  const {
    empresaCnpj,
    cliente,
    cpfCnpj,
    tipoPessoa,
    email,
    telefone,
    endereco,
    numero,
    bairro,
    cidade,
    uf,
    cep,
    valor,
    vencimento,
    descricao,
  } = parsed.data;

  try {
    // Busca a empresa no banco de dados
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj: empresaCnpj },
    });
    if (!empresa)
      return { success: false, error: "Empresa não encontrada." };

    // Busca as configurações de integração com Asaas
    const integracao = await prisma.integracaoBancaria.findFirst({
      where: { empresaId: empresa.id, banco: "asaas", ativa: true },
    });
    if (!integracao)
      return { success: false, error: "Integração com Asaas não configurada." };

    const { accessToken } = integracao.configuracoes as { accessToken: string };

    // Busca se já existe um cliente com o CPF/CNPJ informado
    const getClientRes = await fetch(
      `https://api-sandbox.asaas.com/v3/customers?cpfCnpj=${cpfCnpj}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const getClientText = await getClientRes.text();
    const getClientData = getClientText ? JSON.parse(getClientText) : {};
    let customerId = "";
    if (
      getClientRes.ok &&
      getClientData.data &&
      Array.isArray(getClientData.data) &&
      getClientData.data.length > 0
    ) {
      // Se já existe, usa o primeiro
      customerId = getClientData.data[0].id;
      console.log("Cliente já existe. Usando customerId:", customerId);
    } else {
      // Caso não exista, cria o cliente
      const createClientRes = await fetch(
        "https://api-sandbox.asaas.com/v3/customers",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: cliente,
            cpfCnpj,
            email,
            phone: telefone,
            address: endereco,
            addressNumber: numero,
            complement: "",
            province: bairro,
            city: cidade,
            state: uf,
            postalCode: cep,
          }),
        }
      );
      const createClientText = await createClientRes.text();
      console.log("Status da criação do cliente:", createClientRes.status);
      console.log("Resposta da criação do cliente:", createClientText);
      const createClientData = createClientText
        ? JSON.parse(createClientText)
        : {};
      if (!createClientRes.ok) {
        console.error("Erro ao criar cliente:", createClientData);
        return {
          success: false,
          error:
            createClientData?.errors?.[0]?.description ||
            "Erro ao criar cliente no Asaas.",
        };
      }
      customerId = createClientData.id;
    }

    if (!customerId) {
      return { success: false, error: "ID do cliente não retornado." };
    }

    // Converte o valor (ex: "R$ 100,00") para número
    const valorNumerico = parseFloat(
      valor.replace("R$", "").replace(".", "").replace(",", ".").trim()
    );
    // Converte a data de vencimento de "dd/MM/yyyy" para "yyyy-MM-dd"
    const [dia, mes, ano] = vencimento.split("/");
    const vencimentoISO = `${ano}-${mes}-${dia}`;

    // Cria a cobrança (boleto) no Asaas
    const cobrancaRes = await fetch("https://api-sandbox.asaas.com/v3/payments", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: "BOLETO",
        value: valorNumerico,
        dueDate: vencimentoISO,
        description: descricao || `Cobrança para ${cliente}`,
        daysAfterDueDateToRegistrationCancellation: 3,
        discount: { value: 0 },
        interest: { value: 1 },
        fine: { value: 2 },
        postalService: false,
      }),
    });

    const cobrancaText = await cobrancaRes.text();
    console.log("Status da criação da cobrança:", cobrancaRes.status);
    console.log("Resposta da cobrança:", cobrancaText);
    const cobranca = cobrancaText ? JSON.parse(cobrancaText) : {};
    if (!cobrancaRes.ok) {
      console.error("Erro ao criar cobrança:", cobranca);
      return {
        success: false,
        error:
          cobranca?.errors?.[0]?.description ||
          "Erro ao criar cobrança no Asaas.",
      };
    }

    // (Opcional) Salva a cobrança no banco de dados
    await prisma.cobranca.create({
      data: {
        empresaId: empresa.id,
        cliente,
        descricao: descricao || "",
        valor: valorNumerico,
        vencimento: new Date(vencimentoISO),
        status: "pendente",
        tipo: "asaas",
      },
    });

    return {
      success: true,
      urlBoleto: cobranca.bankSlipUrl,
      linhaDigitavel: cobranca.identificationField,
      dados: cobranca,
    };
  } catch (err) {
    console.error("Erro ao emitir cobrança Asaas:", err);
    return { success: false, error: "Erro interno ao emitir cobrança." };
  }
}
