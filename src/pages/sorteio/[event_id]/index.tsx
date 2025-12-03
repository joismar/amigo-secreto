'use client'

import { useParams, useRouter } from "next/navigation";
import { GetServerSideProps } from "next/types";
import { useState } from "react";
import { sql } from "@vercel/postgres";
import { Event } from "@/helpers/types";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function EventLogin({ event }: { event: Event | null }) {
    const { event_id } = useParams();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);

    if (!event) {
        return (
            <Layout title="Evento Não Encontrado">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Evento não encontrado</h2>
                    <p className="text-christmas-light">O evento que você está procurando não existe.</p>
                </div>
            </Layout>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
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
                const participantEvent = data.events.find((e: { event: Event }) => e.event.id === event_id);

                if (participantEvent) {
                    sessionStorage.setItem(`auth_${event_id}_${participantEvent.participantId}`, 'true');
                    router.push(`/sorteio/${event_id}/${participantEvent.participantId}`);
                } else {
                    alert('Você não participa deste evento.');
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

    return (
        <Layout title={event.name}>
            <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-center">{event.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (!context.params?.event_id || typeof context.params.event_id !== 'string') {
        return { props: { event: null } };
    }

    const eventId = context.params.event_id;

    try {
        const { rows } = await sql<Event>`SELECT * FROM events WHERE id = ${eventId}`;

        if (rows.length === 0) {
            return { props: { event: null } };
        }

        return {
            props: {
                event: rows[0]
            }
        };
    } catch (error) {
        console.error('Error fetching event:', error);
        return { props: { event: null } };
    }
};
