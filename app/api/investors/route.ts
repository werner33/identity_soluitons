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
    const files = formData.getAll('files') as File[];

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !phoneNumber ||
      !streetAddress ||
      !state ||
      !zipCode
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate at least one file
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'At least one file is required' },
        { status: 400 }
      );
    }

    // Validate all files
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '3145728', 10);
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    for (const file of files) {
      if (file.size > maxSize) {
        return NextResponse.json(
          {
            error: `File "${file.name}" exceeds maximum allowed size (3MB)`,
          },
          { status: 400 }
        );
      }

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            error: `File "${file.name}" has invalid type. Only PDF, JPG, and PNG are allowed`,
          },
          { status: 400 }
        );
      }

      // Check filename length (database limit is 255 chars)
      if (file.name.length > 255) {
        return NextResponse.json(
          {
            error: `File name "${file.name}" is too long. Maximum 255 characters allowed.`,
          },
          { status: 400 }
        );
      }

      // Check mime type length (database limit is 100 chars)
      if (file.type.length > 100) {
        return NextResponse.json(
          {
            error: `File "${file.name}" has an invalid mime type.`,
          },
          { status: 400 }
        );
      }
    }

    // Create upload directory if it doesn't exist
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const uploadPath = join(process.cwd(), uploadDir);

    try {
      await mkdir(uploadPath, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }

    // Prepare file data for saving
    const fileDataArray = [];
    for (const file of files) {
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}-${randomSuffix}-${sanitizedFileName}`;
      const filePath = join(uploadPath, fileName);
      const dbFilePath = `${uploadDir}/${fileName}`;

      // Validate file path length (database limit is 500 chars)
      if (dbFilePath.length > 500) {
        return NextResponse.json(
          {
            error: `File name "${file.name}" results in a path that is too long. Please use a shorter filename.`,
          },
          { status: 400 }
        );
      }

      // Save file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      fileDataArray.push({
        filePath: dbFilePath,
        fileOriginalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      });
    }

    // Debug logging
    console.log('File data array:', JSON.stringify(fileDataArray, null, 2));
    console.log('Creating investor with data:', {
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      streetAddress,
      state,
      zipCode,
      fileCount: fileDataArray.length,
    });

    // Save to database with files
    const investor = await db.investor.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        streetAddress,
        state,
        zipCode,
        files: {
          create: fileDataArray,
        },
      },
      include: {
        files: true,
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
          filesCount: investor.files.length,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating investor:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));

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
