import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação com todos os campos do payload conforme o request example
const schema = z.object({
  empresaCnpj: z.string(),
  cliente: z.string(),
  cpfCnpj: z.string(),
  valor: z.string(),      // Ex: "R$ 129,90"
  vencimento: z.string(), // Ex: "dd/MM/yyyy"
  descricao: z.string().optional(),
  seuNumero: z.string().optional(),
  billingType: z.literal("BOLETO"),
  daysAfterDueDateToRegistrationCancellation: z.number(),
  installmentCount: z.null(),
  totalValue: z.null(),
  installmentValue: z.null(),
  discount: z.object({
    value: z.number(),
    dueDateLimitDays: z.number(),
    type: z.string(),
  }),
  // Removemos o campo interest do schema, pois o frontend não envia esse campo
  // e para evitar o erro “Informe um valor percentual ou fixo, sendo superior a 0”.
  fine: z.object({
    value: z.number().nullable(),
    type: z.string(),
  }),
  postalService: z.boolean(),
  split: z.array(
    z.object({
      walletId: z.string(),
      fixedValue: z.number().nullable(),
      percentualValue: z.number().nullable(),
      totalFixedValue: z.number().nullable(),
      externalReference: z.string().nullable(),
      description: z.string().nullable(),
    })
  ),
  callback: z.object({
    successUrl: z.string().nullable(),
    autoRedirect: z.string().nullable(),
  }),
});

