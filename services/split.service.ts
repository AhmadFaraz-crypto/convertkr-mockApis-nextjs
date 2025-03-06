import axios from '../lib/axios';

export interface SplitRequest {
  file_name: string;
  page_ranges: Array<[number, number]>;
  split_files: string[];
}

export interface SplitResponse {
  id: number;
  file_name: string;
  page_ranges: Array<[number, number]>;
  split_files: string[];
}

export const splitService = {
  split: async (request: SplitRequest): Promise<SplitResponse> => {
    const { data } = await axios.post('/splits', request);
    return data;
  },
  
  getSplitFiles: async (): Promise<SplitResponse[]> => {
    const { data } = await axios.get('/splits');
    return data;
  }
}; 