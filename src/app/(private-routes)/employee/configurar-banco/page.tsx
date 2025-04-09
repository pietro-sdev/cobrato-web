"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ConfigurarBancosPage() {
  const [inter, setInter] = useState({
    clientId: "",
    clientSecret: "",
    webhookUrl: "",
  });

  const [sicoob, setSicoob] = useState({
    cooperativa: "",
    conta: "",
    token: "",
  });

  const [asaas, setAsaas] = useState({
    accessToken: "",
    pixKey: "",
    webhookUrl: "",
  });

  const handleSave = (bank: "inter" | "sicoob" | "asaas") => {
    const data = bank === "inter" ? inter : bank === "sicoob" ? sicoob : asaas;
    console.log(`Configurações salvas para ${bank}:`, data);
    // Aqui você pode salvar via fetch/post/api route
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuração de Bancos</h1>
        <p className="text-gray-500">Defina as chaves de acesso para integração.</p>
      </div>

      <Separator />

      <Tabs defaultValue="inter" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="inter">Banco Inter</TabsTrigger>
          <TabsTrigger value="sicoob">Sicoob</TabsTrigger>
          <TabsTrigger value="asaas">Asaas</TabsTrigger>
        </TabsList>

        {/* INTER */}
        <TabsContent value="inter" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Client ID</Label>
              <Input
                value={inter.clientId}
                onChange={(e) =>
                  setInter((prev) => ({ ...prev, clientId: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Client Secret</Label>
              <Input
                value={inter.clientSecret}
                onChange={(e) =>
                  setInter((prev) => ({ ...prev, clientSecret: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Webhook URL</Label>
              <Input
                value={inter.webhookUrl}
                onChange={(e) =>
                  setInter((prev) => ({ ...prev, webhookUrl: e.target.value }))
                }
              />
            </div>
          </div>
          <Button onClick={() => handleSave("inter")}>Salvar Configurações</Button>
        </TabsContent>

        {/* SICOOB */}
        <TabsContent value="sicoob" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Cooperativa</Label>
              <Input
                value={sicoob.cooperativa}
                onChange={(e) =>
                  setSicoob((prev) => ({ ...prev, cooperativa: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Conta</Label>
              <Input
                value={sicoob.conta}
                onChange={(e) =>
                  setSicoob((prev) => ({ ...prev, conta: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Token API</Label>
              <Input
                value={sicoob.token}
                onChange={(e) =>
                  setSicoob((prev) => ({ ...prev, token: e.target.value }))
                }
              />
            </div>
          </div>
          <Button onClick={() => handleSave("sicoob")}>Salvar Configurações</Button>
        </TabsContent>

        {/* ASAAS */}
        <TabsContent value="asaas" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Access Token</Label>
              <Input
                value={asaas.accessToken}
                onChange={(e) =>
                  setAsaas((prev) => ({ ...prev, accessToken: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Chave Pix (opcional)</Label>
              <Input
                value={asaas.pixKey}
                onChange={(e) =>
                  setAsaas((prev) => ({ ...prev, pixKey: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Webhook URL</Label>
              <Input
                value={asaas.webhookUrl}
                onChange={(e) =>
                  setAsaas((prev) => ({ ...prev, webhookUrl: e.target.value }))
                }
              />
            </div>
          </div>
          <Button onClick={() => handleSave("asaas")}>Salvar Configurações</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
