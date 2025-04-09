"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MaskedInput } from "@/components/form/MaskedInput";
import { FieldErrorMessage } from "@/components/form/FieldErrorMessage";
import { RequiredLabel } from "@/components/form/RequiredLabel";

import { isValidCnpj } from "@/utils/validateCnpj";
import { isValidEmail } from "@/utils/validateEmail";
import { isValidPhone } from "@/utils/validatePhone";
import { isValidCep, fetchAddressByCep } from "@/utils/validateCep";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { addEmpresa } from "@/actions/empresa/addEmpresa";

export default function AdicionarEmpresa() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const rawCep = watch("cep")?.replace(/\D/g, "");

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (rawCep && isValidCep(rawCep)) {
        const address = await fetchAddressByCep(rawCep);
        if (address) {
          setValue("street", address.street || "");
          setValue("neighborhood", address.neighborhood || "");
          setValue("city", address.city || "");
          setValue("state", address.state || "");
        }
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [rawCep, setValue]);

  const onSubmit = async (data: any) => {
    const cleanedData = {
      name: data.name,
      cnpj: data.cnpj?.replace(/\D/g, ""),
      email: data.email,
      phone: data.phone?.replace(/\D/g, ""),
      responsavel: data.responsavel,
      segment: data.segment,
      status: data.status,
      cep: data.cep?.replace(/\D/g, ""),
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
    };

    const result = await addEmpresa(cleanedData);
    if (result.status === 200) {
      router.push("/super_admin/gestao-empresas");
    } else {
      console.error("Erro ao cadastrar empresa", result.message);
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold">Dados da Empresa</h2>

        <div className="grid gap-2">
          <RequiredLabel htmlFor="name">Nome da Empresa</RequiredLabel>
          <Input
            id="name"
            placeholder="Ex: Block Code LTDA"
            {...register("name", { required: "Nome é obrigatório" })}
          />
          <FieldErrorMessage error={errors.name} />
        </div>

        <div className="grid gap-2">
          <RequiredLabel htmlFor="cnpj">CNPJ</RequiredLabel>
          <MaskedInput
            id="cnpj"
            mask="99.999.999/9999-99"
            placeholder="00.000.000/0000-00"
            {...register("cnpj", {
              required: "CNPJ é obrigatório",
              validate: (value) => isValidCnpj(value) || "CNPJ inválido",
            })}
          />
          <FieldErrorMessage error={errors.cnpj} />
        </div>

        <div className="grid gap-2">
          <RequiredLabel htmlFor="email">Email</RequiredLabel>
          <Input
            id="email"
            type="email"
            placeholder="empresa@email.com"
            {...register("email", {
              required: "Email é obrigatório",
              validate: (value) => isValidEmail(value) || "Email inválido",
            })}
          />
          <FieldErrorMessage error={errors.email} />
        </div>

        <div className="grid gap-2">
          <RequiredLabel htmlFor="phone">Telefone</RequiredLabel>
          <MaskedInput
            id="phone"
            mask="(99) 99999-9999"
            placeholder="(11) 99999-9999"
            {...register("phone", {
              required: "Telefone é obrigatório",
              validate: (value) => isValidPhone(value) || "Telefone inválido",
            })}
          />
          <FieldErrorMessage error={errors.phone} />
        </div>

        <Separator />

        <h2 className="text-2xl font-semibold">Endereço</h2>

        <div className="grid gap-2">
          <RequiredLabel htmlFor="cep">CEP</RequiredLabel>
          <MaskedInput
            id="cep"
            mask="99999-999"
            placeholder="00000-000"
            {...register("cep", {
              required: "CEP é obrigatório",
              validate: (value) => isValidCep(value) || "CEP inválido",
            })}
          />
          <FieldErrorMessage error={errors.cep} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <RequiredLabel htmlFor="street">Rua</RequiredLabel>
            <Input
              id="street"
              placeholder="Ex: Rua das Flores"
              {...register("street", { required: "Rua é obrigatória" })}
            />
          </div>
          <div className="grid gap-2">
            <RequiredLabel htmlFor="number">Número</RequiredLabel>
            <Input
              id="number"
              placeholder="123"
              {...register("number", { required: "Número é obrigatório" })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            placeholder="Apto, Bloco, etc."
            {...register("complement")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <RequiredLabel htmlFor="neighborhood">Bairro</RequiredLabel>
            <Input
              id="neighborhood"
              placeholder="Ex: Centro"
              {...register("neighborhood", { required: "Bairro é obrigatório" })}
            />
          </div>
          <div className="grid gap-2">
            <RequiredLabel htmlFor="city">Cidade</RequiredLabel>
            <Input
              id="city"
              placeholder="Ex: São Paulo"
              {...register("city", { required: "Cidade é obrigatória" })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <RequiredLabel htmlFor="state">Estado</RequiredLabel>
          <Input
            id="state"
            placeholder="Ex: SP"
            {...register("state", { required: "Estado é obrigatório" })}
          />
        </div>

        <Separator />

        <h2 className="text-2xl font-semibold">Outras Informações</h2>

        <div className="grid gap-2">
          <RequiredLabel htmlFor="responsavel">Responsável</RequiredLabel>
          <Input
            id="responsavel"
            placeholder="Nome do responsável"
            {...register("responsavel", { required: "Responsável é obrigatório" })}
          />
        </div>

        <div className="grid gap-2">
          <RequiredLabel htmlFor="segment">Segmento</RequiredLabel>
          <Input
            id="segment"
            placeholder="Ex: Tecnologia, Varejo, etc."
            {...register("segment", { required: "Segmento é obrigatório" })}
          />
        </div>

        <div className="grid gap-2">
          <RequiredLabel htmlFor="status">Status</RequiredLabel>
          <Select onValueChange={(value) => setValue("status", value)} >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
          <FieldErrorMessage error={errors.status} />
        </div>

        <div className="pt-4">
          <Button type="submit">Salvar Empresa</Button>
        </div>
      </div>
    </form>
  );
}
