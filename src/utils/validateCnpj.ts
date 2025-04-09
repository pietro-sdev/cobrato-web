import { cnpj } from "cpf-cnpj-validator";

export function isValidCnpj(value: string): boolean {
  return cnpj.isValid(value);
}
