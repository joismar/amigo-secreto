import React, { ReactNode } from 'react';
import Head from 'next/head';

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

            <div className="overflow-hidden fixed top-0 left-0 pointer-events-none z-0 transform scale-x-[-1]">
                <img
                    src="/images/decorations/borders.png"
                    alt="Decoration"
                    className="object-cover w-full h-full opacity-90"
                    style={{ clipPath: 'rect(0 100% 66% 33%)' }}
                />
            </div>

            <div className="overflow-hidden fixed bottom-0 right-0 pointer-events-none z-0 transform scale-x-[-1]">
                <img
                    src="/images/decorations/borders.png"
                    alt="Decoration"
                    className="object-cover w-full h-full opacity-90"
                    style={{ clipPath: 'rect(50% 66% 100% 0)' }}
                />
            </div>

            <main className="container mx-auto px-4 py-4 max-w-4xl relative z-10">
                <header className="mb-4 backdrop-blur-sm rounded-xl border border-white/5 p-6 md:p-8 shadow-2xl text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-sm h-12 md:h-20">
                        Amigo Secreto
                    </h1>
                    <p className="mt-2 text-christmas-gold/80 text-lg">
                        Organize seu sorteio de Natal com facilidade
                    </p>
                </header>

                <div className="backdrop-blur-sm rounded-xl border border-white/5 p-6 md:p-8 shadow-2xl">
                    {children}
                </div>

                <footer className="mt-12 text-center text-sm text-gray-500">
                    <p>Feito com ❤️ por joismar.dev. Feliz Natal! © {new Date().getFullYear()}</p>
                </footer>
            </main>
        </div>
    );
};
