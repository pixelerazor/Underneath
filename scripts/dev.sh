#!/bin/bash
# Development startup script

set -e

echo "🚀 Starting Underneath development environment..."

# Function to check port availability
check_port() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

# Check for port conflicts and show custom ports if configured
if [[ -f .port-mappings ]]; then
    echo "📌 Using custom port configuration:"
    cat .port-mappings | grep -E "^\s+-" | sed 's/^  //'
    echo ""
fi

# Start Docker containers
docker compose up -d

# Wait for database to be ready
echo "Waiting for database..."
sleep 5

# Run Prisma migrations
echo "Running database migrations..."
docker compose exec backend npx prisma migrate dev --name init || true

# Show logs
echo "Services started! Showing logs..."
echo ""

# Display actual ports (could be customized)
if [[ -f .port-mappings ]]; then
    echo "📌 Services available at:"
    cat .port-mappings | grep -E "^\s+-" | sed 's/^  //'
else
    echo "📱 Frontend: http://localhost:5173"
    echo "🔧 Backend:  http://localhost:3000"
    echo "🗄️  Database: http://localhost:8080 (Adminer)"
    echo "📊 Prisma Studio: http://localhost:5555"
fi
echo ""
docker compose logs -f
