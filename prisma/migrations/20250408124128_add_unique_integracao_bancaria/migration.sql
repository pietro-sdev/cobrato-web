/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,banco]` on the table `IntegracaoBancaria` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "IntegracaoBancaria_empresaId_banco_key" ON "IntegracaoBancaria"("empresaId", "banco");
