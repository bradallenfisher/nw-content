import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Create a timestamp for the filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `response-${timestamp}.json`;
    
    // Create the file path
    const responsesDir = join(process.cwd(), 'responses');
    const filePath = join(responsesDir, filename);

    // Ensure directory exists
    try {
      await writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        'utf8'
      );
    } catch (error) {
      // If directory doesn't exist, create it and try again
      await mkdir(responsesDir, { recursive: true });
      await writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        'utf8'
      );
    }

    return NextResponse.json({
      success: true,
      message: `Response saved as ${filename}`
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save response'
      },
      { status: 500 }
    );
  }
} 