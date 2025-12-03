'use client'

import { Participant, Event } from "@/helpers/types";
import { sql } from "@vercel/postgres";
import { useParams, useRouter } from "next/navigation";
import { GetServerSideProps } from "next/types";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";

export default function SortearPage({ participants, event }: { participants: Participant[], event: Event | null }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { event_id } = useParams();

    if (!event) {
        return (
            <Layout title="Erro">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Erro</h2>
                    <p className="text-christmas-light">Evento não encontrado.</p>
                    <Button
                        className="mt-4"
                        onClick={() => router.push('/sorteio')}
                    >
                        Voltar
                    </Button>
                </div>
            </Layout>
        );
    }

    const handleShuffle = async () => {
        if (!confirm('Tem certeza que deseja realizar o sorteio? Isso irá sobrescrever qualquer sorteio anterior.')) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/shuffle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eventId: event_id }),
            });

            const data = await res.json();

            if (data.success) {
                alert('Sorteio realizado com sucesso!');
                router.push('/sorteio');
            } else {
                alert('Erro ao realizar sorteio: ' + (data.message || 'Erro desconhecido'));
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao realizar sorteio');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title={`Sortear - ${event.name}`}>
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-center">Painel de Sorteio - {event.name}</h2>

                <div className="bg-christmas-dark/50 p-6 rounded-lg border border-christmas-gold/20 mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">Participantes ({participants.length})</h3>
                    <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {participants.map((p) => (
                            <li key={p.id} className="flex justify-between items-center bg-christmas-red/10 p-3 rounded border border-christmas-red/20">
                                <span className="font-bold text-christmas-light">{p.apelido}</span>
                                <span className="text-sm text-gray-400 italic truncate max-w-[200px]">{p.sugestao || 'Sem sugestão'}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    <Button
                        onClick={handleShuffle}
                        disabled={loading || participants.length < 2}
                        className="w-full bg-christmas-gold hover:bg-yellow-600 text-christmas-dark font-bold py-4 text-lg"
                    >
                        {loading ? 'Sorteando...' : 'Realizar Sorteio'}
                    </Button>

                    {participants.length < 2 && (
                        <p className="text-red-500 text-center text-sm">É necessário pelo menos 2 participantes para realizar o sorteio.</p>
                    )}

                    <Button
                        variant="outline"
                        onClick={() => router.push('/sorteio')}
                        className="w-full"
                    >
                        Voltar
                    </Button>
                </div>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { event_id } = context.params!;

    if (!event_id || typeof event_id !== 'string') {
        return { props: {} };
    }

    try {
        // Fetch event
        const { rows: eventRows } = await sql<Event>`SELECT * FROM events WHERE id = ${event_id}`;
        if (eventRows.length === 0) return { props: {} };

        // Fetch all participants
        const { rows: participants } = await sql<Participant>`SELECT * FROM participants WHERE event_id = ${event_id}`;

        return {
            props: {
                participants,
                event: eventRows[0]
            }
        };
    } catch (error) {
        console.error(error);
        return { props: {} };
    }
};
