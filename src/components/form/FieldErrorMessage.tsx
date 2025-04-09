type Props = {
    error?: { message?: string };
  };
  
  export function FieldErrorMessage({ error }: Props) {
    if (!error?.message) return null;
    return <p className="text-red-500 text-sm">{String(error.message)}</p>;
  }
  