import { NeuronWriterAPI } from '@/util/nw_connect';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.NEURONWRITER_API_KEY;
    if (!apiKey) {
      throw new Error('NEURONWRITER_API_KEY is not defined in environment variables');
    }

    const nw = new NeuronWriterAPI(apiKey);
    const queryId = '18d65bade9886108';
    
    const queryResults = await nw.getQuery(queryId);
    
    return NextResponse.json({
      success: true,
      data: queryResults
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 