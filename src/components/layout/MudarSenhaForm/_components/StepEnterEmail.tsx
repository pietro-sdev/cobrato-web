"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { sendResetCode } from "@/actions/auth/forgot-password/send-reset-code";

interface Props {
  onSuccess: (email: string) => void;
}

export default function StepEnterEmail({ onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await sendResetCode(email);

      if ("error" in response) {
        setError(response.error ?? "Erro desconhecido");
        setLoading(false);
        return;
      }

      onSuccess(email);
    } catch (err) {
      setError("Erro ao enviar o código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">Esqueceu sua senha?</h1>
      <p className="text-gray-500 text-sm">
        Digite seu e-mail para enviarmos um código de verificação.
      </p>

      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@exemplo.com"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar código"}
      </Button>
    </form>
  );
}
