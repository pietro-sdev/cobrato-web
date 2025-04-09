import validator from "validator";

export function isValidEmail(value: string): boolean {
  return validator.isEmail(value);
}
