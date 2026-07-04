# Rotas de Bruxismo e Página Inicial de Implantodontia — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganizar as páginas de bruxismo sob `/bruxismo` e criar em `/` uma página inicial de Implantodontia em português brasileiro, preservando com precisão a UI e o comportamento atuais.

**Architecture:** Mover os componentes de página existentes para rotas aninhadas do App Router, mantendo seu conteúdo e comportamento. Criar a nova página inicial a partir da estrutura da homepage atual, reutilizando `FadeGrid`, navegação, modal, formulário, cartões, FAQ, rodapé e WhatsApp; configurar redirecionamentos permanentes no Next.js e atualizar todos os links canônicos.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide React

---

### Task 1: Mover as rotas de bruxismo

**Files:**
- Create: `src/app/bruxismo/page.tsx`
- Create: `src/app/bruxismo/tratamento-bruxismo/page.tsx`
- Create: `src/app/bruxismo/placa-miorrelaxante/page.tsx`
- Create: `src/app/bruxismo/botox-bruxismo/page.tsx`
- Delete: `src/app/tratamento-bruxismo/page.tsx`
- Delete: `src/app/placa-miorrelaxante/page.tsx`
- Delete: `src/app/botox-bruxismo/page.tsx`

- [ ] **Step 1:** Mover `src/app/page.tsx` para `src/app/bruxismo/page.tsx` sem alterar sua UI ou comportamento.
- [ ] **Step 2:** Mover as três páginas de tratamento para as respectivas pastas abaixo de `src/app/bruxismo`.
- [ ] **Step 3:** Enumerar `src/app/**/page.tsx` e confirmar que as páginas movidas existem somente nas novas rotas.

### Task 2: Criar a homepage de Implantodontia

**Files:**
- Create: `src/app/page.tsx`

- [ ] **Step 1:** Reutilizar a composição interativa da homepage atual: `Navigation`, `FadeGrid`, `Modal`, `LeadForm`, `Footer`, `WhatsAppButton`, estado do modal e FAQ animado.
- [ ] **Step 2:** Criar o hero com o título “Implantodontia”, texto provisório natural em português brasileiro, botão de agendamento e link para a seção de tratamentos.
- [ ] **Step 3:** Criar as seções “O que é Implantodontia”, “Benefícios”, “Possibilidades de tratamento”, “Etapas do tratamento”, FAQ e CTA final usando as mesmas classes de layout, cores, bordas, sombras, modo escuro e responsividade da homepage atual.
- [ ] **Step 4:** Definir títulos, descrições, CTAs, textos alternativos e mensagens do modal exclusivamente em `pt-BR`.

### Task 3: Configurar redirects e URLs canônicas

**Files:**
- Modify: `next.config.mjs`
- Modify: `src/components/shared/Navigation.tsx`
- Modify: `src/components/shared/Footer.tsx`
- Modify: `src/app/bruxismo/page.tsx`
- Modify: `src/app/bruxismo/tratamento-bruxismo/page.tsx`
- Modify: `src/app/page-backup.tsx`
- Modify any additional source file returned by the stale-link search.

- [ ] **Step 1:** Adicionar `redirects()` com `permanent: true` para:

```text
/tratamento-bruxismo -> /bruxismo/tratamento-bruxismo
/placa-miorrelaxante -> /bruxismo/placa-miorrelaxante
/botox-bruxismo      -> /bruxismo/botox-bruxismo
```

- [ ] **Step 2:** Atualizar navegação, rodapé, cartões e links cruzados para as novas URLs e adicionar `/bruxismo` como visão geral do tratamento.
- [ ] **Step 3:** Pesquisar `src` pelas três URLs antigas; aceitar ocorrências somente na configuração explícita dos redirects.
- [ ] **Step 4:** Confirmar que nenhuma rota ou link de `/blog` foi alterado.

### Task 4: Verificar a implementação

**Files:**
- Verify only; generated `.next` output must remain untracked.

- [ ] **Step 1:** Executar `npm.cmd run build` e exigir compilação, TypeScript, Prisma e geração das novas rotas sem erros.
- [ ] **Step 2:** Executar `git diff --check` e exigir zero erros de whitespace.
- [ ] **Step 3:** Executar uma busca final por links antigos e revisar `git status --short` para confirmar somente o escopo planejado.
