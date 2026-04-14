# Base image
FROM node:20-slim AS base
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Dependencies
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate

# Source
COPY . .

# Start

EXPOSE 3002
RUN chmod +x docker-start.sh
CMD ["./docker-start.sh"]

