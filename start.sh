#!/bin/bash
# Kill any processes on port 3000 or 5173 to be safe
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

echo "Starting Server..."
cd server && npm start &
SERVER_PID=$!

echo "Starting Client..."
cd client && npm run dev &
CLIENT_PID=$!

wait
