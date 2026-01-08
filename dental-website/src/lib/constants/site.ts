export const siteConfig = {
  name: 'Odontologia Especializada',
  description: 'Especialistas em tratamento de bruxismo e disfunções temporomandibulares',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://exemplo.com.br',
  phone: '(33) 99810-7802',
  whatsapp: '5533998107802',
  email: 'sergio.apontamentos@gmail.com',
  address: {
    street: 'Rua Monte Azul, 232',
    neighborhood: 'Bairro Esperança',
    city: 'Governador Valadares',
    state: 'MG',
    zipCode: '35058-140',
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