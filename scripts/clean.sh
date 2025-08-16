#!/bin/bash
# Clean everything

set -e

echo "🧹 Cleaning up Underneath..."

# Stop containers
docker compose down -v

# Remove node_modules
rm -rf frontend/node_modules backend/node_modules

# Remove build artifacts
rm -rf frontend/dist backend/dist

# Remove Docker volumes
docker volume prune -f

echo "✅ Cleanup complete!"
