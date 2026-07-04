import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bruxismo | Sintomas, Diagnóstico e Tratamentos',
  description:
    'Entenda os sintomas do bruxismo e conheça opções de diagnóstico e tratamento especializado em Governador Valadares.',
  keywords: [
    'bruxismo',
    'sintomas do bruxismo',
    'tratamento de bruxismo',
    'placa miorrelaxante',
    'botox para bruxismo',
  ],
};

export default function BruxismoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
