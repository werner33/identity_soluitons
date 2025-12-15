import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db';
import { parsePrismaError } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const dateOfBirth = formData.get('dateOfBirth') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const streetAddress = formData.get('streetAddress') as string;
    const state = formData.get('state') as string;
    const zipCode = formData.get('zipCode') as string;
    const file = formData.get('file') as File;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !phoneNumber ||
      !streetAddress ||
      !state ||
      !zipCode ||
      !file
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate file
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '3145728', 10);
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed size (3MB)' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, and PNG are allowed' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const uploadPath = join(process.cwd(), uploadDir);

    try {
      await mkdir(uploadPath, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${sanitizedFileName}`;
    const filePath = join(uploadPath, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save to database
    const investor = await db.investor.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        streetAddress,
        state,
        zipCode,
        filePath: `${uploadDir}/${fileName}`,
        fileOriginalName: file.name,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: investor.id,
          firstName: investor.firstName,
          lastName: investor.lastName,
          createdAt: investor.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating investor:', error);

    const dbError = parsePrismaError(error);

    return NextResponse.json(
      { error: dbError.message || 'Failed to create investor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const investors = await db.investor.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 most recent
    });

    return NextResponse.json({
      success: true,
      data: investors,
      count: investors.length,
    });
  } catch (error) {
    console.error('Error fetching investors:', error);

    const dbError = parsePrismaError(error);

    return NextResponse.json(
      { error: dbError.message || 'Failed to fetch investors' },
      { status: 500 }
    );
  }
}
