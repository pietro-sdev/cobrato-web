"use client";

import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/layout/DeleteConfirmDialog";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { getUsuarioById } from "@/actions/funcionario/getUsuarioById";
import { deleteFuncionarioById } from "@/actions/funcionario/deleteFuncionarioById";
import { useAuthStore } from "@/stores/useAuthStore";

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
  const { userId } = useParams();
  const router = useRouter();
  const { cnpj } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    createdAt: "",
    permissoes: [] as string[],
  });

  useEffect(() => {
    async function fetchUser() {
      if (!userId) return;
      const res = await getUsuarioById(userId as string);
      if (!res?.success || !res.usuario) return;

      setFormData({
        name: res.usuario.nome,
        email: res.usuario.email,
        role: formatarCargo(res.usuario.role),
        phone: res.usuario.telefone,
        createdAt: new Date(res.usuario.createdAt).toLocaleDateString("pt-BR"),
        permissoes: res.usuario.permissions,
      });
    }

    fetchUser();
  }, [userId]);

  const handlePermissionToggle = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      permissoes: prev.permissoes.includes(key)
        ? prev.permissoes.filter((p) => p !== key)
        : [...prev.permissoes, key],
    }));
  };

  const handleDelete = async () => {
    if (!userId || !cnpj) return;
    const res = await deleteFuncionarioById(userId as string, cnpj);
    if (res.success) {
      router.push("/admin/gestao-funcionarios");
    } else {
      alert(res.error || "Erro ao excluir funcionário");
    }
  };

  const handleSave = async () => {
    if (!userId || !cnpj) {
      console.log("❌ userId ou cnpj ausente", { userId, cnpj });
      return;
    }
  
    const payload = {
      userId: userId as string,
      cnpj,
      nome: formData.name,
      email: formData.email,
      telefone: formData.phone,
      permissoes: formData.permissoes,
    };
    
    const res = await fetch("/api/funcionarios/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    const data = await res.json();
  
    if (data.success) {
      setIsEditing(false);
      alert("Funcionário atualizado com sucesso.");
    } else {
      alert(data.error || "Erro ao atualizar funcionário.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Dados do Usuário</h1>
          <p className="text-xl text-gray-500">Funcionários da sua empresa.</p>
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
            onConfirm={handleDelete}
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
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
        />
        <ReadOnlyInput
          label="Email"
          value={formData.email}
          disabled={!isEditing}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
        />
        <ReadOnlyInput label="Cargo" value={formData.role} disabled />
        <ReadOnlyInput
          label="Telefone"
          value={formData.phone}
          disabled={!isEditing}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
        />
        <ReadOnlyInput label="Data de Cadastro" value={formData.createdAt} disabled />
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-lg font-semibold">Permissões do Funcionário</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(permissionLabels).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <p className="text-sm">{label}</p>
              <Switch
                checked={formData.permissoes.includes(key)}
                onCheckedChange={() => handlePermissionToggle(key)}
                disabled={!isEditing}
              />
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="pt-4">
          <Button onClick={handleSave}>
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

function formatarCargo(role: string) {
  switch (role) {
    case "admin":
      return "Administrador";
    case "employee":
      return "Funcionário";
    case "super_admin":
      return "Super Admin";
    default:
      return role;
  }
}
