"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RequiredLabel } from "@/components/form/RequiredLabel";
import { MaskedInput } from "@/components/form/MaskedInput";
import { addAdminToEmpresa } from "@/actions/usuario/addAdminToEmpresa";
import { FieldErrorMessage } from "@/components/form/FieldErrorMessage";

export default function AdicionarAdministradorPage() {
  const { cnpj } = useParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data: any) => {
    const cleaned = {
      nome: data.name,
      email: data.email,
      telefone: data.phone.replace(/\D/g, ""),
      senha: data.password,
      cnpj: cnpj as string,
    };

    const result = await addAdminToEmpresa(cleaned);

    if (result.status === 200) {
      router.push(`/super_admin/gestao-empresas/${cnpj}`);
    } else {
      console.error("Erro ao adicionar administrador", result.message);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">Cadastrar Administrador</h1>
        <p className="text-gray-500">
          Vinculando à empresa <span className="font-semibold">{formatCnpj(cnpj as string)}</span>.
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <RequiredLabel htmlFor="name">Nome</RequiredLabel>
          <Input
            id="name"
            placeholder="Nome completo"
            {...register("name", { required: "Nome é obrigatório" })}
          />
          <FieldErrorMessage error={errors.name} />
        </div>

        <div>
          <RequiredLabel htmlFor="email">Email</RequiredLabel>
          <Input
            id="email"
            type="email"
            placeholder="email@exemplo.com"
            {...register("email", { required: "Email é obrigatório" })}
          />
          <FieldErrorMessage error={errors.email} />
        </div>

        <div>
          <RequiredLabel htmlFor="phone">Telefone</RequiredLabel>
          <MaskedInput
            id="phone"
            mask="(99) 99999-9999"
            placeholder="(99) 99999-9999"
            {...register("phone", { required: "Telefone é obrigatório" })}
          />
          <FieldErrorMessage error={errors.phone} />
        </div>

        <div className="relative">
          <RequiredLabel htmlFor="password">Senha</RequiredLabel>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            {...register("password", { required: "Senha é obrigatória" })}
          />
          <Button
            type="button"
            size="icon"
            className="absolute right-0 top-[25px] z-10"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <FieldErrorMessage error={errors.password} />
        </div>

        <div className="relative">
          <RequiredLabel htmlFor="confirmPassword">Confirmar Senha</RequiredLabel>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="********"
            {...register("confirmPassword", {
              required: "Confirmação de senha é obrigatória",
              validate: (value) => value === password || "Senhas não conferem",
            })}
          />
          <Button
            type="button"
            size="icon"
            className="absolute right-0 top-[25px] z-10"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <FieldErrorMessage error={errors.confirmPassword} />
        </div>

        <div className="pt-4">
          <Button type="submit">Cadastrar Administrador</Button>
        </div>
      </form>
    </div>
  );
}

function formatCnpj(cnpj: string) {
  return cnpj.replace(/^([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{4})([0-9]{2})$/, "$1.$2.$3/$4-$5");
}
