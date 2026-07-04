# Rotas de Bruxismo e Página Inicial de Implantodontia

## Objetivo

Reorganizar o conteúdo atual sobre bruxismo sob `/bruxismo` e criar uma nova página inicial de Implantodontia, mantendo com precisão a linguagem visual, os componentes e as interações do site atualizado.

## Arquitetura de rotas

- `/` será a nova página inicial de Implantodontia.
- `/bruxismo` receberá integralmente a página inicial atual sobre bruxismo.
- `/bruxismo/tratamento-bruxismo` receberá a página atual `/tratamento-bruxismo`.
- `/bruxismo/placa-miorrelaxante` receberá a página atual `/placa-miorrelaxante`.
- `/bruxismo/botox-bruxismo` receberá a página atual `/botox-bruxismo`.
- `/blog` e `/blog/[slug]` permanecerão inalterados.

Os três endereços antigos de tratamentos terão redirecionamentos permanentes para os novos endereços. Links internos, navegação, rodapé e cartões passarão a apontar diretamente para as URLs canônicas sob `/bruxismo`.

## Nova página inicial

A página de Implantodontia reutilizará o cabeçalho atual com o componente `FadeGrid` e suas imagens alternadas. Também preservará a navegação, o modal de agendamento, a tipografia, as cores, o modo escuro, os espaçamentos, os cartões, as animações, o rodapé e o botão flutuante do WhatsApp.

O conteúdo provisório será integralmente escrito em português do Brasil. A página terá:

- Hero de Implantodontia com `FadeGrid` e chamadas para agendamento e conteúdo.
- Introdução à Implantodontia.
- Benefícios principais.
- Possibilidades de tratamento.
- Etapas do tratamento.
- Perguntas frequentes.
- Chamada final para agendamento.

Os textos clínicos serão claramente provisórios, mas usarão frases naturais em português brasileiro em vez de Lorem Ipsum para permitir uma avaliação realista do layout.

## Comportamento

A nova página manterá o mesmo fluxo de abertura do modal e envio do formulário usado pela página atual. O FAQ continuará com expansão animada. Nenhum novo sistema de componentes ou dependência será introduzido.

## SEO e compatibilidade

- Cada nova rota terá metadados coerentes em português brasileiro.
- Os redirecionamentos permanentes preservarão acessos e sinais das URLs antigas.
- Não haverá conteúdo duplicado nas URLs antigas.
- O conteúdo e as URLs do blog não serão alterados.

## Verificação

- Confirmar que todos os links internos usam as novas URLs canônicas.
- Confirmar os três redirecionamentos permanentes.
- Executar a validação TypeScript e o build de produção.
- Confirmar que `/`, `/bruxismo` e as três rotas filhas são geradas corretamente.
