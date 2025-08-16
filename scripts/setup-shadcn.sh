#!/bin/bash
# Setup shadcn/ui components

set -e

echo "📦 Installing shadcn/ui components..."

# Determine the script's location and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to project root
cd "$PROJECT_ROOT"

# Fix permissions if needed
echo "Fixing permissions..."
sudo chown -R $(whoami):$(whoami) frontend 2>/dev/null || true

# Change to frontend directory where components.json is located
cd frontend

echo "Initializing shadcn..."
npx shadcn@latest init -y || echo "shadcn already initialized or init failed, continuing..."

# Install ALL components at once
echo "Installing all shadcn/ui components..."
npx shadcn@latest add --all --yes

echo "✅ shadcn/ui components installed!"
echo ""
echo "📁 Components are located in: frontend/src/components/ui/"
echo "📖 Documentation: https://ui.shadcn.com/docs/components"