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
RUN npm run build

# Start
EXPOSE 3001
CMD ["npm", "start"]
