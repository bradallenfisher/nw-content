// NeuronWriter API client utility

interface NWResponse {
  query?: string;
  query_url?: string;
  share_url?: string;
  readonly_url?: string;
  status?: string;
  keyword?: string;
  metrics?: {
    word_count?: {
      median: number;
      target: number;
    };
    readability?: {
      median: number;
      target: number;
    };
  };
  terms_txt?: {
    title: string;
    desc_title: string;
    h1: string;
    content_basic: string;
    content_basic_w_ranges: string;
    content_extended: string;
    entities: string;
    [key: string]: string;
  };
  terms?: {
    [key: string]: Array<{
      t: string;
      usage_pc: number;
      sugg_usage?: [number, number];
    }>;
  };
  ideas?: {
    suggest_questions?: Array<{ q: string }>;
    people_also_ask?: Array<{ q: string }>;
    content_questions?: Array<{ q: string }>;
  };
  competitors?: Array<{
    rank: number;
    url: string;
    title: string;
    desc: string;
  }>;
  content?: string;
  title?: string;
  description?: string;
  created?: string;
  type?: 'manual' | 'autosave';
}

interface NWQueryParams {
  project: string;
  keyword: string;
  engine?: string;
  language?: string;
}

export class NeuronWriterAPI {
  private apiKey: string;
  private baseUrl = 'https://app.neuronwriter.com/neuron-api/0.5/writer';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, method: string = 'POST', body?: any): Promise<NWResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('Making request to:', url); // Debug log

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Request Error:', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * List all projects in the account
   */
  async listProjects() {
    return this.makeRequest('/list-projects', 'POST');
  }

  /**
   * Create a new content writer query
   */
  async newQuery(params: NWQueryParams) {
    return this.makeRequest('/new-query', 'POST', params);
  }

  /**
   * Get content recommendations for a query
   */
  async getQuery(queryId: string) {
    const response = await fetch(`${this.baseUrl}/get-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.apiKey
      },
      body: JSON.stringify({ query: queryId })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
  }

  /**
   * List queries within a project
   */
  async listQueries(projectId: string, filters?: {
    status?: 'waiting' | 'in progress' | 'ready';
    source?: 'neuron' | 'neuron-api';
    created?: string;
    updated?: string;
    keyword?: string;
    language?: string;
    engine?: string;
    tags?: string | string[];
  }) {
    return this.makeRequest('/list-queries', 'POST', {
      project: projectId,
      ...filters
    });
  }

  /**
   * Get the last content revision for a query
   */
  async getContent(queryId: string, revisionType: 'manual' | 'all' = 'manual') {
    return this.makeRequest('/get-content', 'POST', {
      query: queryId,
      revision_type: revisionType
    });
  }

  /**
   * Import content for a query
   */
  async importContent(queryId: string, content: {
    html?: string;
    title?: string;
  }) {
    return this.makeRequest('/import-content', 'POST', {
      query: queryId,
      ...content
    });
  }
}

// Example usage:
/*
const nw = new NeuronWriterAPI('your-api-key-here');

// List projects
const projects = await nw.listProjects();

// Create new query
const query = await nw.newQuery({
  project: 'project-id',
  keyword: 'target keyword',
  engine: 'google.com',
  language: 'English'
});

// Get query results
const results = await nw.getQuery(query.query);
*/
