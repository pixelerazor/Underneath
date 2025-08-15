#!/bin/bash
# Setup shadcn/ui components

set -e

echo "📦 Installing shadcn/ui components..."

# Initialize shadcn if not already done
echo "Initializing shadcn..."
docker compose exec frontend npx shadcn@latest init -y \
    --style default \
    --tailwind-config tailwind.config.js \
    --tailwind-css src/index.css \
    --components-dir src/components \
    --utils-dir src/lib \
    --no-css-variables \
    || echo "shadcn already initialized or init failed, continuing..."

# List of components to install
COMPONENTS=(
  "button"
  "card" 
  "dialog"
  "dropdown-menu"
  "form"
  "input"
  "label"
  "navigation-menu"
  "select"
  "separator"
  "sheet"
  "switch"
  "tabs"
  "toast"
  "tooltip"
  "avatar"
  "badge"
  "progress"
  "alert-dialog"
  "checkbox"
  "radio-group"
  "slider"
  "textarea"
  "alert"
  "scroll-area"
  "popover"
  "command"
  "table"
  "skeleton"
)

# Install each component
for component in "${COMPONENTS[@]}"; do
  echo "Installing $component..."
  docker compose exec frontend npx shadcn@latest add $component --yes --overwrite || echo "Failed to install $component, continuing..."
done

echo "✅ shadcn/ui components installed!"
echo ""
echo "📁 Components are located in: frontend/src/components/ui/"
echo "📖 Documentation: https://ui.shadcn.com/docs/components"
