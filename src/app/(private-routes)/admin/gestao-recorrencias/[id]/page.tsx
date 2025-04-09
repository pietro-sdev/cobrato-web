"use client";

import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PencilLine, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/layout/DeleteConfirmDialog";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const mockRecorrencia = {
  cliente: "João Silva",
  valor: "R$ 250,00",
  banco: "Sicoob (756)",
  ciclo: "Mensal",
  vencimento: new Date(2025, 3, 10), // 10 de abril de 2025
  descricao: "Cobrança recorrente de manutenção",
};

export default function DetalhesRecorrenciaPage() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    ...mockRecorrencia,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Detalhes da Recorrência</h1>
          <p className="text-xl text-gray-500">
            ID da recorrência: <span className="font-semibold">{id}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditing((prev) => !prev)}
            className="flex items-center gap-2 border border-[#E4E4E4]"
          >
            <PencilLine className="w-4 h-4" />
            {isEditing ? "Cancelar" : "Editar"}
          </Button>

          <DeleteConfirmDialog
            title="Deseja excluir esta cobrança recorrente?"
            description="Essa ação não poderá ser desfeita e a recorrência será interrompida."
            onConfirm={() => {
              console.log("Recorrência excluída:", id);
            }}
          >
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
          </DeleteConfirmDialog>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReadOnlyInput
          label="Cliente"
          value={formData.cliente}
          disabled={!isEditing}
          onChange={(e) => setFormData((prev) => ({ ...prev, cliente: e.target.value }))}
        />
        <ReadOnlyInput
          label="Valor"
          value={formData.valor}
          disabled={!isEditing}
          onChange={(e) => setFormData((prev) => ({ ...prev, valor: e.target.value }))}
        />
        <ReadOnlyInput
          label="Banco"
          value={formData.banco}
          disabled={!isEditing}
          onChange={(e) => setFormData((prev) => ({ ...prev, banco: e.target.value }))}
        />

        <div className="space-y-1">
          <p className="text-sm text-black font-semibold">Ciclo</p>
          {isEditing ? (
            <Select
              value={formData.ciclo}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, ciclo: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ciclo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semanal">Semanal</SelectItem>
                <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                <SelectItem value="Mensal">Mensal</SelectItem>
                <SelectItem value="Bimestral">Bimestral</SelectItem>
                <SelectItem value="Trimestral">Trimestral</SelectItem>
                <SelectItem value="Anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input value={formData.ciclo} disabled />
          )}
        </div>

        {/* Calendário de vencimento */}
        <div className="space-y-1">
          <p className="text-sm text-black font-semibold">Dia de Vencimento</p>
          {isEditing ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {formData.vencimento
                    ? format(formData.vencimento, "dd/MM/yyyy", { locale: ptBR })
                    : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.vencimento}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, vencimento: date ?? new Date() }))
                  }
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : (
            <Input
              value={format(formData.vencimento, "dd/MM/yyyy", { locale: ptBR })}
              disabled
            />
          )}
        </div>

        <ReadOnlyInput
          label="Descrição"
          value={formData.descricao}
          disabled={!isEditing}
          onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
        />
      </div>

      {isEditing && (
        <div className="pt-4">
          <Button onClick={() => console.log("Salvar recorrência", formData)}>
            Salvar Alterações
          </Button>
        </div>
      )}
    </div>
  );
}

function ReadOnlyInput({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-black font-semibold">{label}</p>
      <Input value={value} disabled={disabled} onChange={onChange} />
    </div>
  );
}
