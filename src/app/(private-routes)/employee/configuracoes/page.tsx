"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RequiredLabel } from "@/components/form/RequiredLabel";
import { Eye, EyeOff, UploadCloud } from "lucide-react";

const mockUser = {
  name: "João Silva",
  email: "joao@empresa.com",
  role: "Administrador",
  photoUrl: "/avatars/avatar-01.png",
  company: {
    name: "Block Code",
    cnpj: "49.002.002/0002-06",
    email: "contato@blockcode.com.br",
    phone: "(11) 98014-1941",
  },
};

export default function ConfiguracoesPage() {
  const [formData, setFormData] = useState({ ...mockUser });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <h1 className="text-4xl font-bold">Configurações da Conta</h1>
        <p className="text-gray-500 text-lg">Gerencie seus dados e segurança.</p>
      </div>

      {/* PERFIL */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Perfil</h2>
        <Separator />

        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={formData.photoUrl} alt="Avatar" />
            <AvatarFallback>{formData.name[0]}</AvatarFallback>
          </Avatar>

          <Button variant="outline" className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            Trocar Foto
          </Button>
        </div>

        <div className="grid gap-4 mt-4">
          <div>
            <RequiredLabel htmlFor="name">Nome</RequiredLabel>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <RequiredLabel htmlFor="email">Email</RequiredLabel>
            <Input id="email" value={formData.email} disabled />
          </div>

          <div>
            <RequiredLabel htmlFor="role">Cargo</RequiredLabel>
            <Input id="role" value={formData.role} disabled />
          </div>
        </div>
      </div>

      {/* EMPRESA */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Empresa</h2>
        <Separator />

        <div className="grid gap-4">
          <Input disabled value={formData.company.name} />
          <Input disabled value={formData.company.cnpj} />
          <Input disabled value={formData.company.email} />
          <Input disabled value={formData.company.phone} />
        </div>
      </div>

      {/* SEGURANÇA */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Segurança</h2>
        <Separator />

        <div className="grid gap-4">
          <div className="relative">
            <RequiredLabel htmlFor="password">Nova Senha</RequiredLabel>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
            />
            <Button
              size="icon"
              type="button"
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
              type={showConfirm ? "text" : "password"}
              placeholder="********"
            />
            <Button
              size="icon"
              type="button"
              className="absolute right-0 top-[25px] z-10"
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={() => alert("Dados atualizados!")}>Salvar Alterações</Button>
      </div>
    </div>
  );
}
