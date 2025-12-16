# Investor Information Management System

Hey!

Started this on Sunday but honestly was super tired from a long week, so I picked it up Monday after work and got it to a good place.

It's a Next.js app collecting investor information. Each investor can upload 1 or more files with a max siz of 3mb. Here's the main points:

## What It Does

**Front End:**
- Material UI form with first name, last name, birthday, phone number, street address, state, zip code, and **multiple file uploader**
- Validations - phone must be valid US/Canada format, validates US zip codes, checks required fields, age restrictions (18-120).
- Responsive design that works on mobile, tablet, and desktop
- Success toast notifications when you save data
- Shows a list of files, with file size and remove buttons

**Back End:**
- Same validations as the front end so there's no way to bypass and save invalid data
- Database-level CHECK constraints for extra security
- Normalizes phone numbers to 10 digits (strips all formatting before saving)
- Handles multiple file uploads with individual file validation (max 3MB each)
- Uses UUIDs instead of sequential IDs for better security

**Database:**
- PostgreSQL with Prisma ORM
- Two tables: investors and investor_files (one-to-many relationship)
- Built-in constraints to enforce data integrity
- Proper indexing for performance

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and add your DATABASE_URL

# 3. Create database
createdb investor_db

# 4. Run migrations
npm run db:migrate:dev

# 5. Seed sample data (optional)
npm run db:seed

# 6. Start the app
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and you're good to go!

## Database Schema

Here's how the data is structured:

```
┌─────────────────────────────────────────────────────────────────┐
│                      INVESTORS TABLE                             │
├──────────────────┬──────────────┬─────────────────────────────────┤
│ Column           │ Type         │ Constraints                     │
├──────────────────┼──────────────┼─────────────────────────────────┤
│ id               │ UUID         │ PRIMARY KEY                     │
│ first_name       │ VARCHAR(100) │ NOT NULL, length 1-100         │
│ last_name        │ VARCHAR(100) │ NOT NULL, length 1-100         │
│ date_of_birth    │ DATE         │ NOT NULL, age 18-120           │
│ phone_number     │ VARCHAR(10)  │ NOT NULL, exactly 10 digits    │
│ street_address   │ VARCHAR(255) │ NOT NULL, length 1-255         │
│ state            │ CHAR(2)      │ NOT NULL, valid US state       │
│ zip_code         │ VARCHAR(10)  │ NOT NULL, valid US ZIP         │
│ created_at       │ TIMESTAMPTZ  │ DEFAULT NOW()                  │
│ updated_at       │ TIMESTAMPTZ  │ AUTO UPDATE                    │
└──────────────────┴──────────────┴─────────────────────────────────┘
                              ▲
                              │
                              │ (one-to-many)
                              │
┌─────────────────────────────┴───────────────────────────────────┐
│                    INVESTOR_FILES TABLE                          │
├──────────────────┬──────────────┬─────────────────────────────────┤
│ Column           │ Type         │ Constraints                     │
├──────────────────┼──────────────┼─────────────────────────────────┤
│ id               │ UUID         │ PRIMARY KEY                     │
│ investor_id      │ UUID         │ FOREIGN KEY → investors.id      │
│ file_path        │ VARCHAR(500) │ NOT NULL                       │
│ file_original_   │ VARCHAR(255) │ NOT NULL                       │
│   name           │              │                                │
│ file_size        │ INTEGER      │ NOT NULL                       │
│ mime_type        │ VARCHAR(100) │ NOT NULL                       │
│ created_at       │ TIMESTAMPTZ  │ DEFAULT NOW()                  │
└──────────────────┴──────────────┴─────────────────────────────────┘

Indexes:
  investors:
    - idx_investor_lastname_created (last_name, created_at)
    - idx_investor_phone (phone_number)

  investor_files:
    - idx_investor_file_investor_id (investor_id)

Constraints:
  - Phone: must be exactly 10 digits (e.g., 9515267196)
  - ZIP: 5 or 9 digit format, valid range 00501-99950
  - Age: between 18 and 120 years old
  - Names & address: cannot be empty or whitespace only
  - Cascade delete: deleting an investor deletes all their files
```

## Three Layers of Validation

I set up validation at every layer for security and data integrity:

1. **Front-End (Zod)**: Immediate feedback to users, better UX
2. **API Routes**: Server-side validation before processing
3. **Database (CHECK Constraints)**: Final enforcement, can't be bypassed

So even if someone tries to hit the API directly and skip the front-end, the data still gets validated before it hits the database.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL 14+ with Prisma ORM v7
- **UI Library**: Material UI
- **Styling**: Tailwind CSS v4
- **Form Validation**: Zod + React Hook Form
- **Code Quality**: ESLint + Prettier

## What You Need Installed

- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Git

## Setting Up PostgreSQL

If you don't have PostgreSQL installed:

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [postgresql.org/download](https://www.postgresql.org/download/windows/)

Then create the database:
```bash
# Access PostgreSQL
psql postgres

# Create database
CREATE DATABASE investor_db;

# Exit
\q
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Your PostgreSQL connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/investor_db"

# File upload settings (optional)
MAX_FILE_SIZE=3145728  # 3MB
UPLOAD_DIR=./uploads

NODE_ENV=development
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm start              # Run production build

# Database
npm run db:studio       # Open Prisma Studio (GUI)
npm run db:seed         # Add sample data
npm run db:reset        # ⚠️  Reset database (deletes everything)

# Code Quality
npm run lint            # Check for issues
npm run format          # Format code with Prettier
npm run type-check      # TypeScript validation
```

## Project Structure

```
identity-sol/
├── app/
│   ├── api/investors/   # API endpoints for investor CRUD
│   ├── layout.tsx       # Root layout with header/footer
│   ├── page.tsx         # Home page with form
│   └── globals.css      # Global styles
├── components/
│   └── InvestorForm.tsx # Main form component
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Sample data
│   └── migrations/      # Migration history
├── lib/
│   ├── db.ts           # Prisma client singleton
│   └── db-utils.ts     # Database helpers
├── uploads/            # File storage (git-ignored)
└── .env.example        # Environment template
```

## How File Uploads Work

- Users can upload multiple files (PDF, JPG, PNG)
- Each file is validated (type, size max 3MB)
- Files are saved to `./uploads` with unique timestamped names
- File metadata is stored in the `investor_files` table
- The form shows a preview list of selected files with remove buttons

## Sample Data

Run `npm run db:seed` to create 5 sample investors:
- John Smith (California) - 2 files
- Sarah Johnson (New York) - 1 file
- Michael Chen (Texas) - 1 file
- Emily Rodriguez (Florida) - 2 files
- David Williams (Washington) - 1 file

Phone numbers are stored as 10 digits (e.g., `9535550123`), but the form accepts formats like `1-951-555-0123` or `(951) 555-0123` and normalizes them automatically.

## Common Issues

**"Can't connect to database"**
```bash
# Make sure PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Start it if needed
brew services start postgresql@14
```

**"Database investor_db does not exist"**
```bash
createdb investor_db
```

**"Prisma Client not found"**
```bash
npm run db:generate
```

## Security Features

- UUIDs instead of sequential IDs (prevents enumeration attacks)
- Phone numbers normalized to 10 digits only
- Database-level constraints (can't be bypassed)
- File type validation (PDF, JPG, PNG only)
- File size limits (3MB per file)
- No sensitive data in git (uploads folder is ignored)

## Contributing

1. Make your changes
2. Run `npm run lint && npm run format`
3. Check types with `npm run type-check`
4. Make sure database works with `npm run db:test`
5. Submit a PR

That's it! Let me know if you run into any issues.
