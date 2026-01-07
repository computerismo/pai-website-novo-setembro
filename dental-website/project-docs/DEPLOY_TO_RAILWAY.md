# Como Fazer Deploy Desta Documentação no Railway 🚂

Este guia explica como colocar a pasta `project-docs` online usando o Railway. Como este é um site estático (HTML/JS/CSS), usaremos um container **Nginx** leve e performático.

## 📋 Pré-requisitos

1. Uma conta no [Railway.app](https://railway.app/).
2. Este código estar em um repositório GitHub.

---

## 🚀 Passo a Passo

### 1. Criar um Dockerfile

Crie um arquivo chamado `Dockerfile` **dentro desta pasta** (`dental-website/project-docs/`) com o seguinte conteúdo:

```dockerfile
# Usar imagem leve do Nginx
FROM nginx:alpine

# Copiar os arquivos estáticos para a pasta pública do Nginx
COPY . /usr/share/nginx/html

# O Nginx expõe a porta 80 por padrão
EXPOSE 80

# Comando para iniciar o servidor
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Configurar no Railway

1. Acesse o [Railway Dashboard](https://railway.app/dashboard).
2. Clique em **New Project** → **Deploy from GitHub repo**.
3. Selecione o repositório deste projeto.
4. **IMPORTANTE:** Assim que o projeto for criado, o deploy provavelmente falhará ou tentará rodar a raiz. Você precisa configurar o diretório correto:
   - Clique no box do serviço criado.
   - Vá em **Settings** (Configurações).
   - Procure por **Root Directory**.
   - Altere para: `dental-website/project-docs`
   - O Railway detectará automaticamente o `Dockerfile` que você criou nesse diretório e iniciará um novo build.

### 3. Gerar URL Pública

1. Ainda nas configurações do serviço, vá na aba **Networking**.
2. Clique em **Generate Domain**.
3. O Railway criará uma URL (ex: `project-docs-production.up.railway.app`) onde seu site estará acessível para todos.

---

## 💡 Por que este método?

- **Performance:** O Nginx é incrivelmente rápido para servir arquivos estáticos.
- **Custo:** Quase zero de uso de RAM/CPU.
- **Simplicidade:** Não requer Node.js, Python ou builds complexos. É apenas copiar arquivos e servir.
