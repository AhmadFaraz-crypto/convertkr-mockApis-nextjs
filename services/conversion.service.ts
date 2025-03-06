import axios from '@/lib/axios';

export interface ConversionRequest {
  file_type: string;
  file_url: string;
  target_type: string;
  output_file_url: string;
  options?: {
    quality?: number;
    preserveMetadata?: boolean;
  };
}

export interface ConversionResponse {
  file_type: string;
  file_url: string;
  output_file_url: string;
  target_type: string;
}

export const conversionService = {
  convert: async (request: ConversionRequest): Promise<ConversionResponse> => {
    const { data } = await axios.post('/conversions', request);
    return data;
  },
  
  getConversions: async (): Promise<ConversionResponse[]> => {
    const { data } = await axios.get('/conversions');
    return data;
  }
};