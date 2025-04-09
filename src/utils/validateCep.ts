export function isValidCep(value: string): boolean {
    return /^[0-9]{5}-?[0-9]{3}$/.test(value);
  }
  
  export async function fetchAddressByCep(cep: string) {
    const cleanCep = cep.replace(/\D/g, "");
  
    if (!isValidCep(cleanCep)) return null;
  
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
  
      if (data.erro) return null;
  
      return {
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      };
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      return null;
    }
  }
  