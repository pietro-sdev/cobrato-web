"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RequiredLabel } from "@/components/form/RequiredLabel";
import { MaskedInput } from "@/components/form/MaskedInput";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function ConfigurarRecorrenciaPage() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [banco, setBanco] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      dataInicio: startDate,
      banco,
    };
    console.log("📦 Recorrência configurada:", formData);
    alert("Cobrança recorrente configurada com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">Configurar Cobrança Recorrente</h1>
        <p className="text-gray-500">
          Defina os detalhes para a cobrança recorrente de um cliente.
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div>
          <RequiredLabel htmlFor="cliente">Cliente</RequiredLabel>
          <Input id="cliente" placeholder="Nome ou CPF/CNPJ do cliente" required />
        </div>

        <div>
          <RequiredLabel htmlFor="banco">Banco Emissor</RequiredLabel>
          <Select value={banco} onValueChange={setBanco} required>
            <SelectTrigger id="banco" className="w-full">
              <SelectValue placeholder="Selecione o banco emissor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="asaas">Asaas (API)</SelectItem>
              <SelectItem className="cursor-pointer" value="sicoob">Sicoob (756)</SelectItem>
              <SelectItem className="cursor-pointer" value="inter">Inter (077)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <RequiredLabel htmlFor="valor">Valor</RequiredLabel>
          <MaskedInput id="valor" mask="R$ 99999,99" placeholder="R$ 0,00" required />
        </div>

        <div className="grid gap-1">
          <RequiredLabel htmlFor="dataInicio">Data de Início</RequiredLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="dataInicio"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate
                  ? format(startDate, "dd/MM/yyyy", { locale: ptBR })
                  : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <RequiredLabel htmlFor="frequencia">Frequência</RequiredLabel>
          <Select required>
            <SelectTrigger id="frequencia">
              <SelectValue placeholder="Selecione a frequência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="bimestral">Bimestral</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="semestral">Semestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <RequiredLabel htmlFor="parcelas">Número de Parcelas</RequiredLabel>
          <Input
            id="parcelas"
            type="number"
            placeholder="Ex: 12"
            min={1}
            required
          />
        </div>

        <div>
          <label htmlFor="descricao" className="text-sm font-semibold text-black">
            Descrição (opcional)
          </label>
          <Input id="descricao" placeholder="Ex: Cobrança mensal referente ao plano" />
        </div>

        <div className="pt-4">
          <Button type="submit">Configurar Recorrência</Button>
        </div>
      </form>
    </div>
  );
}
