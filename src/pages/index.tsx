import { useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <div className="flex flex-col gap-8 items-center">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-christmas-gold">Bem-vindo ao Amigo Secreto!</h2>
          <div className="text-christmas-light/90 space-y-2 text-lg">
            <p>Organizar sua troca de presentes nunca foi tão fácil:</p>
            <ol className="list-decimal list-inside space-y-1 text-left inline-block">
              <li>Crie um novo evento</li>
              <li>Cadastre ou compartilhe o link para os participantes</li>
              <li>Compartilhe o link para o sorteio</li>
              <li>Sorteie e veja quem é o seu amigo secreto</li>
            </ol>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            type="button"
            className="bg-christmas-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onClick={() => router.push("/evento")}
          >
            Novo Evento
          </button>
          <button
            type="button"
            className="bg-christmas-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            onClick={() => router.push("/sorteio")}
          >
            Sortear
          </button>
        </div>
      </div>
    </Layout>
  );
}
