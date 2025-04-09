"use client";

import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/layout/DeleteConfirmDialog";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const mockUser = {
  name: "João Silva",
  email: "joao@empresa.com",
  role: "Administrador",
  phone: "(11) 99999-8888",
  createdAt: "01/01/2024",
  permissions: [
    "view_charges",
    "create_charges",
    "recurrence",
    "manual_payment",
    "reports",
  ],
};

const permissionLabels: Record<string, string> = {
  view_charges: "Visualizar Cobranças",
  create_charges: "Emitir Boletos",
  recurrence: "Cobrança Recorrente",
  manual_payment: "Baixa Manual",
  cancel_charges: "Cancelar Cobrança",
  reports: "Acesso a Relatórios",
  config_boleto: "Configurar Boletos",
};

export default function DetalhesUsuarioPage() {
  const { cnpj, userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    ...mockUser,
  });

  const handlePermissionToggle = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter((p) => p !== key)
        : [...prev.permissions, key],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Dados do Usuário</h1>
          <p className="text-xl text-gray-500">
            Funcionários da sua empresa.
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
            title="Deseja realmente excluir este usuário?"
            description="Essa ação não poderá ser desfeita. O usuário perderá acesso ao sistema."
            onConfirm={() => {
              console.log("Usuário excluído:", userId);
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
          label="Nome"
          value={formData.name}
          disabled={!isEditing}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <ReadOnlyInput
          label="Email"
          value={formData.email}
          disabled={!isEditing}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <ReadOnlyInput
          label="Cargo"
          value={formData.role}
          disabled={!isEditing}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, role: e.target.value }))
          }
        />
        <ReadOnlyInput
          label="Telefone"
          value={formData.phone}
          disabled={!isEditing}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
        <ReadOnlyInput
          label="Data de Cadastro"
          value={formData.createdAt}
          disabled
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-lg font-semibold">Permissões do Funcionário</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(permissionLabels).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <p className="text-sm">{label}</p>
              <Switch
                checked={formData.permissions.includes(key)}
                onCheckedChange={() => handlePermissionToggle(key)}
                disabled={!isEditing}
              />
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="pt-4">
          <Button onClick={() => console.log("Salvar alterações", formData)}>
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

function formatCnpj(cnpj: string) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}
