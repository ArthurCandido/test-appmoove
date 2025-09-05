FROM node:18-bullseye-slim

WORKDIR /usr/src/app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl build-essential python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci --no-audit --prefer-offline

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY .env.example ./
COPY docker-entrypoint.sh ./

RUN npx prisma generate
RUN npm run build

RUN chmod +x ./docker-entrypoint.sh
EXPOSE 4000
CMD ["./docker-entrypoint.sh"]
