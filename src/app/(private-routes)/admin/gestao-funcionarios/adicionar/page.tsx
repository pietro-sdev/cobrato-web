"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RequiredLabel } from "@/components/form/RequiredLabel";
import { MaskedInput } from "@/components/form/MaskedInput";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createFuncionario } from "@/actions/funcionario/createFuncionario";
import { useAuthStore } from "@/stores/useAuthStore";

const permissions = [
  { key: "view_charges", label: "Visualizar Cobranças" },
  { key: "create_charges", label: "Emitir Boletos" },
  { key: "recurrence", label: "Cobrança Recorrente" },
  { key: "manual_payment", label: "Baixa Manual" },
  { key: "cancel_charges", label: "Cancelar Cobrança" },
  { key: "reports", label: "Acesso a Relatórios" },
  { key: "config_boleto", label: "Configurar Boletos" },
];

export default function AdicionarFuncionarioPage() {
  const { cnpj } = useAuthStore();
  const router = useRouter();

  console.log("CNPJ vindo da store:", cnpj);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const togglePermission = (key: string) => {
    setUserPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnpj || formData.senha !== formData.confirmPassword) {
      alert("CNPJ inválido ou senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const result = await createFuncionario({
        empresaCnpj: cnpj,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
        permissoes: userPermissions,
      });

      if (result?.success) {
        router.push("/admin/gestao-funcionarios");
      } else {
        alert(result?.error || "Erro ao cadastrar funcionário");
      }
    } catch (err) {
      console.error(err);
      alert("Erro inesperado ao cadastrar funcionário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">Cadastrar Usuário</h1>
        <p className="text-gray-500">Adicione funcionários à sua empresa.</p>
      </div>

      <Separator />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <RequiredLabel htmlFor="name">Nome</RequiredLabel>
          <Input
            id="name"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
        </div>

        <div>
          <RequiredLabel htmlFor="email">Email</RequiredLabel>
          <Input
            id="email"
            type="email"
            placeholder="email@exemplo.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <RequiredLabel htmlFor="phone">Telefone</RequiredLabel>
          <MaskedInput
            id="phone"
            mask="(99) 99999-9999"
            placeholder="(99) 99999-9999"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          />
        </div>

        <div className="relative">
          <RequiredLabel htmlFor="password">Senha</RequiredLabel>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
          />
          <Button
            type="button"
            size="icon"
            className="absolute right-0 top-[25px] z-10"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>

        <div className="relative">
          <RequiredLabel htmlFor="confirmPassword">Confirmar Senha</RequiredLabel>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="********"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <Button
            type="button"
            size="icon"
            className="absolute right-0 top-[25px] z-10"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-lg font-semibold">Permissões do Funcionário</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {permissions.map((perm) => (
              <div key={perm.key} className="flex items-center gap-3">
                <Switch
                  id={perm.key}
                  checked={userPermissions.includes(perm.key)}
                  onCheckedChange={() => togglePermission(perm.key)}
                />
                <Label htmlFor={perm.key} className="text-sm">
                  {perm.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar Funcionário"}
          </Button>
        </div>
      </form>
    </div>
  );
}
