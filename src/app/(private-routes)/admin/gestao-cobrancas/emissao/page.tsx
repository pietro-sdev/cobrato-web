"use client";

import { useState, FormEvent, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/components/form/RequiredLabel";
import { Separator } from "@/components/ui/separator";
import { MaskedInput } from "@/components/form/MaskedInput";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

// Server action para emitir boleto Inter (onde você faz a chamada real)
import { emitirCobrancaInter } from "@/actions/cobranca/emitirCobrancaInter";

/**
 * Exemplo de formulário com TODOS os campos básicos
 * exigidos para emissão de cobrança assíncrona no Banco Inter:
 * - seuNumero
 * - valorNominal (Valor)
 * - dataVencimento
 * - numDiasAgenda
 * - pagador (nome, cpfCnpj, tipoPessoa, endereco, bairro, cidade, uf, cep, numero, etc.)
 */
export default function EmissaoCobrancaPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [banco, setBanco] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Campos adicionais do doc
  const [seuNumero, setSeuNumero] = useState("");
  const [numDiasAgenda, setNumDiasAgenda] = useState("0");

  // Campos de pagador
  const [tipoPessoa, setTipoPessoa] = useState<"FISICA" | "JURIDICA">("FISICA");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cliente, setCliente] = useState(""); // doc chama de "nome"
  const [endereco, setEndereco] = useState("");
  const [numeroEndereco, setNumeroEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [cep, setCep] = useState("");

  // Já existia
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(""); // MaskedInput -> R$ 99999,99

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (banco !== "inter") {
      alert(`Banco "${banco}" ainda não implementado.`);
      return;
    }

    const vencimento = date
      ? format(date, "dd/MM/yyyy", { locale: ptBR })
      : "";

    // Exemplo fixo (ou buscar do AuthStore):
    const empresaCnpj = "79379491000183";

    startTransition(async () => {
      // Monta objeto esperado pela server action
      const payload = {
        empresaCnpj,
        cliente,       // "nome" do pagador
        descricao,     // campo adicional livre
        valor,         // ex: "R$ 100,00"
        vencimento,    // ex: "dd/MM/yyyy"

        // Campos da doc:
        seuNumero,
        numDiasAgenda,
        cpfCnpj,
        tipoPessoa,
        endereco,
        numero: numeroEndereco,
        bairro,
        cidade,
        uf,
        cep,
      };

      const response = await emitirCobrancaInter(payload);
      if (!response.success) {
        alert("Erro ao emitir boleto: " + (response.error || "Desconhecido"));
      } else {
        alert("Boleto emitido com sucesso!");
        console.log("Dados do boleto:", response);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">Emitir Nova Cobrança</h1>
        <p className="text-gray-500">
          Preencha os dados abaixo para gerar um novo boleto.
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {/* Banco */}
        <div>
          <RequiredLabel htmlFor="banco">Banco Emissor</RequiredLabel>
          <Select value={banco} onValueChange={setBanco} required>
            <SelectTrigger id="banco" className="w-full">
              <SelectValue placeholder="Selecione o banco emissor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="asaas">
                Asaas (API)
              </SelectItem>
              <SelectItem className="cursor-pointer" value="sicoob">
                Sicoob (756)
              </SelectItem>
              <SelectItem className="cursor-pointer" value="inter">
                Inter (077)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Seu Número */}
        <div>
          <RequiredLabel htmlFor="seuNumero">Seu Número</RequiredLabel>
          <Input
            id="seuNumero"
            placeholder="Ex: ABC123 (máx 15 caracteres)"
            maxLength={15}
            value={seuNumero}
            onChange={(e) => setSeuNumero(e.target.value)}
            required
          />
        </div>

        {/* Valor */}
        <div>
          <RequiredLabel htmlFor="valor">Valor</RequiredLabel>
          <MaskedInput
            id="valor"
            mask="R$ 99999,99"
            placeholder="R$ 0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </div>

        {/* Data Vencimento */}
        <div className="grid gap-1">
          <RequiredLabel htmlFor="vencimento">Data de Vencimento</RequiredLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date
                  ? format(date, "dd/MM/yyyy", { locale: ptBR })
                  : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Dias de Agenda */}
        <div>
          <RequiredLabel htmlFor="numDiasAgenda">Dias de Agenda (0 a 60)</RequiredLabel>
          <Input
            id="numDiasAgenda"
            type="number"
            min={0}
            max={60}
            value={numDiasAgenda}
            onChange={(e) => setNumDiasAgenda(e.target.value)}
            required
          />
        </div>

        {/* Tipo Pessoa */}
        <div>
          <RequiredLabel htmlFor="tipoPessoa">Tipo de Pessoa</RequiredLabel>
          <Select
            value={tipoPessoa}
            onValueChange={(val) =>
              setTipoPessoa(val as "FISICA" | "JURIDICA")
            }
            required
          >
            <SelectTrigger id="tipoPessoa" className="w-full">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FISICA">Física</SelectItem>
              <SelectItem value="JURIDICA">Jurídica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* CPF/CNPJ */}
        <div>
          <RequiredLabel htmlFor="cpfCnpj">CPF/CNPJ</RequiredLabel>
          <Input
            id="cpfCnpj"
            placeholder="Somente dígitos"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
            required
          />
        </div>

        {/* Nome do Pagador */}
        <div>
          <RequiredLabel htmlFor="cliente">Nome do Pagador</RequiredLabel>
          <Input
            id="cliente"
            placeholder="Ex: João da Silva"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
          />
        </div>

        {/* Endereço */}
        <div>
          <RequiredLabel htmlFor="endereco">Endereço (Rua/Av.)</RequiredLabel>
          <Input
            id="endereco"
            placeholder="Ex: Avenida Brasil"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
        </div>

        {/* Número */}
        <div>
          <RequiredLabel htmlFor="numeroEndereco">Número</RequiredLabel>
          <Input
            id="numeroEndereco"
            placeholder="Ex: 1200"
            value={numeroEndereco}
            onChange={(e) => setNumeroEndereco(e.target.value)}
            required
          />
        </div>

        {/* Bairro */}
        <div>
          <RequiredLabel htmlFor="bairro">Bairro</RequiredLabel>
          <Input
            id="bairro"
            placeholder="Ex: Centro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            required
          />
        </div>

        {/* Cidade */}
        <div>
          <RequiredLabel htmlFor="cidade">Cidade</RequiredLabel>
          <Input
            id="cidade"
            placeholder="Ex: Belo Horizonte"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
          />
        </div>

        {/* UF */}
        <div>
          <RequiredLabel htmlFor="uf">UF</RequiredLabel>
          <Input
            id="uf"
            placeholder="Ex: MG"
            maxLength={2}
            value={uf}
            onChange={(e) => setUf(e.target.value.toUpperCase())}
            required
          />
        </div>

        {/* CEP */}
        <div>
          <RequiredLabel htmlFor="cep">CEP</RequiredLabel>
          <Input
            id="cep"
            placeholder="Ex: 30110000"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            required
          />
        </div>

        {/* Descrição (opcional) */}
        <div>
          <Label htmlFor="descricao">Descrição (opcional)</Label>
          <Input
            id="descricao"
            placeholder="Ex: Cobrança mensal referente ao plano"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Emitindo..." : "Emitir Cobrança"}
          </Button>
        </div>
      </form>
    </div>
  );
}
