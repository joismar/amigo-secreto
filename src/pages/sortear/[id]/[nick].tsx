'use client'

import { Participant } from "@/helpers/types";
import { sql } from "@vercel/postgres";
import { useParams, useRouter } from "next/navigation";
import { GetServerSideProps } from "next/types";
import { useState } from "react";

export default function Sortear({ participant }: { participant: Participant }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [pass, setPass] = useState('');
    const router = useRouter();
    const { nick } = useParams();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        fetch(`/api/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nick, pass }),
        }).then((res) => {
          if (res.status === 401) {
            setError('Senha incorreta');
            return;
          };
          setAuthenticated(true);
        })
    };

    if (!participant) return (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-red-500">Evento ou participante não encontrado!</p>
        </div>
    );

    return (!authenticated) ? (
        <div className="flex flex-col items-center justify-center h-screen">
        <form className="bg-white shadow-md rounded px-8 py-8 mb-4" onSubmit={handleSubmit}>
          <h1 className="text-black text-2xl font-bold mb-4">Amigo Secreto - {participant.id}</h1>
          <h1 className="text-black text-md mb-8">Digite a senha pra saber quem você sorteou!</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
            <input
              type="text"
              value={pass}
              onChange={(e) => {
                e.target.value = e.target.value.toLowerCase().replace(/\s/g, '');
                setPass(e.target.value)
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <p className="text-red-500">{error}</p>
          </div>
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="bg-white shadow-md rounded px-8 py-8 mb-4">
          <h1 className="text-black text-2xl font-bold mb-8">Amigo Secreto - {participant.id}</h1>
              <p className="text-gray-700">Você sorteou: <span className="font-bold">{participant.apelido}</span></p>
              <p className="text-gray-700">Sugestão de presente: <span className="font-bold">{participant.sugestao}</span></p>
              <div className="w-full flex justify-end pt-8">
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    router.push(`/sortear/${participant.id}`);
                  }}
                >
                  Sair
                </button>
              </div>
          </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id, nick } = context.params!;
    
    if (!id || typeof id !== 'string' || !nick || typeof nick !== 'string') return { props: {} };
    
    await sql`UPDATE participants SET status = false WHERE apelido = ${nick}`;
    const { rows: sortRows } = await sql<Participant>`SELECT * FROM participants WHERE apelido = ${nick} AND sorteado IS NOT NULL AND status = true`;
    
    if (!sortRows.length) {
        const { rows } = await sql<Participant>`SELECT * FROM participants WHERE id = ${id} AND apelido != ${nick} AND APELIDO NOT IN (SELECT sorteado FROM participants WHERE NOT NULL)`;
        if (!rows.length) return { props: {} };
        const randomParticipant = rows[Math.floor(Math.random() * rows.length)];
        await sql`UPDATE participants SET sorteado = ${randomParticipant.apelido} WHERE apelido = ${nick}`;
        await sql`UPDATE participants SET status = true WHERE apelido = ${nick}`;
        return { props: { participant: randomParticipant } };
    } else {
        await sql`UPDATE participants SET status = true WHERE apelido = ${nick}`;
        const participant = sortRows[0];
        return { props: { participant } };
    }
};
  