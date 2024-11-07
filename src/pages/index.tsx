import localFont from "next/font/local";
import { useRouter } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function Home() {
  const router = useRouter();

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} justify-center items-center h-screen min-h-screen font-[family-name:var(--font-geist-sans)]`}>      
      <main className="flex flex-col gap-8 row-start-2 justify-center items-center h-screen">
        <div className="bg-white shadow-md rounded px-8 py-8 mb-4 flex flex-col gap-4">
          <p className="text-black text-lg pt-6 pb-10 px-14">Amigo Secreto</p>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => router.push("/novo")}
          >
            Entrar
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => router.push("/sortear")}
          >
            Sortear
          </button>
        </div>
      </main>
    </div>
  );
}
