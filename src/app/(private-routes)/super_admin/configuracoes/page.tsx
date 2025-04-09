"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RequiredLabel } from "@/components/form/RequiredLabel";
import { Eye, EyeOff, UploadCloud } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { getEmpresaByCnpj } from "@/actions/empresa/getEmpresaByCnpj";
import { getUsuarioByEmail } from "@/actions/usuario/getUsuarioByEmail";
import { updateUserPhoto } from "@/actions/usuario/updateUserPhoto";
import { updateUserPassword } from "@/actions/usuario/updateUserPassword";

export default function ConfiguracoesPage() {
  const { nome, email, role, cnpj, foto, updateFoto } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: nome,
    email,
    role,
    photoUrl: foto || "/avatars/avatar-01.png",
    company: {
      name: "",
      cnpj: "",
      email: "",
      phone: "",
    },
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!email) return;

      const usuario = await getUsuarioByEmail(email);
      const empresa = cnpj ? await getEmpresaByCnpj(cnpj) : null;

      setFormData((prev) => ({
        ...prev,
        photoUrl: usuario?.foto ?? prev.photoUrl,
        company: empresa
          ? {
              name: empresa.name,
              cnpj: formatCnpj(empresa.cnpj),
              email: empresa.email,
              phone: empresa.phone,
            }
          : prev.company,
      }));

      if (usuario?.foto) updateFoto(usuario.foto);
    }

    fetchData();
  }, [email, cnpj, updateFoto]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data?.result?.secure_url) {
        const novaFoto = data.result.secure_url;

        setFormData((prev) => ({
          ...prev,
          photoUrl: novaFoto,
        }));

        await updateUserPhoto(email, novaFoto);
        updateFoto(novaFoto);
      }
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
    }
  };

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      alert("Preencha os dois campos de senha.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const res = await updateUserPassword(email, password);
    if (res.success) {
      alert("Senha atualizada com sucesso!");
      setPassword("");
      setConfirmPassword("");
    } else {
      alert("Erro ao atualizar a senha.");
    }
  };

  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <h1 className="text-4xl font-bold">Configurações da Conta</h1>
        <p className="text-gray-500 text-lg">Gerencie seus dados e segurança.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Perfil</h2>
        <Separator />

        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={formData.photoUrl} alt="Avatar" />
            <AvatarFallback>{formData.name[0]}</AvatarFallback>
          </Avatar>

          <div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-4 h-4" />
              Trocar Foto
            </Button>
          </div>
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
            <Input id="role" value={formatRole(formData.role)} disabled />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Segurança</h2>
        <Separator />

        <div className="grid gap-4">
          <div className="relative">
            <RequiredLabel htmlFor="password">Nova Senha</RequiredLabel>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
        <Button onClick={handleUpdatePassword}>Salvar Alterações</Button>
      </div>
    </div>
  );
}

function formatCnpj(cnpj: string) {
  return cnpj.replace(/^(.{2})(.{3})(.{3})(.{4})(.{2})$/, "$1.$2.$3/$4-$5");
}

function formatRole(role: string) {
  switch (role) {
    case "admin":
      return "Administrador";
    case "super_admin":
      return "Super Administrador";
    case "employee":
      return "Funcionário";
    default:
      return role;
  }
}