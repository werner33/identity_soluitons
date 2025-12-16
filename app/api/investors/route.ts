import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db';
import { parsePrismaError } from '@/lib/db-utils';
import { validateInvestorData } from '@/lib/investor-validation';

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

    // Validate all input data
    const validation = validateInvestorData({
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      streetAddress,
      state,
      zipCode,
      files,
    });

    if (!validation.isValid) {
      // Return first validation error
      const firstError = validation.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    // Use validated and normalized data
    const validatedData = validation.data!;

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
    for (const file of validatedData.files) {
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

    // Save to database with files
    const investor = await db.investor.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        phoneNumber: validatedData.phoneNumber,
        streetAddress: validatedData.streetAddress,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
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