export async function POST(req: Request) {
  try {
    console.log("===== Iniciando emissão de cobrança Asaas =====");

    // Lê o corpo da requisição
    const body = await req.json();
    console.log("Body recebido:", body);

    // Valida com Zod usando o schema completo
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      console.error("Erros de validação Zod:", parsed.error.format());
      return NextResponse.json(
        { success: false, error: "Dados inválidos." },
        { status: 400 }
      );
    }

    // Extraímos os dados validados
    const {
      empresaCnpj,
      cliente,
      cpfCnpj,
      valor,
      vencimento,
      descricao,
      seuNumero,
      billingType,
      daysAfterDueDateToRegistrationCancellation,
      installmentCount,
      totalValue,
      installmentValue,
      discount,
      // interest não é utilizado
      fine,
      postalService,
      split,
      callback,
    } = parsed.data;
    console.log("Dados após validação:", parsed.data);

    // Busca a empresa no banco
    console.log("Buscando empresa pelo CNPJ:", empresaCnpj);
    const empresa = await prisma.empresa.findUnique({
      where: { cnpj: empresaCnpj },
    });
    if (!empresa) {
      console.error("Empresa não encontrada para o CNPJ:", empresaCnpj);
      return NextResponse.json(
        { success: false, error: "Empresa não encontrada." },
        { status: 404 }
      );
    }
    console.log("Empresa encontrada. ID:", empresa.id);

    // Busca integração ativa com Asaas
    console.log("Buscando integração Asaas para empresa:", empresa.id);
    const integracao = await prisma.integracaoBancaria.findFirst({
      where: { empresaId: empresa.id, banco: "asaas", ativa: true },
    });
    if (!integracao) {
      console.error("Integração Asaas não configurada para empresa:", empresa.id);
      return NextResponse.json(
        { success: false, error: "Integração com Asaas não configurada." },
        { status: 400 }
      );
    }

    const configuracoes = integracao.configuracoes as any;
    const accessToken = configuracoes?.accessToken;
    if (!accessToken) {
      console.error("Access token do Asaas não encontrado nas configurações.");
      return NextResponse.json(
        { success: false, error: "Access token do Asaas não encontrado." },
        { status: 400 }
      );
    }
    console.log("Token de acesso recuperado com sucesso.");

    // Verifica se o cliente já existe no Asaas
    const getUrl = `https://api-sandbox.asaas.com/v3/customers?cpfCnpj=${cpfCnpj}`;
    console.log("Verificando se o cliente existe no Asaas:", getUrl);
    const getClientRes = await fetch(getUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        access_token: accessToken,
      },
    });

    const getClientText = await getClientRes.text();
    const getClientData = getClientText ? JSON.parse(getClientText) : {};
    console.log("Resposta GET cliente:", getClientData);

    let customerId = "";

    if (
      getClientRes.ok &&
      getClientData.data &&
      Array.isArray(getClientData.data) &&
      getClientData.data.length > 0
    ) {
      customerId = getClientData.data[0].id;
      console.log("Cliente já existe no Asaas. ID:", customerId);
    } else {
      // Caso não exista, cria o cliente passando apenas "name" e "cpfCnpj"
      console.log("Cliente não encontrado. Criando novo no Asaas...");
      const customerPayload = {
        name: cliente,
        cpfCnpj,
      };
      console.log("Payload para criação de cliente:", customerPayload);

      const createClientRes = await fetch(
        "https://api-sandbox.asaas.com/v3/customers",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            access_token: accessToken,
          },
          body: JSON.stringify(customerPayload),
        }
      );

      const createClientText = await createClientRes.text();
      const createClientData = createClientText ? JSON.parse(createClientText) : {};
      console.log("Status da criação do cliente:", createClientRes.status);
      console.log("Resposta da criação do cliente:", createClientData);

      if (!createClientRes.ok) {
        console.error("Erro ao criar cliente no Asaas:", createClientData);
        return NextResponse.json(
          {
            success: false,
            error:
              createClientData?.errors?.[0]?.description ||
              "Erro ao criar cliente no Asaas.",
          },
          { status: 400 }
        );
      }

      customerId = createClientData.id;
      console.log("Novo cliente criado. ID:", customerId);
    }

    if (!customerId) {
      console.error("ID do cliente não retornado pelo Asaas.");
      return NextResponse.json(
        { success: false, error: "ID do cliente não retornado." },
        { status: 400 }
      );
    }

    // Converte o valor e a data
    console.log("Valor recebido (string):", valor);
    const valorNumerico = parseFloat(
      valor.replace("R$", "").replace(".", "").replace(",", ".").trim()
    );
    console.log("Valor convertido:", valorNumerico);

    console.log("Vencimento recebido (string):", vencimento);
    const [dia, mes, ano] = vencimento.split("/");
    const vencimentoISO = `${ano}-${mes}-${dia}`;
    console.log("Vencimento convertido (ISO):", vencimentoISO);

    // Cria payload do boleto com todos os campos do exemplo de request,
    // omitindo o campo de juros (interest) se não houver valor positivo.
    const paymentPayload = {
      customer: customerId,
      billingType, // Deve ser "BOLETO"
      value: valorNumerico,
      dueDate: vencimentoISO,
      ...(descricao && { description: descricao }),
      ...(seuNumero && { externalReference: seuNumero }),
      daysAfterDueDateToRegistrationCancellation,
      installmentCount,
      totalValue,
      installmentValue,
      discount,
      // Não inclui "interest" se o valor for 0 ou inexistente
      fine: { value: 2, type: "FIXED" },
      postalService,
    };

    console.log("Payload da cobrança:", paymentPayload);

    // Emite a cobrança no Asaas
    const cobrancaRes = await fetch("https://api-sandbox.asaas.com/v3/payments", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        access_token: accessToken,
      },
      body: JSON.stringify(paymentPayload),
    });

    const cobrancaText = await cobrancaRes.text();
    const cobranca = cobrancaText ? JSON.parse(cobrancaText) : {};

    console.log("Status da criação da cobrança:", cobrancaRes.status);
    console.log("Resposta da criação da cobrança:", cobranca);

    if (!cobrancaRes.ok) {
      console.error("Erro ao criar cobrança no Asaas:", cobranca);
      return NextResponse.json(
        {
          success: false,
          error:
            cobranca?.errors?.[0]?.description ||
            "Erro ao criar cobrança no Asaas.",
        },
        { status: 400 }
      );
    }

    // Salva cobrança no banco de dados
    console.log("Salvando cobrança localmente...");
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
    console.log("Cobrança salva com sucesso no banco.");

    console.log("===== Emissão de cobrança finalizada com sucesso =====");

    return NextResponse.json({
      success: true,
      urlBoleto: cobranca.bankSlipUrl,
      linhaDigitavel: cobranca.identificationField,
      dados: cobranca,
    });
  } catch (err) {
    console.error("Erro ao emitir cobrança Asaas (try/catch):", err);
    return NextResponse.json(
      { success: false, error: "Erro interno ao emitir cobrança." },
      { status: 500 }
    );
  }
}
