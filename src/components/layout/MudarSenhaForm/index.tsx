"use client";

import { useState } from "react";
import StepEnterEmail from "./_components/StepEnterEmail";
import StepVerifyCode from "./_components/StepVerifyCode";
import StepResetPassword from "./_components/StepResetPassword";
import { Logo } from "@/components/layout/Logo";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="flex flex-col w-full max-w-[1500px] mx-auto">
      <div className="flex flex-col items-start gap-y-3 sm:mb-5">
        <div className="justify-start">
          <a href="/">
            <Logo size={170} />
          </a>
        </div>
      </div>

      <div className="w-full max-w-md space-y-6">
        {step === 1 && (
          <StepEnterEmail
            onSuccess={(enteredEmail) => {
              setEmail(enteredEmail);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <StepVerifyCode
            email={email}
            onVerified={(code) => {
              setOtp(code);
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepResetPassword
            email={email}
            code={otp}
            onSuccess={() => setStep(1)}
          />
        )}
      </div>
    </div>
  );
}
