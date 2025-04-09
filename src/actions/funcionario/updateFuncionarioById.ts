import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  userId: z.string().uuid(),
  cnpj: z.string(),
  nome: z.string(),
  email: z.string().email(),
  telefone: z.string(),
  permissoes: z.array(z.string()),
});

export async function updateFuncionarioById(data: unknown) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos." };
  }
  const { userId, cnpj, nome, email, telefone, permissoes } = parsed.data;

  try {
    const funcionario = await prisma.usuario.findFirst({
      where: {
        id: userId,
        empresa: { cnpj },
      },
    });

    if (!funcionario) {
      return { success: false, error: "Funcionário não encontrado ou não pertence à empresa." };
    }

    await prisma.usuario.update({
      where: { id: userId },
      data: {
        nome,
        email,
        telefone,
      },
    });

    await prisma.permissaoFuncionario.deleteMany({
      where: { usuarioId: userId },
    });

    await prisma.permissaoFuncionario.create({
      data: {
        usuarioId: userId,
        visualizarCobrancas: permissoes.includes("view_charges"),
        emitirBoletos: permissoes.includes("create_charges"),
        cancelarCobranca: permissoes.includes("cancel_charges"),
        recorrencia: permissoes.includes("recurrence"),
        configurarBoletos: permissoes.includes("config_boleto"),
        acessoRelatorios: permissoes.includes("reports"),
        baixaManual: permissoes.includes("manual_payment"),
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro interno ao atualizar funcionário." };
  }
}
