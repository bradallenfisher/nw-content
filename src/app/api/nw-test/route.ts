import { NeuronWriterAPI } from '@/util/nw_connect';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

function formatResponse(data: any): string {
  let output = '';
  
  // Keyword
  output += '{main_keyword}="\n' + (data.keyword || '') + '\n"';
  
  // Word count
  output += '\n{target_word_count}="\n' + (data.metrics?.word_count?.target || '') + '\n"';
  
  // Terms
  const titleTerms = data.terms?.title?.map((term: { t: string }) => term.t).join('\n') || '';
  output += '\n{title_terms}="\n' + titleTerms + '\n"';
  
  const basicTerms = data.terms?.content_basic?.map((term: { t: string }) => term.t).join('\n') || '';
  output += '\n{basic_content_terms}="\n' + basicTerms + '\n"';
  
  const extendedTerms = data.terms?.content_extended?.map((term: { t: string }) => term.t).join('\n') || '';
  output += '\n{content_extended}="\n' + extendedTerms + '\n"';
  
  const entities = data.terms?.entities?.map((term: { t: string }) => term.t).join('\n') || '';
  output += '\n{entities}="\n' + entities + '\n"';
  
  let paaQuestions = '';
  if (data.ideas?.people_also_ask) {
    paaQuestions = data.ideas.people_also_ask.map((q: { q: string }) => q.q).join('\n');
  }
  output += '\n{paa_questions}="\n' + paaQuestions + '\n"';
  
  let contentQuestions = '';
  if (data.ideas?.content_questions) {
    contentQuestions = data.ideas.content_questions.map((q: { q: string }) => q.q).join('\n');
  }
  output += '\n{content_questions}="\n' + contentQuestions + '\n"';
  
  // Competitors - only URLs
  let competitors = '';
  if (data.competitors) {
    competitors = data.competitors.map((comp: any) => comp.url).join('\n');
  }
  output += '\n{competitors}="\n' + competitors + '\n"';
  
  return output;
}

export async function GET() {
  try {
    const apiKey = process.env.NEURONWRITER_API_KEY;
    if (!apiKey) {
      throw new Error('NEURONWRITER_API_KEY is not defined in environment variables');
    }

    const nw = new NeuronWriterAPI(apiKey);
    const queryId = '18d65bade9886108';
    
    const queryResults = await nw.getQuery(queryId);
    
    // Debug log to see the structure
    console.log('Terms structure:', JSON.stringify(queryResults.terms, null, 2));
    
    // Format the data
    const formattedOutput = formatResponse(queryResults);
    
    // Save to file with fixed name
    const filename = 'response.txt';
    const responsesDir = join(process.cwd(), 'responses');
    const filePath = join(responsesDir, filename);
    
    try {
      await mkdir(responsesDir, { recursive: true });
      await writeFile(filePath, formattedOutput, 'utf8');
    } catch (error) {
      console.error('Error writing file:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Data saved to ${filename}`
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