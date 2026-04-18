#!/bin/sh

echo "Waiting for Task Database to be ready..."
npx prisma db push


echo "Starting Task Service..."
npm start
