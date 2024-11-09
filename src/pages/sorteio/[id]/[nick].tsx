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
          if (res.status === 200) {
            setAuthenticated(true);
            return;
          }
          setError('Senha incorreta');
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
                    router.push(`/sorteio/${participant.id}`);
                  }}
                >
                  Sair
                </button>
              </div>
          </div>
        </div>
    );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const { id, nick } = context.params!;
    
//     if (!id || typeof id !== 'string' || !nick || typeof nick !== 'string') return { props: {} };
    
//     const { rows: sorteadoRows } = await sql<Participant>`SELECT * FROM participants WHERE apelido = ${nick} AND sorteado IS NOT NULL`;
    
//     if (!sorteadoRows.length) {
//         const { rows } = await sql<Participant>`SELECT * FROM participants WHERE id = ${id} AND apelido != ${nick} AND apelido NOT IN (SELECT sorteado FROM participants WHERE sorteado IS NOT NULL)`;
//         if (!rows.length) return { props: {} };
//         const randomParticipant = rows[Math.floor(Math.random() * rows.length)];
//         await sql`UPDATE participants SET sorteado = ${randomParticipant.apelido} WHERE apelido = ${nick}`;
//         return { props: { participant: randomParticipant } };
//     } else {
//         const participant = sorteadoRows[0];
//         return { props: { participant } };
//     }
// };

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, nick } = context.params!;
    
  if (!id || typeof id !== 'string' || !nick || typeof nick !== 'string') return { props: {} };
  
  const { rows: me } = await sql<Participant>`SELECT * FROM participants WHERE apelido = ${nick}`;
  if (me[0].sorteado === null) {
    const { rows: participants } = await sql<Participant>`SELECT * FROM participants`;

    if (participants.length < 2) return { props: {} };

    let shuffled = [...participants];
    let attempts = 0;
    do {
        shuffled = shuffleArray(participants);
        attempts++;
    } while (hasSelfAssignment(participants, shuffled) && attempts < 100);

    if (hasSelfAssignment(participants, shuffled)) {
        return { props: {} };
    }

    await Promise.all(
        participants.map((participant, index) =>
            sql`UPDATE participants SET sorteado = ${shuffled[index].apelido} WHERE apelido = ${participant.apelido}`
        )
    );

    const { rows: meUpdated } = await sql<Participant>`SELECT * FROM participants WHERE apelido = ${nick}`;
    const { rows } = await sql<Participant>`SELECT * FROM participants WHERE apelido = ${meUpdated[0].sorteado}`;
    return { props: { participant: rows[0] } };
  } else {
    const { rows: meUpdated } = await sql<Participant>`SELECT * FROM participants WHERE apelido = ${nick}`;
    const { rows } = await sql<Participant>`SELECT * FROM participants WHERE apelido = ${meUpdated[0].sorteado}`;
    return { props: { participant: rows[0] } };
  }
};

function shuffleArray(array: Participant[]): Participant[] {
  return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
}

function hasSelfAssignment(original: Participant[], shuffled: Participant[]): boolean {
  return original.some((participant, index) => participant.apelido === shuffled[index].apelido);
}
