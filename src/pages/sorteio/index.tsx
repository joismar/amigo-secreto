'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "../../components/Layout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Event } from "@/helpers/types";

type UserEvent = {
  event: Event;
  participantId: string;
}

export default function Sorteio() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [step, setStep] = useState<'login' | 'select'>('login');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, pass }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.events.length === 0) {
          alert('Nenhum evento encontrado para este usuário.');
        } else {
          setUserEvents(data.events);
          // If only one event, select it automatically
          if (data.events.length === 1) {
            setSelectedEventId(data.events[0].event.id);
          }
          setStep('select');
        }
      } else {
        alert('Erro ao entrar: ' + (data.message || 'Credenciais inválidas'));
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
      alert('Selecione um evento');
      return;
    }

    const selectedEvent = userEvents.find(ue => ue.event.id === selectedEventId);
    if (selectedEvent) {
      router.push(`/sorteio/${selectedEvent.event.id}/${selectedEvent.participantId}`);
    }
  };

  return (
    <Layout title="Ver Sorteio">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-center">
          {step === 'login' ? 'Login' : 'Escolha o Evento'}
        </h2>

        {step === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
            <Input
              label="Senha"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="******"
              required
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSelectEvent} className="space-y-6">
            <Select
              label="Evento"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              options={[
                { value: '', label: 'Selecione um evento' },
                ...userEvents.map(ue => ({
                  value: ue.event.id,
                  label: ue.event.name
                }))
              ]}
              required
            />
            <div className="flex justify-between pt-4 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('login');
                  setUserEvents([]);
                  setEmail('');
                  setPass('');
                }}
              >
                Voltar
              </Button>
              <Button type="submit" className="flex-1">
                Ver Sorteio
              </Button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}