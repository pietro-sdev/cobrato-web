"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RequiredLabel } from "@/components/form/RequiredLabel";
import { MaskedInput } from "@/components/form/MaskedInput";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const { cnpj } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  const togglePermission = (key: string) => {
    setUserPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">Cadastrar Usuário</h1>
        <p className="text-gray-500">Adicione funcionários à sua empresa.</p>
      </div>

      <Separator />

      <form className="space-y-4">
        <div>
          <RequiredLabel htmlFor="name">Nome</RequiredLabel>
          <Input id="name" placeholder="Nome completo" />
        </div>

        <div>
          <RequiredLabel htmlFor="email">Email</RequiredLabel>
          <Input id="email" type="email" placeholder="email@exemplo.com" />
        </div>

        <div>
          <RequiredLabel htmlFor="phone">Telefone</RequiredLabel>
          <MaskedInput id="phone" mask="(99) 99999-9999" placeholder="(99) 99999-9999" />
        </div>

        <div className="relative">
          <RequiredLabel htmlFor="password">Senha</RequiredLabel>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
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
          <Button type="submit">Cadastrar Funcionário</Button>
        </div>
      </form>
    </div>
  );
}
