# Underneath

A relationship framework for highly individual, development and reflection-oriented support of asymmetric social relationships.

## 🚀 Quick Start

```bash
# Start development environment
./scripts/dev.sh

# Install shadcn/ui components (optional, run after containers are up)
./scripts/setup-shadcn.sh
```

## 📱 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database Admin**: http://localhost:8080
- **Prisma Studio**: http://localhost:5555

## 🐳 Docker Commands

```bash
# Start all services
docker compose up

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Rebuild containers
docker compose up --build

# Clean everything
./scripts/clean.sh
```

## 📁 Project Structure

```
underneath/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express + Prisma
├── prisma/            # Database schema and migrations
├── docker/            # Docker configuration files
├── scripts/           # Development scripts
└── nginx/             # Web server configuration
```

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, Prisma, Redis
- **Database**: PostgreSQL
- **Container**: Docker & Docker Compose
- **PWA**: Service Workers, Web Manifest

## 🔐 Security Features

- JWT Authentication with refresh tokens
- 2FA support (TOTP)
- Audit logging
- Role-based access control
- Secure password hashing (bcrypt)

## 📝 Development

The project is set up as a clean skeleton. Start building your features:

1. **Frontend Components**: Add to `frontend/src/components/`
2. **API Routes**: Add to `backend/src/routes/`
3. **Database Models**: Edit `prisma/schema.prisma`
4. **Run Migrations**: `docker compose exec backend npx prisma migrate dev`

## 🎨 UI Components

Install shadcn/ui components as needed:

```bash
# Run after containers are started
./scripts/setup-shadcn.sh

# Or install individual components
docker compose exec frontend npx shadcn-ui@latest add button
```

## License

Private - All rights reserved
