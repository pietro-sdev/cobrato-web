"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RequiredLabel } from "@/components/form/RequiredLabel";
import { Separator } from "@/components/ui/separator";
import { MaskedInput } from "@/components/form/MaskedInput";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

export default function EmissaoCobrancaPage() {
  const [date, setDate] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cobrança emitida com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">Emitir Nova Cobrança</h1>
        <p className="text-gray-500">Preencha os dados abaixo para gerar um novo boleto.</p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <RequiredLabel htmlFor="cliente">Cliente</RequiredLabel>
          <Input id="cliente" placeholder="Nome ou CPF/CNPJ do cliente" required />
        </div>

        <div>
          <RequiredLabel htmlFor="banco">Banco Emissor</RequiredLabel>
          <Input id="banco" placeholder="Ex: Sicoob (756)" required />
        </div>

        <div>
          <RequiredLabel htmlFor="valor">Valor</RequiredLabel>
          <MaskedInput id="valor" mask="R$ 99999,99" placeholder="R$ 0,00" required />
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
          <Label htmlFor="descricao">Descrição</Label>
          <Input id="descricao" placeholder="Ex: Cobrança mensal referente ao plano" />
        </div>

        <div className="pt-4">
          <Button type="submit">Emitir Cobrança</Button>
        </div>
      </form>
    </div>
  );
}
