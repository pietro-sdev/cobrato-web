import axios from "axios";
import https from "https";

export type OAuthTokenResponse = {
  success: boolean;
  accessToken?: string;
  error?: string;
};

/**
 * Parâmetros para gerar token OAuth no Inter (sandbox ou produção).
 */
interface GenerateTokenParams {
  clientId: string;
  clientSecret: string;
  certificadoBase64: string; // conteúdo do .pfx em base64
  senhaCertificado: string;  // passphrase do .pfx
  ambiente: "sandbox" | "production";
}

/**
 * Passo 1: Obter access token via OAuth2 client_credentials usando mTLS
 * Com escopo "boleto-cobranca.write" (no portal do Inter).
 */
export async function generateOAuthTokenInter({
  clientId,
  clientSecret,
  certificadoBase64,
  senhaCertificado,
  ambiente,
}: GenerateTokenParams): Promise<OAuthTokenResponse> {
  try {
    // Converte o certificado Base64 em Buffer
    const pfxBuffer = Buffer.from(certificadoBase64, "base64");

    // Cria um agent HTTPS com o certificado e a passphrase
    const agent = new https.Agent({
      pfx: pfxBuffer,
      passphrase: senhaCertificado,
    });

    // Se quiser FORÇAR sandbox, basta fixar a url,
    // mas mantemos condicional pra "production" também
    const baseOauth =
      ambiente === "sandbox"
        ? "https://cdpj-sandbox.partners.uatinter.co/oauth/v2/token"
        : "https://cdpj.partners.inter.com.br/oauth/v2/token";

    // Faz POST com grant_type=client_credentials
    const resp = await axios.post(
      baseOauth,
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        auth: { username: clientId, password: clientSecret },
        httpsAgent: agent,
      }
    );

    if (!resp.data?.access_token) {
      return { success: false, error: "Resposta do OAuth sem access_token." };
    }

    return { success: true, accessToken: resp.data.access_token };
  } catch (error: any) {
    console.error("Erro ao obter token Inter:", error?.response?.data || error);
    return { success: false, error: "Falha ao autenticar no Banco Inter." };
  }
}

////////////////////////////////////////////////////////////////

/**
 * Parâmetros mínimos para criar um boleto no Inter (modo assíncrono, v3).
 */
interface CriarBoletoParams {
  accessToken: string;       // Token obtido no passo 1 (escopo correto)
  ambiente: "sandbox" | "production";
  valor: number;             // Valor do boleto (100.0)
  vencimento: string;        // "YYYY-MM-DD"
  descricao: string;         // Ex: "Assinatura mensal"
  nomeCliente: string;       // Ex: "João da Silva"

  certificadoBase64: string; // .pfx base64
  senhaCertificado: string;  // pass do .pfx
}

/**
 * Passo 2: Criar o boleto (cobrança) usando o token e o certificado (mTLS).
 * Endpoint v3, assíncrono. Ao emitir, Inter dispara callback no webhook.
 */
export async function criarBoletoInter({
  accessToken,
  ambiente,
  valor,
  vencimento,
  descricao,
  nomeCliente,
  certificadoBase64,
  senhaCertificado,
}: CriarBoletoParams): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // mTLS agent
    const pfxBuffer = Buffer.from(certificadoBase64, "base64");
    const agent = new https.Agent({
      pfx: pfxBuffer,
      passphrase: senhaCertificado,
    });

    // URL do sandbox ou produção (cobranca/v3)
    const baseUrl =
      ambiente === "sandbox"
        ? "https://cdpj-sandbox.partners.uatinter.co/cobranca/v3"
        : "https://cdpj.partners.inter.com.br/cobranca/v3";

    // Exemplo mínimo de corpo
    const body = {
      seuNumero: "ABC123",           // Identificador interno que vc controla
      dataVencimento: vencimento,    // "2025-05-30"
      valorNominal: valor,          // ex: 100.0
      pagador: {
        cnpjCpf: "12345678901",     // Ajuste se quiser algo do front
        nome: nomeCliente,
      },
      mensagem: {
        linha1: descricao,
      },
      // Ex: "numDiasAgenda", "formasRecebimento", etc, podem ser adicionados
    };

    // Faz POST com agent mTLS e Bearer token
    const resp = await axios.post(`${baseUrl}/cobrancas`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        // x-conta-corrente: "1234567", // se precisar especificar a conta
      },
      httpsAgent: agent,
    });

    return { success: true, data: resp.data };
  } catch (error: any) {
    console.error("Erro ao criar boleto Inter:", error?.response?.data || error);
    return { success: false, error: "Falha ao criar o boleto no Banco Inter." };
  }
}
