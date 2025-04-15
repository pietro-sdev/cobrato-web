"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { verifyResetCode } from "@/actions/auth/forgot-password/verify-reset-code";

interface Props {
  email: string;
  onVerified: (code: string) => void;
  onBack: () => void;
}

export default function StepVerifyCode({ email, onVerified, onBack }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await verifyResetCode(email, code);

      if ("error" in result) {
        setError(result.error || "Erro ao verificar código.");
        return;
      }

      onVerified(code);
    } catch (err) {
      setError("Erro ao verificar código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Código de Verificação</h1>
      <p className="text-gray-500 text-sm">
        Enviamos um código de 6 dígitos para <strong>{email}</strong>. Digite-o abaixo:
      </p>

      <div className="space-y-2">
        <Label htmlFor="otp">Código</Label>
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={handleVerify}
          disabled={code.length !== 6 || loading}
        >
          {loading ? "Verificando..." : "Verificar"}
        </Button>
      </div>
    </div>
  );
}
