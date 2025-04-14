"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface ColumnConfig {
  key: string;
  label: string;
  isStatus?: boolean;
  isBold?: boolean;
  render?: (item: Record<string, any>) => React.ReactNode;
}

interface GenericTableProps {
  data: Record<string, any>[];
  columns: ColumnConfig[];
  onRowClick?: (item: Record<string, any>) => void;
  enableActions?: boolean;
}

export function GenericTable({
  data,
  columns,
  onRowClick,
  enableActions = false,
}: GenericTableProps) {
  const router = useRouter();

  // Função auxiliar para formatar status
  const formatStatus = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pendente") return "Pendente";
    // Você pode adicionar outras formatações se precisar
    return status;
  };

  return (
    <div className="w-full space-y-3">
      {/* Cabeçalho - apenas em telas grandes */}
      <div className="hidden lg:grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] text-sm font-bold text-gray-500 border px-4 py-3 border-[#E4E4E4] rounded-md bg-[#F9F9F9]">
        {columns.map((col) => (
          <span key={col.key}>{col.label}</span>
        ))}
      </div>

      {/* Conteúdo - modo responsivo */}
      {data.map((item, idx) => (
        <React.Fragment key={idx}>
          {/* Versão para telas grandes */}
          <div
            onClick={() => onRowClick?.(item)}
            className="hidden lg:grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] items-center rounded-md border border-[#E4E4E4] bg-white px-4 py-3 text-[15px] cursor-pointer hover:bg-[#F3F3F3] transition-colors"
          >
            {columns.map((col) => {
              const value = item[col.key];

              if (col.render && enableActions) {
                return (
                  <span key={col.key} onClick={(e) => e.stopPropagation()}>
                    {col.render(item)}
                  </span>
                );
              }

              if (col.isStatus) {
                let colorClasses = "";
                let dotColor = "";
                // Utilize o valor formatado
                const formattedValue = value
                  ? formatStatus(value)
                  : value;

                switch (value?.toLowerCase()) {
                  case "ativo":
                  case "pago":
                    colorClasses = "bg-green-100 text-green-700";
                    dotColor = "bg-green-600";
                    break;
                  case "inativo":
                  case "pendente":
                    colorClasses = "bg-red-100 text-red-600";
                    dotColor = "bg-red-600";
                    break;
                  case "em andamento":
                    colorClasses = "bg-blue-100 text-blue-600";
                    dotColor = "bg-blue-600";
                    break;
                  default:
                    colorClasses = "bg-gray-100 text-gray-500";
                    dotColor = "bg-gray-500";
                }

                return (
                  <span key={col.key}>
                    <Badge
                      variant="outline"
                      className={`px-2 py-[2px] text-xs font-medium border-none ${colorClasses}`}
                    >
                      <span className={`h-2 w-2 mr-1 rounded-full ${dotColor}`} />
                      {formattedValue}
                    </Badge>
                  </span>
                );
              }

              return (
                <span
                  key={col.key}
                  className={col.isBold ? "font-semibold" : "text-gray-500"}
                >
                  {value}
                </span>
              );
            })}
          </div>

          {/* Versão para telas pequenas (empilhado) */}
          <div
            onClick={() => onRowClick?.(item)}
            className="lg:hidden flex flex-col gap-1 border border-[#E4E4E4] rounded-md px-4 py-3 bg-white text-[15px] hover:bg-[#F3F3F3] transition-colors"
          >
            {columns.map((col) => {
              const value = item[col.key];
              const formattedValue =
                value && col.isStatus ? formatStatus(value) : value;

              return (
                <div key={col.key} className="flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-gray-500">
                    {col.label}
                  </span>
                  {col.render && enableActions ? (
                    <span onClick={(e) => e.stopPropagation()} className="text-right">
                      {col.render(item)}
                    </span>
                  ) : col.isStatus ? (
                    <Badge
                      variant="outline"
                      className={`px-2 py-[2px] text-xs font-medium border-none ${
                        value?.toLowerCase() === "pago"
                          ? "bg-green-100 text-green-700"
                          : value?.toLowerCase() === "em andamento"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 mr-1 rounded-full ${
                          value?.toLowerCase() === "pago"
                            ? "bg-green-600"
                            : value?.toLowerCase() === "em andamento"
                            ? "bg-blue-600"
                            : "bg-gray-500"
                        }`}
                      />
                      {formattedValue}
                    </Badge>
                  ) : (
                    <span className={`text-right ${col.isBold ? "font-semibold" : "text-gray-700"}`}>
                      {value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
