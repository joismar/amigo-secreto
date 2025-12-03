'use client'

import { useParams, useRouter } from "next/navigation";
import { GetServerSideProps } from "next/types";
import { useState } from "react";
import { sql } from "@vercel/postgres";
import { Participant, Event } from "@/helpers/types";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function EventJoin({ participants, event }: { participants: Participant[], event: Event | null }) {
    const { event_id } = useParams();
    const router = useRouter();
    const [nickname, setNickname] = useState('');
    const [suggestion, setSuggestion] = useState('');
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

    if (participants.length && participants.every((p) => p.sorteado)) {
        return (
            <Layout title={event.name}>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-christmas-gold mb-4">{event.name}</h2>
                    <p className="text-red-500">Todos os participantes já foram sorteados!</p>
                </div>
            </Layout>
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/cadastro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ event_id, nickname, suggestion, email, pass }),
            });

            if (res.status === 409) {
                alert('Email já cadastrado neste evento!');
                return;
            }

            if (res.ok) {
                setNickname('');
                setSuggestion('');
                setEmail('');
                setPass('');
                alert('Cadastro realizado com sucesso! Aguarde todos se cadastrarem para realizar o sorteio.');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('Erro ao realizar cadastro');
        } finally {
            setLoading(false);
        }
    };

    const rootUrl = typeof window !== 'undefined' ? window.location.origin : '';

    async function shareUrl() {
        if (navigator?.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: 'Participe do sorteio!',
                    url: rootUrl + `/evento/${event_id}`,
                });
                console.log('Página compartilhada com sucesso!');
            } catch (error) {
                console.error('Erro ao compartilhar:', error);
            }
        }
    }

    return (
        <Layout title={event.name}>
            <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-center">{event.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Nome/Apelido"
                        value={nickname}
                        onChange={(e) => {
                            const value = e.target.value.toLowerCase().replace(/\s/g, '');
                            setNickname(value);
                        }}
                        placeholder="Ex: fulano"
                        required
                    />
                    <Input
                        label="Sugestão de Presentes"
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        placeholder="Ex: chocolate, livro, etc."
                    />
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
                    <div className="flex justify-between items-center pt-4">
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/sorteio/${event_id}`)}
                            >
                                Ver Sorteio
                            </Button>
                            <Button
                                variant="outline"
                                onClick={shareUrl}
                            >
                                Compartilhar
                            </Button>
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (!context.params?.event_id || typeof context.params.event_id !== 'string') {
        return { props: { participants: [], event: null } };
    }

    const eventId = context.params.event_id;

    try {
        // Fetch event
        const { rows: eventRows } = await sql<Event>`SELECT * FROM events WHERE id = ${eventId}`;

        if (eventRows.length === 0) {
            return { props: { participants: [], event: null } };
        }

        // Fetch participants
        const { rows: participantRows } = await sql<Participant>`SELECT * FROM participants WHERE event_id = ${eventId}`;

        return {
            props: {
                participants: participantRows,
                event: eventRows[0]
            }
        };
    } catch (error) {
        console.error('Error fetching event:', error);
        return { props: { participants: [], event: null } };
    }
};
