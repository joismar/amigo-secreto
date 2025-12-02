import React, { ReactNode } from 'react';
import Head from 'next/head';

interface LayoutProps {
    children: ReactNode;
    title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title = 'Amigo Secreto' }) => {
    return (
        <div className="min-h-screen bg-christmas-dark text-christmas-light font-sans selection:bg-christmas-gold selection:text-christmas-dark">
            <Head>
                <title>{title}</title>
                <meta name="description" content="Amigo Secreto App" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green drop-shadow-sm">
                        Amigo Secreto
                    </h1>
                    <p className="mt-2 text-christmas-gold/80 text-lg">
                        Organize seu sorteio de Natal com facilidade
                    </p>
                </header>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-6 md:p-8 shadow-2xl">
                    {children}
                </div>

                <footer className="mt-12 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Amigo Secreto. Feliz Natal!</p>
                </footer>
            </main>
        </div>
    );
};
