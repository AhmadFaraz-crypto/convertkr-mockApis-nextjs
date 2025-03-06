import axios from '../lib/axios';

export interface MergeRequest {
  files: string[];
  merged_file: string;
}

export interface MergeResponse {
  files: string[];
  merged_file: string;
}

export const mergeService = {
  merge: async (request: MergeRequest): Promise<MergeResponse> => {
    const { data } = await axios.post('/merges', request);
    return data;
  },
  
  getMergedFiles: async (): Promise<MergeResponse[]> => {
    const { data } = await axios.get('/merges');
    return data;
  }
}; 