import { NeuronWriterAPI } from '@/util/nw_connect';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const apiKey = process.env.NEURONWRITER_API_KEY;
    if (!apiKey) {
      throw new Error('NEURONWRITER_API_KEY is not defined in environment variables');
    }

    const nw = new NeuronWriterAPI(apiKey);
    const queryId = '18d65bade9886108';
    
    // Get query results and store them in a variable accessible to the whole function
    let queryResults;
    try {
      queryResults = await nw.getQuery(queryId);
      console.error('Query results received:', !!queryResults); // Just log if we got data
    } catch (apiError) {
      console.error('API Error:', apiError);
      throw apiError;
    }

    // Save response
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `response-${timestamp}.json`;
    const responsesDir = join(process.cwd(), 'responses');
    const filePath = join(responsesDir, filename);

    try {
      await writeFile(filePath, JSON.stringify(queryResults, null, 2), 'utf8');
    } catch (fileError) {
      console.error('File System Error:', fileError);
      await mkdir(responsesDir, { recursive: true });
      await writeFile(filePath, JSON.stringify(queryResults, null, 2), 'utf8');
    }

    return NextResponse.json({
      success: true,
      message: 'Data fetched and saved successfully'
    });
  } catch (error) {
    console.error('Full error details:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}