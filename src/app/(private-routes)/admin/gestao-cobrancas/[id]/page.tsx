"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  PencilLine,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { DeleteConfirmDialog } from "@/components/layout/DeleteConfirmDialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const mockCobrancas = [
  {
    id: "1",
    cliente: "João Silva",
    valor: "R$ 360,00",
    status: "Pendente",
    vencimento: new Date(2025, 3, 25),
    descricao: "Cobrança por manutenção mensal",
  },
  {
    id: "2",
    cliente: "Maria Oliveira",
    valor: "R$ 180,00",
    status: "Pago",
    vencimento: new Date(2025, 3, 22),
    descricao: "Serviço avulso de suporte",
  },
];

export default function DetalhesCobrancaPage() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const cobranca = mockCobrancas.find((c) => c.id === id);

  const [formData, setFormData] = useState(() => ({
    ...cobranca,
  }));

  if (!cobranca) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Cobrança não encontrada</h1>
        <p className="text-gray-500">Verifique o ID informado: {id}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Detalhes da Cobrança</h1>
          <p className="text-xl text-gray-500">
            ID da cobrança: <span className="font-semibold">{id}</span>
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
            title="Deseja excluir esta cobrança?"
            description="Essa ação não poderá ser desfeita e a cobrança será removida."
            onConfirm={() => {
              console.log("Cobrança excluída:", id);
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
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, cliente: e.target.value }))
          }
        />
        <ReadOnlyInput
          label="Valor"
          value={formData.valor}
          disabled={!isEditing}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, valor: e.target.value }))
          }
        />
        <ReadOnlyInput
          label="Status"
          value={formData.status}
          disabled={!isEditing}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, status: e.target.value }))
          }
        />

        <div className="space-y-1">
          <p className="text-sm text-black font-semibold">Data de Vencimento</p>
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
                    setFormData((prev) => ({
                      ...prev,
                      vencimento: date ?? new Date(),
                    }))
                  }
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : (
            <Input
              value={
                formData.vencimento
                  ? format(formData.vencimento, "dd/MM/yyyy", { locale: ptBR })
                  : ""
              }
              disabled
            />
          )}
        </div>

        <ReadOnlyInput
          label="Descrição"
          value={formData.descricao}
          disabled={!isEditing}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, descricao: e.target.value }))
          }
        />
      </div>

      {isEditing && (
        <div className="pt-4">
          <Button onClick={() => console.log("Salvar cobrança", formData)}>
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
  value: string | undefined;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-black font-semibold">{label}</p>
      <Input value={value ?? ""} disabled={disabled} onChange={onChange} />
    </div>
  );
}
