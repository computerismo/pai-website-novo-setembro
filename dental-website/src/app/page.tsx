import type { Metadata } from 'next';
import ImplantodontiaHome from '@/components/home/ImplantodontiaHome';

export const metadata: Metadata = {
  title: 'Implantodontia | Avaliação e Planejamento Personalizado',
  description: 'Conheça possibilidades de tratamento com implantes dentários, próteses sobre implantes e acompanhamento odontológico com planejamento individualizado.',
  keywords: [
    'implantodontia',
    'implante dentário',
    'prótese sobre implantes',
    'reabilitação oral',
    'avaliação odontológica',
  ],
};

export default function HomePage() {
  return <ImplantodontiaHome />;
}
