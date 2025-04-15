"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/actions/auth/forgot-password/reset-password";
import { useRouter } from "next/navigation";
import { Eye, EyeClosedIcon } from "lucide-react";

interface Props {
  email: string;
  code: string;
  onSuccess: () => void;
}

export default function StepResetPassword({ email, code, onSuccess }: Props) {
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (senha !== confirmar) {
      setError("Senhas não conferem.");
      return;
    }

    try {
      setLoading(true);
      const result = await resetPassword(email, senha);

      if ("error" in result) {
        setError(typeof result.error === "string" ? result.error : "Erro desconhecido");
        return;
      }

      onSuccess();
      router.push("/login");
    } catch {
      setError("Erro ao redefinir a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <h1 className="text-2xl font-bold">Nova Senha</h1>
      <p className="text-gray-500 text-sm">
        Agora defina uma nova senha para sua conta.
      </p>

      <div>
        <Label htmlFor="senha">Nova Senha</Label>
        <div className="relative">
          <Input
            id="senha"
            name="senha"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua nova senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="placeholder:text-[#8897AD]"
          />
          <Button
            size="icon"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center text-white hover:text-white/90"
          >
            {showPassword ? <Eye className="h-5 w-5" /> : <EyeClosedIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirmar">Confirmar Nova Senha</Label>
        <div className="relative">
          <Input
            id="confirmar"
            name="confirmar"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirme sua nova senha"
            required
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            className="placeholder:text-[#8897AD]"
          />
          <Button
            size="icon"
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center text-white hover:text-white/90"
          >
            {showConfirm ? <Eye className="h-5 w-5" /> : <EyeClosedIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Salvando..." : "Salvar Nova Senha"}
      </Button>
    </form>
  );
}
