"use client"

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Name() {
    const [name, setName] = useState('');
    const pathname = usePathname()
    const router = useRouter();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      router.push(`${pathname}/${name}`)
    };
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <form className="bg-white shadow-md rounded px-8 py-8 mb-4 max-w-[400px]" onSubmit={handleSubmit}>
          <h1 className="text-black text-2xl font-bold mb-4">Amigo Secreto - {pathname.split("/")[2]}</h1>
          <p className="text-black mb-8">Informe seu nome igual o informado no cadastro para saber quem você sorteou.</p>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Seu Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                e.target.value = e.target.value.toLowerCase().replace(/\s/g, '');
                setName(e.target.value)
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