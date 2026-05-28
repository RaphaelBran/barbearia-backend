# Backend - Integração Google Calendar

## Configuração do Google Cloud Console

### Passo 1: Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Select a project" → "New Project"
3. Nome do projeto: "Barbearia 3 Monkeys"
4. Clique em "Create"

### Passo 2: Ativar Google Calendar API

1. No projeto criado, vá para "APIs & Services" → "Library"
2. Pesquise por "Google Calendar API"
3. Clique em "Enable"

### Passo 3: Criar Credenciais OAuth2

1. Vá para "APIs & Services" → "Credentials"
2. Clique em "Create Credentials" → "OAuth client ID"
3. Configure o consent screen:
   - User type: External
   - App name: "Barbearia 3 Monkeys"
   - User support email: seu email
   - Developer contact: seu email
   - Clique em "Save and Continue"
4. Scopes:
   - Clique em "Add or Remove Scopes"
   - Selecione: `https://www.googleapis.com/auth/calendar.events`
   - Clique em "Update"
   - Clique em "Save and Continue"
5. Test users:
   - Clique em "Add users"
   - Adicione o email dos barbeiros
   - Clique em "Save and Continue"
6. OAuth client ID:
   - Application type: Web application
   - Name: "Barbearia Backend"
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback`
     - `https://seu-dominio.com/auth/google/callback`
   - Clique em "Create"

### Passo 4: Copiar Credenciais

1. Copie o **Client ID** e **Client Secret**
2. Cole no arquivo `.env`:
   ```
   GOOGLE_CLIENT_ID=seu_client_id
   GOOGLE_CLIENT_SECRET=seu_client_secret
   ```

## Configuração do Banco de Dados

### Opção 1: PostgreSQL Local

1. Instale PostgreSQL no seu computador
2. Crie um banco de dados:
   ```sql
   CREATE DATABASE barbearia;
   ```
3. Atualize o `.env`:
   ```
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/barbearia
   ```

### Opção 2: Supabase (Gratuito)

1. Acesse [Supabase](https://supabase.com/)
2. Crie um projeto gratuito
3. Vá em Settings → Database
4. Copie a Connection String
5. Cole no arquivo `.env`

## Como Executar

1. Instale as dependências:
   ```bash
   cd backend
   npm install
   ```

2. Configure as variáveis de ambiente no arquivo `.env`

3. Inicie o servidor:
   ```bash
   npm start
   ```

4. O servidor estará rodando em `http://localhost:3000`

## Fluxo de Autorização

1. Cada barbeiro precisa autorizar o acesso ao Google Calendar
2. Acesse: `http://localhost:3000/auth/google?barber_id=1`
3. Faça login com conta Google do barbeiro
4. Autorize o acesso ao calendário
5. O token será salvo no banco de dados

## Endpoints da API

### Autenticação
- `GET /auth/google` - Iniciar autorização OAuth2
- `GET /auth/google/callback` - Callback do OAuth2

### Agendamentos
- `POST /api/booking` - Criar agendamento
- `GET /api/booking/barber/:barber_id` - Listar agendamentos

### Calendário
- `POST /api/calendar/event` - Criar evento no Google Calendar

## Exemplo de Uso

### Criar Agendamento e Evento no Calendário

```javascript
// 1. Criar agendamento
fetch('http://localhost:3000/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        barber_id: 1,
        client_name: 'João Silva',
        client_phone: '15999999999',
        service: 'Corte',
        price: 50,
        booking_date: '2024-05-21',
        booking_time: '14:00'
    })
});

// 2. Criar evento no calendário
fetch('http://localhost:3000/api/calendar/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        barber_id: 1,
        client_name: 'João Silva',
        service: 'Corte',
        booking_date: '2024-05-21',
        booking_time: '14:00'
    })
});
```
