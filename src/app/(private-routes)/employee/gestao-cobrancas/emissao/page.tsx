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

export default function EmissaoCobrancaPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [isPending, startTransition] = useTransition();

  // Campos essenciais
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cliente, setCliente] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [seuNumero, setSeuNumero] = useState("");

  // Campos de opções adicionais
  const [daysAfterDueDate, setDaysAfterDueDate] = useState("1");
  const [discountValue, setDiscountValue] = useState("10");
  const [discountDueDateLimitDays, setDiscountDueDateLimitDays] = useState("0");

  // Novo campo: Tipo de desconto com select. O valor selecionado será enviado como "PERCENTAGE" ou "FIXED".
  const [discountType, setDiscountType] = useState("PERCENTAGE"); 

  const [interestValue, setInterestValue] = useState("0");
  const [fineValue, setFineValue] = useState("2");
  const [postalService, setPostalService] = useState(false);
  // Removidos os callbacks conforme solicitado

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const vencimento = date
      ? format(date, "dd/MM/yyyy", { locale: ptBR })
      : "";

    // Empresa fixa – ajuste conforme o contexto (ex: AuthStore)
    const empresaCnpj = "79379491000183";

    const payload = {
      empresaCnpj,
      cliente,
      cpfCnpj,
      valor,      // Valor em formato "R$ 129,90" – backend fará a conversão
      vencimento, // Data "dd/MM/yyyy" – será convertida para ISO no backend
      descricao,
      seuNumero,
      billingType: "BOLETO",
      daysAfterDueDateToRegistrationCancellation: Number(daysAfterDueDate),
      installmentCount: null,
      totalValue: null,
      installmentValue: null,
      discount: {
        value: Number(discountValue),
        dueDateLimitDays: Number(discountDueDateLimitDays),
        type: discountType,
      },
      interest: { value: Number(interestValue) },
      fine: { value: Number(fineValue), type: "FIXED" },
      // Os campos postalService e callbacks foram removidos conforme solicitado
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/emitir/emitir-asaas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) {
          alert("Erro ao emitir boleto: " + (data.error || "Desconhecido"));
        } else {
          alert("Boleto emitido com sucesso!");
          console.log("Dados do boleto:", data);
          if (data.urlBoleto) {
            window.open(data.urlBoleto, "_blank");
          }
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao conectar com a API.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">Emitir Nova Cobrança</h1>
        <p className="text-gray-500">
          Preencha os campos essenciais e as opções adicionais abaixo para gerar um novo boleto.
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {/* Campos Essenciais */}
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

        <div className="grid gap-1">
          <RequiredLabel htmlFor="vencimento">Data de Vencimento</RequiredLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
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

        <div>
          <Label htmlFor="descricao">Descrição (opcional)</Label>
          <Input
            id="descricao"
            placeholder="Ex: Pedido 056984"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="seuNumero">Seu Número (opcional)</Label>
          <Input
            id="seuNumero"
            placeholder="Ex: 056984"
            value={seuNumero}
            onChange={(e) => setSeuNumero(e.target.value)}
          />
        </div>

        {/* Campos Adicionais */}
        <div>
          <RequiredLabel htmlFor="daysAfterDueDate">
            Dias Após o Vencimento para Cancelamento
          </RequiredLabel>
          <Input
            id="daysAfterDueDate"
            type="number"
            min={0}
            max={60}
            value={daysAfterDueDate}
            onChange={(e) => setDaysAfterDueDate(e.target.value)}
            required
          />
        </div>

        <div>
          <RequiredLabel htmlFor="discountValue">Valor do Desconto</RequiredLabel>
          <Input
            id="discountValue"
            type="number"
            min={0}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            required
          />
        </div>

        <div>
          <RequiredLabel htmlFor="discountDueDateLimitDays">
            Dias Limite para Desconto
          </RequiredLabel>
          <Input
            id="discountDueDateLimitDays"
            type="number"
            min={0}
            value={discountDueDateLimitDays}
            onChange={(e) => setDiscountDueDateLimitDays(e.target.value)}
            required
          />
        </div>

        {/* Select para Tipo de Desconto */}
        <div>
          <RequiredLabel htmlFor="discountType">Tipo de Desconto</RequiredLabel>
          <Select 
            value={discountType} 
            onValueChange={(val) => setDiscountType(val)}
            required
          >
            <SelectTrigger id="discountType" className="w-full">
              <SelectValue placeholder="Selecione o tipo de desconto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Porcentagem</SelectItem>
              <SelectItem value="FIXED">Fixo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <RequiredLabel htmlFor="interestValue">Valor dos Juros (%)</RequiredLabel>
          <Input
            id="interestValue"
            type="number"
            min={0}
            max={10}
            placeholder="Ex: 0"
            value={interestValue}
            onChange={(e) => setInterestValue(e.target.value)}
            required
          />
        </div>

        <div>
          <RequiredLabel htmlFor="fineValue">Valor da Multa (FIXED)</RequiredLabel>
          <Input
            id="fineValue"
            type="number"
            min={0}
            placeholder="Ex: 2"
            value={fineValue}
            onChange={(e) => setFineValue(e.target.value)}
            required
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
