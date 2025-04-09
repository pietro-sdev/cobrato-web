-- DropForeignKey
ALTER TABLE "PermissaoFuncionario" DROP CONSTRAINT "PermissaoFuncionario_usuarioId_fkey";

-- AddForeignKey
ALTER TABLE "PermissaoFuncionario" ADD CONSTRAINT "PermissaoFuncionario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
