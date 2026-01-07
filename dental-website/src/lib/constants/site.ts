export const siteConfig = {
  name: 'Odontologia Especializada',
  description: 'Especialistas em tratamento de bruxismo e disfunções temporomandibulares',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://exemplo.com.br',
  phone: '(11) 99999-9999',
  whatsapp: '5511999999999',
  email: 'contato@exemplo.com.br',
  address: {
    street: 'Rua Exemplo, 123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
  },
  social: {
    instagram: 'https://instagram.com/clinicaexemplo',
    facebook: 'https://facebook.com/clinicaexemplo',
  },
  openingHours: {
    weekdays: 'Segunda a Sexta: 8h às 18h',
    saturday: 'Sábado: 8h às 12h',
    sunday: 'Domingo: Fechado',
  },
};