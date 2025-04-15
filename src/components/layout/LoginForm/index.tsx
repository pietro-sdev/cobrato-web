"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosedIcon } from "lucide-react";
import { Logo } from "../Logo";
import { login } from "@/actions/auth/login";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const senha = formData.get("password") as string;
    const result = await login({ email, senha });

    if (result && "error" in result) {
      console.error("Erro de login:", result.error);
    }
  }

  return (
    <form
      action={(formData) => startTransition(() => handleLogin(formData))}
      className={cn("flex flex-col w-full max-w-[1500px] mx-auto", className)}
      {...props}
    >
      <div className="flex flex-col items-start gap-y-3 sm:mb-5">
        <div className="justify-start">
          <a href="#">
            <Logo size={170} />
          </a>
        </div>
        <h1 className="text-3xl leading-tight font-bold">Seja bem-vindo 👋</h1>
        <p className="font-regular text-base text-[#85878D] mb-5 sm:mb-0 w-full">
          Faça login para começar a gerenciar seus projetos..
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2 w-full">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="placeholder:text-[#8897AD]"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="placeholder:text-[#8897AD]"
            />
            <Button
              size="icon"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center text-white hover:text-white/90"
            >
              {showPassword ? <Eye className="h-5 w-5" /> : <EyeClosedIcon className="h-5 w-5" />}
            </Button>
          </div>
          <a
            href="/esqueci-a-senha"
            className="text-sm sm:pt-4 underline-offset-4 hover:underline text-primary"
          >
            Esqueceu sua senha?
          </a>
        </div>

        <Button type="submit" className="w-full bg-primary" disabled={isPending}>
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </form>
  );
}
