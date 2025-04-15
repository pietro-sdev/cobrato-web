'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function MensagemBoletoPage() {
  const [mensagem, setMensagem] = useState(
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      toast.success('Mensagem salva com sucesso!')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-4xl font-bold">Mensagem Automática de Boleto</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Esta mensagem será enviada ao cliente toda vez que um boleto for emitido.
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          rows={6}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Olá {{nome}}, seu boleto foi gerado! Acesse aqui: {{link}}"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Mensagem'}
        </Button>
      </form>
    </div>
  )
}
