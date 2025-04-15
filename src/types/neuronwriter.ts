export interface QueryData {
  keyword?: string;
  status?: string;
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
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: QueryData;
  rawResponse?: {
    availableFields: string[];
    fullData: any;
  };
} 