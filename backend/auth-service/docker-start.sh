#!/bin/sh

echo "Waiting for Auth Database to be ready..."
# A simple way to wait for the DB
npx prisma db push


echo "Starting Auth Service..."
npm start
