#!/bin/sh

echo "Waiting for Auth Database to be ready..."
# A simple way to wait for the DB
npx prisma migrate deploy

echo "Starting Auth Service..."
npm start
