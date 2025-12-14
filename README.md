# Investor Information Management System

A platform for managing investor information and documents built with Next.js 14+, TypeScript, and Tailwind CSS.

## Tech Stack

- **Frontend Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
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

1. Create a PostgreSQL database:

```bash
createdb investor_db
```

2. Run database migrations:

```bash
# Commands will be added when database schema is implemented
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
├── components/            # Reusable React components
├── lib/                   # Utility functions and helpers
├── types/                 # TypeScript type definitions
├── uploads/               # File upload directory (git-ignored)
├── public/                # Static assets
├── .env.example          # Environment variable template
├── .prettierrc           # Prettier configuration
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

### Directory Purposes

- **app/**: Contains all routes and pages using Next.js App Router
- **components/**: Reusable UI components
- **lib/**: Server-side utilities, API helpers, and shared functions
- **types/**: TypeScript interfaces and type definitions
- **uploads/**: Server-side file storage (not tracked in git)
- **public/**: Static files served directly

## Code Quality

This project enforces code quality through:

- **TypeScript**: Static type checking
- **ESLint**: Code linting with Next.js recommended rules
- **Prettier**: Consistent code formatting
- All configured to work together seamlessly


## License

[Add your license here]

## Support

For issues and questions, please [create an issue](https://github.com/your-repo/issues).
