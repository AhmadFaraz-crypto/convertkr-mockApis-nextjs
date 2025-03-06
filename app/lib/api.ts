// API client for interacting with the conversion APIs

import { NextResponse } from 'next/server'

const API_BASE_URL = "https://api.convertkr.com"

// Types for API responses
export interface SplitResponse {
  file_name: string
  id: number
  page_ranges: Array<[number, number]>
  split_files: string[]
}

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

export interface MergeRequest {
  files: string[];
  merged_file: string;
}

export interface MergeResponse {
  files: string[];
  merged_file: string;
}

// API functions
export async function getSplit(id: number): Promise<SplitResponse> {
  const response = await fetch(`${API_BASE_URL}/splits/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch split with ID ${id}`)
  }
  return response.json()
}

export async function createSplit(
  fileUrl: string, 
  pageRanges: Array<[number, number]>,
  splitFiles: string[]
): Promise<SplitResponse> {
  const response = await fetch('/api/split', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file_name: fileUrl,
      page_ranges: pageRanges,
      split_files: splitFiles
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to split PDF');
  }

  return response.json();
}

export async function getConversion(id: number): Promise<ConversionResponse> {
  const response = await fetch(`${API_BASE_URL}/conversions/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch conversion with ID ${id}`)
  }
  return response.json()
}

export async function createConversion(request: ConversionRequest): Promise<ConversionResponse> {
  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to convert file');
  }

  return response.json();
}

export async function getMerge(id: number): Promise<MergeResponse> {
  const response = await fetch(`${API_BASE_URL}/merges/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch merge with ID ${id}`)
  }
  return response.json()
}

export async function createMerge(request: MergeRequest): Promise<MergeResponse> {
  const response = await fetch('/api/merge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to merge files');
  }

  return response.json();
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${API_BASE_URL}/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to merge files' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

