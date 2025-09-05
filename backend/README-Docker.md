# Docker - Instruções rápidas

1. Copie `.env.example` para `.env` e ajuste se necessário.
2. Construa e suba os serviços:

```bash
docker compose up --build
```

3. A API estará em `http://localhost:4000`.

4. Para rodar migrations manualmente dentro do container (dev):

```bash
docker compose exec app npx prisma migrate dev --name init
```

5. Para parar e remover containers:

```bash
docker compose down -v
```
