import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Instance() {
    const [instance, setInstance] = useState('');
    const router = useRouter();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      router.push(`/sortear/${instance}`)
    };
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <form className="bg-white shadow-md rounded px-8 py-8 mb-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nome do Evento</label>
            <input
              type="text"
              value={instance}
              onChange={(e) => {
                e.target.value = e.target.value.toLowerCase().replace(/\s/g, '');
                setInstance(e.target.value)
              }}
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