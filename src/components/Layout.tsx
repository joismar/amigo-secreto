import React, { ReactNode } from 'react';
import Head from 'next/head';
import Image from 'next/image';

interface LayoutProps {
    children: ReactNode;
    title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title = 'Amigo Secreto' }) => {
    return (
        <div className="min-h-screen bg-christmas-dark text-christmas-light font-sans selection:bg-christmas-gold selection:text-christmas-dark relative overflow-hidden">
            <Head>
                <title>{title}</title>
                <meta name="description" content="Amigo Secreto App" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Image
                src="/images/lights_and_balls.svg"
                width={100}
                height={100}
                alt="Lights and Balls"
                className="absolute top-0 left-0 z-0 w-[70vw] max-w-[500px]"
            />

            <Image
                src="/images/leafs.svg"
                width={100}
                height={100}
                alt="Leafs"
                className="absolute bottom-0 right-0 z-0 w-[90vw] max-w-[500px]"
            />

            <main className="container mx-auto px-4 py-4 max-w-4xl relative z-10">
                <header className="mb-4 backdrop-blur-sm rounded-xl border border-white/5 p-6 md:p-8 shadow-2xl text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-sm h-12 md:h-20">
                        Amigo Secreto
                    </h1>
                    <p className="mt-2 text-christmas-gold/80 text-lg">
                        Organize seu sorteio de Natal com facilidade
                    </p>
                </header>

                <div className="mb-14 backdrop-blur-sm rounded-xl border border-white/5 p-6 md:p-8 shadow-2xl">
                    {children}
                </div>

                <footer className="fixed bottom-0 left-0 right-0 w-full z-50 text-center text-sm text-green-500 p-4 backdrop-blur-sm border-t border-white/5">
                    <p>Feito com ❤️ por joismar.dev. Feliz Natal! © {new Date().getFullYear()}</p>
                </footer>
            </main>
        </div>
    );
};
