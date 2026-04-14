#!/bin/sh

echo "Waiting for Task Database to be ready..."
npx prisma migrate deploy

echo "Starting Task Service..."
npm start
