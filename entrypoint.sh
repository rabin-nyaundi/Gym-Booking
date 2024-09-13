#!/bin/sh

# Wait for the database to be ready
echo "Waiting for database to be ready..."
./wait-for-it.sh db:5432 --timeout=30 --strict -- echo "Database is up and running!"

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
npm start