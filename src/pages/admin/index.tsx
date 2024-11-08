'use client'

import { Participant, openDb } from "@/helpers/db";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useState } from "react";

export default function Admin({ participants, availableIds }: { participants: Participant[], availableIds: string[] }) {
    const router = useRouter();
    const [id, setId] = useState('');
  
    const handleRemoveAll = async () => {
      if (!id) return;
      const res = await fetch(`/api/admin/removeAll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert('Todos os participantes foram removidos com sucesso!');
        router.reload();
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-black text-2xl font-bold mb-8">Administração</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Selecionar Sessão</label>
            <select
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Selecione uma sessão</option>
              {availableIds.map((availableId) => (
                <option key={availableId} value={availableId}>{availableId}</option>
              ))}
            </select>
          </div>
          {id && (
            <>
              <ul className="mb-4">
                {participants.map((participant, index) => (
                  <li key={index} className="border-b border-gray-200 py-2">
                    <span className="font-bold">Apelido:</span> {participant.apelido} - <span className="font-bold">Sugestão:</span> {participant.sugestao}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleRemoveAll}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Remover Todos os Participantes
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
  
  export const getServerSideProps: GetServerSideProps = async () => {
    const db = await openDb();
    const availableIds = await db.all('SELECT DISTINCT id FROM participants');
    return { props: { participants: [], availableIds: availableIds.map((row) => row.id) } };
  };