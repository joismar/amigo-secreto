import { openDb } from "@/helpers/db";
import { useParams, useRouter } from "next/navigation";
import { GetServerSideProps } from "next/types";
import { useEffect, useState } from "react";

export default function Sortear({ participant, suggestion }: { participant: string, suggestion: string }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [pass, setPass] = useState('');
    const router = useRouter();
    const {nick} = useParams();

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

    return (!authenticated) ? (
        <div className="flex flex-col items-center justify-center h-screen">
        <form className="bg-white shadow-md rounded px-8 py-8 mb-4" onSubmit={handleSubmit}>
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
              <p className="text-gray-700">Você sorteou: <span className="font-bold">{participant}</span></p>
              <p className="text-gray-700">Sugestão de presente: <span className="font-bold">{suggestion}</span></p>
              <div className="w-full flex justify-end pt-8">
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    router.push('/');
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
    const db = await openDb();
    const { id, nick } = context.params!;
    const hasBeenSorteado = await db.get('SELECT * FROM participants WHERE apelido = ? AND sorteado IS NOT NULL', [nick]);
    if (!hasBeenSorteado) {
        const participants = await db.all('SELECT * FROM participants WHERE id = ? AND apelido != ? AND sorteado IS NULL', [id, nick]);
        console.log("participantes", participants);
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        await db.run('UPDATE participants SET sorteado = ? WHERE apelido = ?', [randomParticipant.apelido, nick]);
        return { props: { participant: randomParticipant.apelido, suggestion: randomParticipant.sugestao } };
    } else {
        return { props: { participant: hasBeenSorteado.sorteado, suggestion: hasBeenSorteado.sugestao } };
    }
};
  