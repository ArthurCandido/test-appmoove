#!/bin/sh
set -e

# Gera o client do prisma e aplica migrations (deploy)
npx prisma generate
npx prisma migrate deploy || true

# Roda a aplicação (versão compilada)
npm run start
