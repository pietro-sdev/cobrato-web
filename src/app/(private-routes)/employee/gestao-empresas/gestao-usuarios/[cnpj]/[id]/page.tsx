"use client";

import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/layout/DeleteConfirmDialog";

const mockUser = {
  name: "João Silva",
  email: "joao@empresa.com",
  role: "Administrador",
  phone: "(11) 99999-8888",
  createdAt: "01/01/2024",
};

export default function DetalhesUsuarioPage() {
  const { cnpj, userId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Dados do Usuário</h1>
          <p className="text-xl text-gray-500">
            Vinculado à empresa <span className="font-semibold">{formatCnpj(String(cnpj))}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 border border-[#E4E4E4]">
            <PencilLine className="w-4 h-4" />
            Editar
          </Button>

          <DeleteConfirmDialog
            title="Deseja realmente excluir este usuário?"
            description="Essa ação não poderá ser desfeita. O usuário perderá acesso ao sistema."
            onConfirm={() => {
              console.log("Usuário excluído:", userId);
              // Aqui você pode chamar sua função de exclusão real
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
        <ReadOnlyInput label="Nome" value={mockUser.name} />
        <ReadOnlyInput label="Email" value={mockUser.email} />
        <ReadOnlyInput label="Cargo" value={mockUser.role} />
        <ReadOnlyInput label="Telefone" value={mockUser.phone} />
        <ReadOnlyInput label="Data de Cadastro" value={mockUser.createdAt} />
        <ReadOnlyInput label="ID do Usuário" value={String(userId)} />
      </div>
    </div>
  );
}

function ReadOnlyInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-black font-semibold">{label}</p>
      <Input value={value} disabled />
    </div>
  );
}

function formatCnpj(cnpj: string) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}
