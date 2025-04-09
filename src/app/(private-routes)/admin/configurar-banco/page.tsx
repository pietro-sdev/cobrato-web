"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";

export default function ConfigurarBancosPage() {
  const { cnpj, isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [inter, setInter] = useState({
    clientId: "",
    clientSecret: "",
    certificadoBase64: "",
    senhaCertificado: "",
    webhookUrl: "",
    ambiente: "sandbox",
  });

  const [sicoob, setSicoob] = useState({
    clientId: "",
    clientSecret: "",
    certificadoBase64: "",
    senhaCertificado: "",
    webhookUrl: "",
  });

  const [asaas, setAsaas] = useState({
    accessToken: "",
    pixKey: "",
    webhookUrl: "",
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!cnpj || !isAuthenticated) {
      setError("CNPJ não encontrado no AuthStore ou usuário não autenticado.");
      setLoading(false);
      return;
    }

    const fetchConfigs = async () => {
      try {
        const res = await fetch(`/api/bancos-config/${cnpj}`);
        const json = await res.json();
        if (!json.success) {
          setError(json.error || "Não foi possível obter configs.");
          setLoading(false);
          return;
        }

        if (json.configs.inter) {
          setInter((prev) => ({ ...prev, ...json.configs.inter }));
        }
        if (json.configs.sicoob) {
          setSicoob((prev) => ({ ...prev, ...json.configs.sicoob }));
        }
        if (json.configs.asaas) {
          setAsaas((prev) => ({ ...prev, ...json.configs.asaas }));
        }

        setLoading(false);
      } catch (e) {
        console.error("Erro ao buscar configs:", e);
        setError("Erro ao buscar configs bancárias.");
        setLoading(false);
      }
    };

    fetchConfigs();
  }, [cnpj, isHydrated, isAuthenticated]);

  const handleSave = async (bank: "inter" | "sicoob" | "asaas") => {
    if (!cnpj) return alert("CNPJ da empresa não encontrado.");

    const config = bank === "inter" ? inter : bank === "sicoob" ? sicoob : asaas;
    const payload = {
      banco: bank,
      configuracoes: config,
      empresaCnpj: cnpj,
    };

    try {
      const res = await fetch("/api/bancos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        alert("Configuração salva com sucesso!");
      } else {
        alert(json.error || "Erro ao salvar configuração");
      }
    } catch (err) {
      console.error("Erro ao salvar configuração:", err);
      alert("Erro na comunicação com o servidor.");
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-14 h-14 text-gray-600" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Erro: {error}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuração de Bancos</h1>
        <p className="text-gray-500">
          Defina as chaves de acesso para integração.
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="inter" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="inter">Banco Inter</TabsTrigger>
          <TabsTrigger value="sicoob">Sicoob</TabsTrigger>
          <TabsTrigger value="asaas">Asaas</TabsTrigger>
        </TabsList>

        <TabsContent value="inter" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Client ID</Label>
              <Input
                value={inter.clientId}
                onChange={(e) =>
                  setInter({ ...inter, clientId: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Client Secret</Label>
              <Input
                value={inter.clientSecret}
                onChange={(e) =>
                  setInter({ ...inter, clientSecret: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Senha do Certificado (.pfx)</Label>
              <Input
                type="password"
                value={inter.senhaCertificado}
                onChange={(e) =>
                  setInter({ ...inter, senhaCertificado: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Ambiente</Label>
              <select
                className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm"
                value={inter.ambiente}
                onChange={(e) => setInter({ ...inter, ambiente: e.target.value })}
              >
                <option value="sandbox">Sandbox</option>
                <option value="production">Produção</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Webhook URL</Label>
              <Input
                value={inter.webhookUrl}
                onChange={(e) =>
                  setInter({ ...inter, webhookUrl: e.target.value })
                }
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Certificado (.pfx) - base64</Label>
              <Input
                placeholder="Cole aqui o base64 do certificado .pfx"
                value={inter.certificadoBase64}
                onChange={(e) =>
                  setInter({ ...inter, certificadoBase64: e.target.value })
                }
              />
            </div>
          </div>

          <Button onClick={() => handleSave("inter")}>Salvar Configurações</Button>
        </TabsContent>

        <TabsContent value="sicoob" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Client ID</Label>
              <Input
                value={sicoob.clientId}
                onChange={(e) =>
                  setSicoob({ ...sicoob, clientId: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Client Secret</Label>
              <Input
                value={sicoob.clientSecret}
                onChange={(e) =>
                  setSicoob({ ...sicoob, clientSecret: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Senha do Certificado (.pfx)</Label>
              <Input
                type="password"
                value={sicoob.senhaCertificado}
                onChange={(e) =>
                  setSicoob({ ...sicoob, senhaCertificado: e.target.value })
                }
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Webhook URL</Label>
              <Input
                value={sicoob.webhookUrl}
                onChange={(e) =>
                  setSicoob({ ...sicoob, webhookUrl: e.target.value })
                }
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Certificado (.pfx) - base64</Label>
              <Input
                placeholder="Cole aqui o base64 do certificado .pfx"
                value={sicoob.certificadoBase64}
                onChange={(e) =>
                  setSicoob({ ...sicoob, certificadoBase64: e.target.value })
                }
              />
            </div>
          </div>

          <Button onClick={() => handleSave("sicoob")}>Salvar Configurações</Button>
        </TabsContent>

        <TabsContent value="asaas" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Access Token</Label>
              <Input
                value={asaas.accessToken}
                onChange={(e) =>
                  setAsaas({ ...asaas, accessToken: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Chave Pix (opcional)</Label>
              <Input
                value={asaas.pixKey}
                onChange={(e) => setAsaas({ ...asaas, pixKey: e.target.value })}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Webhook URL</Label>
              <Input
                value={asaas.webhookUrl}
                onChange={(e) => setAsaas({ ...asaas, webhookUrl: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={() => handleSave("asaas")}>Salvar Configurações</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
