"use client";

import React from "react";
import InputMask from "react-input-mask";
import { Input } from "@/components/ui/input";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  mask: string;
};

export const MaskedInput = React.forwardRef<HTMLInputElement, Props>(
  ({ mask, ...props }, ref) => {
    return (
      <InputMask mask={mask} {...props}>
        {(inputProps: any) => <Input {...inputProps} ref={ref} />}
      </InputMask>
    );
  }
);

MaskedInput.displayName = "MaskedInput";
