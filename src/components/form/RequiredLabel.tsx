import { Label } from "@/components/ui/label";

type Props = {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
};

export function RequiredLabel({ htmlFor, children, required = true }: Props) {
  return (
    <Label htmlFor={htmlFor}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
  );
}
