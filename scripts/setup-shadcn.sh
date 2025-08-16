#!/bin/bash
# Setup shadcn/ui components

set -e

echo "📦 Installing shadcn/ui components..."

# Change to frontend directory
cd frontend

# Fix permissions if needed
echo "Fixing permissions..."
sudo chown -R $(whoami):$(whoami) . 2>/dev/null || true

echo "Initializing shadcn..."
npx shadcn@latest init -y || echo "shadcn already initialized or init failed, continuing..."

# Install ALL components at once
echo "Installing all shadcn/ui components..."
npx shadcn@latest add --all --yes

echo "✅ shadcn/ui components installed!"
echo ""
echo "📁 Components are located in: frontend/src/components/ui/"
echo "📖 Documentation: https://ui.shadcn.com/docs/components"
