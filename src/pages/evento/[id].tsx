'use client'

import { useParams } from "next/navigation";
import { GetServerSideProps } from "next/types";
import { useState } from "react";
import { sql } from "@vercel/postgres";
import { Participant } from "@/helpers/types";

export default function Cadastro({ participants }: { participants: Participant[] }) {
    const { id } = useParams();
    const [nickname, setNickname] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [pass, setPass] = useState('');
  
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const res = await fetch(`/api/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, nickname, suggestion, pass }),
      });
      if (res.status === 409) {
        alert('Apelido já cadastrado!');
        return;
      }
      if (res.ok) {
        setNickname('');
        setSuggestion('');
        setPass('');
        alert('Cadastro realizado com sucesso! Aguarde todos se cadastrarem para realizar o sorteio.');
      }
    };
  
    if (participants.length && participants.every((p) => p.sorteado)) {
      return <div className="flex flex-col items-center justify-center h-screen"><p className="text-red-500">Todos os participantes já foram sorteados!</p></div>;
    }
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <form className="bg-white shadow-md rounded px-8 py-8 mb-4" onSubmit={handleSubmit}>
          <h1 className="text-black text-2xl font-bold mb-8">Amigo Secreto - {id}</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nome ou Apelido (somente uma palavra)</label>
            <input
              type="text"
              placeholder="Ex: fulano"
              value={nickname}
              onChange={(e) => {
                e.target.value = e.target.value.toLowerCase().replace(/\s/g, '');
                setNickname(e.target.value)
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Sugestão de Presentes (até R$ 20)</label>
            <input
              placeholder="Ex: chocolate, livro, etc."
              type="text"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
            <input
              type="text"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
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
    );
  }

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.params?.id || typeof context.params.id !== 'string') {
    return { props: { participants: [] } };
  }
  const { rows } = await sql<Participant>`SELECT * FROM participants WHERE id = ${context.params?.id}`;
  return { props: { participants: rows } };
};