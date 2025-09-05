# Dockerfile (recomendado: Debian slim)
FROM node:18-bullseye-slim

WORKDIR /usr/src/app

# ferramentas básicas e openssl
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl build-essential python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Copia package.json e instala dependências (cache eficiente)
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --prefer-offline

# Copia arquivos de configuração e código fonte (sem testes)
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY .env.example ./
COPY docker-entrypoint.sh ./

# Gera Prisma client e compila TypeScript
RUN npx prisma generate
RUN npm run build

# Permissões e entrypoint
RUN chmod +x ./docker-entrypoint.sh
EXPOSE 4000
CMD ["./docker-entrypoint.sh"]
