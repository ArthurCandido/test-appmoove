# Test Appmoove

Um monorepo com backend (Express + Prisma + MySQL) e frontend (Next.js + Tailwind). O backend expõe APIs de usuários e clima; o frontend consome essas APIs.

## Requisitos
- Node.js 18+ (recomendado LTS) e npm/pnpm
- Docker e Docker Compose (opcional, para rodar tudo em containers)

## Estrutura
- `backend/`: API Node/Express com Prisma (MySQL)
- `frontend/`: App Next.js

## Backend

### Variáveis de Ambiente
Crie `backend/.env` baseado em `.env.example` e adicione:
- `DATABASE_URL` e `SHADOW_DATABASE_URL` (já presentes no compose)
- `PORT=4000` (padrão)
- `WEATHER_API_KEY` (chave da https://www.weatherapi.com/)
- `FRONTEND_ORIGIN=http://localhost:3000` (CORS)

Exemplo mínimo `.env` (local, sem Docker):
```
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
SHADOW_DATABASE_URL="mysql://root:password@localhost:3306/shadowdb"
PORT=4000
WEATHER_API_KEY=coloque_sua_chave_aqui
FRONTEND_ORIGIN=http://localhost:3000
```

### Rodando com Docker (recomendado)
Dentro de `backend/`:
```bash
# build e subir db + api
docker compose up --build

# (opcional) executar migrations manualmente
docker compose exec app npx prisma migrate dev --name init

# desligar e limpar volumes
docker compose down -v
```
A API ficará disponível em `http://localhost:4000`.

### Rodando localmente (sem Docker)
1) Suba um MySQL local compatível com a sua `DATABASE_URL`.
2) Instale dependências e gere Prisma Client:
```bash
cd backend
npm ci
npm run prisma:generate
```
3) Rode as migrations (dev):
```bash
npm run prisma:migrate
```
4) Inicie em modo dev:
```bash
npm run dev
```
Ou compile e rode:
```bash
npm run build
npm start
```

### Rotas principais
- `GET /users` | `POST /users` | `GET /users/:id` | `PUT /users/:id` | `DELETE /users/:id`
- `GET /weather/:city` – consulta a WeatherAPI e retorna dados climáticos normalizados.

## Frontend

### Variáveis de Ambiente
Crie `frontend/.env.local` (opcional):
- `NEXT_PUBLIC_API_URL` (padrão: detecta `http://<host>:4000` no browser)

Exemplo:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Rodando o frontend
Dentro de `frontend/`:
```bash
npm ci
npm run dev
```
Acesse `http://localhost:3000`.

## Fluxo de desenvolvimento
- Ajuste o schema em `backend/prisma/schema.prisma`
- Rode `npm run prisma:migrate` no backend
- Se estiver usando Docker, reinicie o serviço `app` após alterações que exijam rebuild

## Troubleshooting
- Erro de CORS: confirme `FRONTEND_ORIGIN` no backend
- 401/403 da WeatherAPI: cheque `WEATHER_API_KEY`
- Migrations falhando: valide `DATABASE_URL` e a saúde do container `db`

## Scripts úteis
Backend:
- `npm run dev` – inicia API com ts-node
- `npm run build` / `npm start` – compila e roda dist
- `npm run prisma:generate` – gera Prisma Client
- `npm run prisma:migrate` – `prisma migrate dev --name init`

Frontend:
- `npm run dev` – Next.js em modo dev
- `npm run build` / `npm start` – build e start do Next (se configurado)
