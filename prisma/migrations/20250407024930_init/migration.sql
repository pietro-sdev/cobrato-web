-- CreateEnum
CREATE TYPE "Role" AS ENUM ('super_admin', 'admin', 'employee');

-- CreateEnum
CREATE TYPE "BoletoStatus" AS ENUM ('pendente', 'pago', 'vencido', 'cancelado', 'em_andamento');

-- CreateEnum
CREATE TYPE "BancoIntegrado" AS ENUM ('inter', 'sicoob', 'asaas');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "empresaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "segmento" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cobranca" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "descricao" TEXT,
    "vencimento" TIMESTAMP(3) NOT NULL,
    "status" "BoletoStatus" NOT NULL,
    "tipo" TEXT NOT NULL,
    "recorrenteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cobranca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissaoFuncionario" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "visualizarCobrancas" BOOLEAN NOT NULL DEFAULT false,
    "emitirBoletos" BOOLEAN NOT NULL DEFAULT false,
    "cancelarCobranca" BOOLEAN NOT NULL DEFAULT false,
    "recorrencia" BOOLEAN NOT NULL DEFAULT false,
    "configurarBoletos" BOOLEAN NOT NULL DEFAULT false,
    "acessoRelatorios" BOOLEAN NOT NULL DEFAULT false,
    "baixaManual" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PermissaoFuncionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegracaoBancaria" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "banco" "BancoIntegrado" NOT NULL,
    "configuracoes" JSONB NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegracaoBancaria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Endereco_empresaId_key" ON "Endereco"("empresaId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cobranca" ADD CONSTRAINT "Cobranca_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissaoFuncionario" ADD CONSTRAINT "PermissaoFuncionario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegracaoBancaria" ADD CONSTRAINT "IntegracaoBancaria_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
