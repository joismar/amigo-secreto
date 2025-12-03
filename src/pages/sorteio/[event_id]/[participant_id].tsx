'use client'

import { Participant, Event } from "@/helpers/types";
import { sql } from "@vercel/postgres";
import { useParams, useRouter } from "next/navigation";
import { GetServerSideProps } from "next/types";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";

export default function Sortear({ participant, me, event }: { participant?: Participant | null, me?: Participant | null, event?: Event | null }) {
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();
    const { event_id, participant_id } = useParams();

    useEffect(() => {
        if (event_id && participant_id) {
            const isAuth = sessionStorage.getItem(`auth_${event_id}_${participant_id}`);
            if (isAuth === 'true') {
                setAuthenticated(true);
            } else {
                router.push(`/sorteio/${event_id}`);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event_id, participant_id]);

    const errorMessage = (() => {
        switch (true) {
            case !authenticated:
                return "Você não tem permissão para acessar esta página.";
            case !me:
                return "Usuário não encontrado.";
            case !event:
                return "Evento não encontrado.";
            case !participant:
                return "Sorteio ainda não realizado.";
            default:
                return null;
        }
    })();

    if (errorMessage) {
        return (
            <Layout title="Erro">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Erro</h2>
                    <p className="text-christmas-light">{errorMessage}</p>
                    <Button
                        className="mt-4"
                        onClick={() => router.push('/sorteio')}
                    >
                        Voltar
                    </Button>
                </div>
            </Layout>
        )
    }

    return (
        <Layout title={event?.name || 'Amigo Secreto'}>
            <div className="max-w-md mx-auto text-center">
                <h2 className="text-2xl font-bold text-christmas-gold mb-8">{event?.name}</h2>

                <div className="bg-christmas-red/20 p-8 rounded-lg border border-christmas-gold/30 mb-8 transform transition-all hover:scale-105">
                    <p className="text-christmas-light mb-2 text-lg">Você tirou:</p>
                    <h3 className="text-4xl font-bold text-white mb-6 animate-pulse">{participant?.apelido}</h3>

                    <div className="border-t border-christmas-gold/30 pt-6">
                        <p className="text-christmas-light mb-2">Sugestão de presente:</p>
                        <p className="text-xl text-christmas-gold italic">&quot;{participant?.sugestao}&quot;</p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    onClick={() => router.push('/sorteio')}
                    className="w-full"
                >
                    Sair
                </Button>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { event_id, participant_id } = context.params!;

    if (!event_id || typeof event_id !== 'string' || !participant_id || typeof participant_id !== 'string') {
        return { props: {} };
    }

    try {
        const { rows: eventRows } = await sql<Event>`SELECT * FROM events WHERE id = ${event_id}`;
        if (eventRows.length === 0) return { props: {} };

        const { rows: meRows } = await sql<Participant>`SELECT * FROM participants WHERE id = ${participant_id} AND event_id = ${event_id}`;
        if (meRows.length === 0) return { props: {} };

        const me = meRows[0];

        if (!me.sorteado) {
            return { props: { me, event: eventRows[0], participant: null } };
        }

        const { rows: drawnRows } = await sql<Participant>`SELECT * FROM participants WHERE apelido = ${me.sorteado} AND event_id = ${event_id}`;

        return {
            props: {
                participant: drawnRows[0] || null,
                me,
                event: eventRows[0]
            }
        };
    } catch (error) {
        console.error(error);
        return { props: {} };
    }
};
