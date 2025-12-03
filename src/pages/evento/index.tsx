'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Layout } from "../../components/Layout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function NewEvent() {
  const [eventName, setEventName] = useState('');
  const [nickname, setNickname] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventName, nickname, suggestion, email, pass }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/evento/${data.eventId}`);
      } else {
        alert('Erro ao criar evento: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Novo Evento">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-center">Novo Evento</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome do Evento"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Ex: Natal da Família"
            required
          />
          <Input
            label="Seu Apelido"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Ex: João"
            required
          />
          <Input
            label="Sugestão de Presente"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Ex: Livro"
            required
          />
          <Input
            label="Email do Admin"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
          <Input
            label="Senha do Admin"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="******"
            required
          />
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? 'Criando...' : 'Criar Evento'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}