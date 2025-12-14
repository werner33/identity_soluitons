# Investor Information Management System

A professional, secure platform for managing investor information and documents built with Next.js 14+, TypeScript, Prisma, and Tailwind CSS.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and set your DATABASE_URL

# 3. Create database
createdb investor_db

# 4. Run migrations
npm run db:migrate:dev

# 5. Seed sample data
npm run db:seed

# 6. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Frontend Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL 14+ with Prisma ORM
- **Styling**: Tailwind CSS v4
- **Code Quality**: ESLint, Prettier
- **Font**: Inter (Google Fonts)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 14+ (for database)
- Git

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd identity-sol
```

2. Install dependencies:

```bash
npm install
```

This installs all required packages including:

- Next.js 14+ and React 19
- Prisma ORM with PostgreSQL adapter
- Tailwind CSS v4
- TypeScript and development tools

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NODE_ENV`: Set to `development` or `production`
- `NEXT_PUBLIC_APP_URL`: Your application URL
- `MAX_FILE_SIZE`: Maximum file upload size (default: 3MB)
- `UPLOAD_DIR`: Directory for file uploads (default: ./uploads)

## Database Setup

### Installing PostgreSQL

#### macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Verify installation
psql --version
```

#### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

#### Windows

Download and install from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

### Creating the Database

1. **Access PostgreSQL**:

```bash
# macOS/Linux
psql postgres

# Or with specific user
sudo -u postgres psql
```

2. **Create database and user**:

```sql
-- Create the database
CREATE DATABASE investor_db;

-- Create a user (optional, for production)
CREATE USER investor_admin WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE investor_db TO investor_admin;

-- Exit
\q
```

3. **Verify database creation**:

```bash
psql -l  # List all databases
```

### Database Schema

The database uses the following schema:

```
┌─────────────────────────────────────────────────────────┐
│                    INVESTORS TABLE                       │
├─────────────────────┬──────────────┬───────────────────┤
│ Column              │ Type         │ Constraints       │
├─────────────────────┼──────────────┼───────────────────┤
│ id                  │ SERIAL       │ PRIMARY KEY       │
│ first_name          │ VARCHAR(100) │ NOT NULL          │
│ last_name           │ VARCHAR(100) │ NOT NULL          │
│ date_of_birth       │ DATE         │ NOT NULL          │
│ phone_number        │ VARCHAR(20)  │ NOT NULL          │
│ street_address      │ VARCHAR(255) │ NOT NULL          │
│ state               │ CHAR(2)      │ NOT NULL          │
│ zip_code            │ VARCHAR(10)  │ NOT NULL          │
│ file_path           │ VARCHAR(500) │ NOT NULL          │
│ file_original_name  │ VARCHAR(255) │ NOT NULL          │
│ created_at          │ TIMESTAMPTZ  │ DEFAULT NOW()     │
│ updated_at          │ TIMESTAMPTZ  │ AUTO UPDATE       │
└─────────────────────┴──────────────┴───────────────────┘

Indexes:
  - idx_investor_lastname_created (last_name, created_at)
  - idx_investor_phone (phone_number)
```

### Running Migrations

1. **Generate Prisma Client** (automatically runs on install):

```bash
npm run db:generate
```

2. **Create and apply migrations**:

```bash
# Development: Create migration and apply
npm run db:migrate:dev

# You'll be prompted to name the migration
# Example: "init" or "add_investors_table"
```

3. **Production deployment**:

```bash
# Apply migrations without prompts (for CI/CD)
npm run db:migrate:deploy
```

4. **Alternative: Push schema without migrations** (for rapid prototyping):

```bash
npm run db:push
```

### Seeding the Database

Populate the database with sample data:

```bash
npm run db:seed
```

This creates 5 sample investors with realistic data. The seed script is idempotent - it won't create duplicates if run multiple times.

### Database Management

```bash
# Open Prisma Studio (GUI for database)
npm run db:studio

# Test database connection
npm run db:test

# Reset database (⚠️ WARNING: Deletes all data)
npm run db:reset
```

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Create an optimized production build:

```bash
npm run build
npm start
```

### Other Commands

```bash
# Run ESLint
npm run lint

