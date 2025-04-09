"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/layout/DeleteConfirmDialog";
import { getAdminById } from "@/actions/usuario/getAdminById";

interface AdminDetails {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresaCnpj: string;
  createdAt: string;
}

export default function DetalhesUsuarioPage() {
  const { cnpj, id: userId } = useParams();
  const [admin, setAdmin] = useState<AdminDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchAdmin() {
      if (!userId) return;
      const data = await getAdminById(String(userId));
      setAdmin(data);
    }
    fetchAdmin();
  }, [userId]);

  function handleChange(field: keyof AdminDetails, value: string) {
    setAdmin((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  async function handleSave() {
    console.log("🔧 Salvar alterações:", admin);
    setIsEditing(false);

  }

  if (!admin) {
    return <p>Carregando dados do usuário...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Dados do Usuário</h1>
          <p className="text-xl text-gray-500">
            Vinculado à empresa{" "}
            <span className="font-semibold">{formatCnpj(admin.empresaCnpj)}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 border border-[#E4E4E4]"
            onClick={() => setIsEditing(prev => !prev)}
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
        <EditableInput
          label="Nome"
          value={admin.nome}
          editable={isEditing}
          onChange={(val) => handleChange("nome", val)}
        />
        <EditableInput
          label="Email"
          value={admin.email}
          editable={isEditing}
          onChange={(val) => handleChange("email", val)}
        />
        <EditableInput
          label="Cargo"
          value="Administrador"
          editable={false}
        />
        <EditableInput
          label="Telefone"
          value={admin.telefone}
          editable={isEditing}
          onChange={(val) => handleChange("telefone", val)}
        />
        <EditableInput
          label="Data de Cadastro"
          value={admin.createdAt}
          editable={false}
        />
        <EditableInput
          label="ID do Usuário"
          value={admin.id}
          editable={false}
        />
      </div>

      {isEditing && (
        <div className="pt-4">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSave}
          >
            Salvar Alterações
          </Button>
        </div>
      )}
    </div>
  );
}

function EditableInput({
  label,
  value,
  editable = false,
  onChange,
}: {
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (val: string) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-black font-semibold">{label}</p>
      <Input
        value={value}
        disabled={!editable}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

function formatCnpj(cnpj: string) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}
