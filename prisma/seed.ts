import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Prisma v7 requires adapter configuration
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
});

/**
 * Sample investor data
 * This data is for development and testing purposes only
 */
const sampleInvestors = [
  {
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: new Date('1985-03-15'),
    phoneNumber: '+1-555-0123',
    streetAddress: '123 Oak Street',
    state: 'CA',
    zipCode: '90210',
    filePath: '/uploads/sample/john-smith-id.pdf',
    fileOriginalName: 'drivers-license.pdf',
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: new Date('1990-07-22'),
    phoneNumber: '+1-555-0456',
    streetAddress: '456 Maple Avenue',
    state: 'NY',
    zipCode: '10001',
    filePath: '/uploads/sample/sarah-johnson-id.pdf',
    fileOriginalName: 'passport.pdf',
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    dateOfBirth: new Date('1978-11-08'),
    phoneNumber: '+1-555-0789',
    streetAddress: '789 Pine Boulevard',
    state: 'TX',
    zipCode: '75001',
    filePath: '/uploads/sample/michael-chen-id.pdf',
    fileOriginalName: 'state-id.pdf',
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    dateOfBirth: new Date('1995-05-30'),
    phoneNumber: '+1-555-0321',
    streetAddress: '321 Cedar Lane',
    state: 'FL',
    zipCode: '33101',
    filePath: '/uploads/sample/emily-rodriguez-id.pdf',
    fileOriginalName: 'drivers-license.pdf',
  },
  {
    firstName: 'David',
    lastName: 'Williams',
    dateOfBirth: new Date('1982-09-17'),
    phoneNumber: '+1-555-0654',
    streetAddress: '654 Birch Court',
    state: 'WA',
    zipCode: '98101',
    filePath: '/uploads/sample/david-williams-id.pdf',
    fileOriginalName: 'passport.pdf',
  },
];

/**
 * Main seed function
 * This is idempotent - it can be run multiple times safely
 */
async function main() {
  console.log('Starting database seed...\n');

  // Check if investors already exist
  const existingCount = await prisma.investor.count();

  if (existingCount > 0) {
    console.log(`Database already contains ${existingCount} investor(s).`);
    console.log('Skipping seed to prevent duplicates.\n');
    console.log('To reset the database, run: npm run db:reset\n');
    return;
  }

  console.log('Seeding investors...');

  // Create investors
  for (const investor of sampleInvestors) {
    const created = await prisma.investor.create({
      data: investor,
    });

    console.log(
      `✓ Created investor: ${created.firstName} ${created.lastName} (ID: ${created.id})`
    );
  }

  console.log(`\nSuccessfully seeded ${sampleInvestors.length} investors!`);

  // Display summary statistics
  const totalInvestors = await prisma.investor.count();
  const states = await prisma.investor.groupBy({
    by: ['state'],
    _count: {
      state: true,
    },
  });

  console.log('\nDatabase Summary:');
  console.log(`Total Investors: ${totalInvestors}`);
  console.log('\nInvestors by State:');
  states.forEach((s) => {
    console.log(`  ${s.state}: ${s._count.state}`);
  });

  console.log('\nSeed completed successfully! ✓\n');
}

/**
 * Execute seed function
 */
main()
  .catch((error) => {
    console.error('\nError during seed:');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
