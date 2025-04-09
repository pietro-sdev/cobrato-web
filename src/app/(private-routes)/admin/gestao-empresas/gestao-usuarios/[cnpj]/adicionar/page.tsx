"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RequiredLabel } from "@/components/form/RequiredLabel";
import { MaskedInput } from "@/components/form/MaskedInput";

export default function AdicionarAdministradorPage() {
  const { cnpj } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">Cadastrar Administrador</h1>
        <p className="text-gray-500">
          Vinculando à empresa <span className="font-semibold">{formatCnpj(cnpj as string)}</span>.
        </p>
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

        <div className="pt-4">
          <Button type="submit">Cadastrar Administrador</Button>
        </div>
      </form>
    </div>
  );
}

function formatCnpj(cnpj: string) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}