# Fix ESLint errors automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Type check TypeScript
npm run type-check
```

## Project Structure

```
identity-sol/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with header/footer
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles and Tailwind config
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Prisma schema definition
│   ├── seed.ts           # Database seeding script
│   └── migrations/        # Migration history
├── components/            # Reusable React components
├── lib/                   # Utility functions and helpers
│   ├── db.ts             # Prisma client singleton
│   └── db-utils.ts       # Database utilities and helpers
├── types/                 # TypeScript type definitions
│   └── investor.ts       # Investor types and validation
├── uploads/               # File upload directory (git-ignored)
├── public/                # Static assets
├── .env.example          # Environment variable template
├── .prettierrc           # Prettier configuration
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
└── tsconfig.json         # TypeScript configuration
```

### Directory Purposes

- **app/**: Contains all routes and pages using Next.js App Router
- **prisma/**: Database schema, migrations, and seed scripts
- **components/**: Reusable UI components
- **lib/**: Server-side utilities, API helpers, database client, and shared functions
- **types/**: TypeScript interfaces and type definitions
- **uploads/**: Server-side file storage (not tracked in git)
- **public/**: Static files served directly

## Database Troubleshooting

### Common Issues and Solutions

#### Connection Refused

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:

```bash
# Check if PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Start PostgreSQL if not running
brew services start postgresql@14  # macOS
sudo systemctl start postgresql  # Linux
```

#### Authentication Failed

**Error**: `P1002: Authentication failed`

**Solution**:

- Verify your DATABASE_URL credentials in `.env`
- Check PostgreSQL user permissions:

```bash
psql postgres -c "\du"  # List all users and roles
```

#### Database Does Not Exist

**Error**: `P1003: Database does not exist`

**Solution**:

```bash
# Create the database
createdb investor_db

# Or via psql
psql postgres -c "CREATE DATABASE investor_db;"
```

#### Migration Failed

**Error**: Migration conflicts or schema drift

**Solution**:

```bash
# Reset migrations (⚠️ WARNING: Deletes all data)
npm run db:reset

# Or manually resolve
npm run db:push  # Push schema without migrations
```

#### Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:

```bash
# Generate Prisma Client
npm run db:generate

# Or reinstall dependencies
rm -rf node_modules
npm install
```

#### Port Already in Use

**Error**: PostgreSQL port 5432 already in use

**Solution**:

```bash
# Find process using port 5432
lsof -i :5432

# Kill the process (replace PID)
kill -9 <PID>

# Or change port in DATABASE_URL
# postgresql://user:password@localhost:5433/investor_db
```

### Connection String Examples

```bash
# Local development (default)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/investor_db"

# With custom user
DATABASE_URL="postgresql://investor_admin:password@localhost:5432/investor_db"

# Remote database with SSL
DATABASE_URL="postgresql://user:password@db.example.com:5432/investor_db?sslmode=require"

# Connection pooling (production)
DATABASE_URL="postgresql://user:password@pooler.example.com:5432/investor_db?pgbouncer=true"

# Unix socket
DATABASE_URL="postgresql://user:password@/investor_db?host=/var/run/postgresql"
```

## Code Quality

This project enforces code quality through:

- **TypeScript**: Static type checking
- **ESLint**: Code linting with Next.js recommended rules
- **Prettier**: Consistent code formatting
- **Prisma**: Type-safe database queries
- All configured to work together seamlessly

## Features

- Modern Next.js 14+ App Router architecture
- TypeScript for type safety
- PostgreSQL database with Prisma ORM
- Professional UI with Tailwind CSS
- Dark mode support
- Responsive design
- File upload capability (configured for 3MB max)
- Database migrations and seeding
- Comprehensive error handling
- SEO-friendly metadata
- Performance optimized

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and formatting: `npm run lint && npm run format`
4. Ensure type checking passes: `npm run type-check`
5. Test database changes: `npm run db:test`
6. Commit your changes
7. Push and create a pull request

## License

[Add your license here]

## Support

For issues and questions, please [create an issue](https://github.com/your-repo/issues).
