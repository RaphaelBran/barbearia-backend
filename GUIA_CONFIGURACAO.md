# Guia de Configuração - Integração Google Calendar

## Passo 1: Configurar Supabase (Banco de Dados Gratuito)

### 1.1 Criar conta no Supabase
1. Acesse: https://supabase.com/
2. Clique em "Start your project"
3. Faça login com GitHub ou Google
4. Clique em "New Project"

### 1.2 Criar projeto
- **Name:** barbearia
- **Database Password:** crie uma senha forte (anote!)
- **Region:** South America (São Paulo)
- Clique em "Create new project"

### 1.3 Obter Connection String
1. Aguarde o projeto ser criado (2-3 minutos)
2. Vá em Settings → Database
3. Role até "Connection string"
4. Clique em "URI" e copie a connection string
5. Substitua `[YOUR-PASSWORD]` pela senha que você criou
6. Exemplo: `postgresql://postgres:[SUA-SENHA]@db.xxx.supabase.co:5432/postgres`

### 1.4 Atualizar arquivo .env
Abra o arquivo `backend/.env` e atualize:
```
DATABASE_URL=postgresql://postgres:[SUA-SENHA]@db.xxx.supabase.co:5432/postgres
```

## Passo 2: Configurar Google Cloud Console

### 2.1 Criar projeto no Google Cloud
1. Acesse: https://console.cloud.google.com/
2. Clique no seletor de projetos (topo)
3. Clique em "New Project"
4. Nome: "Barbearia 3 Monkeys"
5. Clique em "Create"

### 2.2 Ativar Google Calendar API
1. No projeto criado, vá para "APIs & Services" → "Library"
2. Pesquise: "Google Calendar API"
3. Clique em "Enable"

### 2.3 Configurar OAuth Consent Screen
1. Vá para "APIs & Services" → "OAuth consent screen"
2. User type: External
3. Clique em "Create"
4. Preencha:
   - App name: Barbearia 3 Monkeys
   - User support email: seu email
   - Developer contact: seu email
5. Clique em "Save and Continue" (3 vezes)

### 2.4 Criar credenciais OAuth2
1. Vá para "APIs & Services" → "Credentials"
2. Clique em "Create Credentials" → "OAuth client ID"
3. Application type: Web application
4. Name: Barbearia Backend
5. Authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
6. Clique em "Create"
7. Copie o **Client ID** e **Client Secret**

### 2.5 Atualizar arquivo .env
Adicione ao arquivo `backend/.env`:
```
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
PORT=3000
```

### 2.6 Adicionar usuários de teste
1. Na tela de OAuth consent screen
2. Vá em "Test users"
3. Clique em "Add users"
4. Adicione os emails dos barbeiros:
   - Email do Eduardo
   - Email do Caique
   - Email do Jorge
5. Clique em "Save"

## Passo 3: Inicializar Banco de Dados

### 3.1 Instalar barbeiros no banco
No terminal, execute:
```bash
cd backend
node init-db.js
```

Você deve ver:
```
Banco de dados inicializado com sucesso
Barbeiro Eduardo inserido com sucesso
Barbeiro Caique inserido com sucesso
Barbeiro Jorge inserido com sucesso
Banco de dados inicializado com os barbeiros!
```

## Passo 4: Iniciar Servidor Backend

### 4.1 Iniciar o servidor
```bash
cd backend
npm start
```

Você deve ver:
```
Servidor rodando em http://localhost:3000
```

## Passo 5: Autorizar Barbeiros no Google Calendar

### 5.1 Autorizar Eduardo
1. Abra o navegador
2. Acesse: `http://localhost:3000/auth/google?barber_id=1`
3. Faça login com a conta Google do Eduardo
4. Autorize o acesso ao calendário
5. Você será redirecionado para `/?auth=success`

### 5.2 Autorizar Caique
1. Acesse: `http://localhost:3000/auth/google?barber_id=2`
2. Faça login com a conta Google do Caique
3. Autorize o acesso ao calendário

### 5.3 Autorizar Jorge
1. Acesse: `http://localhost:3000/auth/google?barber_id=3`
2. Faça login com a conta Google do Jorge
3. Autorize o acesso ao calendário

## Passo 6: Testar Integração

### 6.1 Acessar o site
1. Abra: `http://localhost:3000`
2. Clique em um barbeiro
3. Clique em "Agendar Horário"
4. Preencha: serviço, data, horário, nome, telefone
5. Clique em "Confirmar Agendamento"

### 6.2 Verificar
1. O agendamento será salvo no banco de dados
2. Um evento será criado automaticamente no Google Calendar do barbeiro
3. Abra o Google Calendar do barbeiro para verificar

## Solução de Problemas

### Erro: "Barbeiro não autorizou Google Calendar"
- Solução: O barbeiro precisa acessar a URL de autorização primeiro

### Erro: "Connection refused"
- Solução: Verifique se o servidor backend está rodando

### Erro: "Invalid credentials"
- Solução: Verifique se as credenciais do Google estão corretas no .env

### Erro: "Connection to database failed"
- Solução: Verifique se a connection string do Supabase está correta
