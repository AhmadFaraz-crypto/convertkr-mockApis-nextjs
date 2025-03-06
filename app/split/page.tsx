"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scissors, Download, Loader2, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createSplit, type SplitResponse } from "../lib/api"
import { useRouter } from 'next/navigation'

interface PageRange {
  start: number;
  end: number;
  splitUrl: string;
}

export default function SplitPage() {
  const router = useRouter()
  const [fileUrl, setFileUrl] = useState<string>("")
  const [pageRanges, setPageRanges] = useState<PageRange[]>([
    { start: 1, end: 2, splitUrl: "" },
    { start: 3, end: 4, splitUrl: "" },
  ])
  const [result, setResult] = useState<SplitResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSplitUrl = (baseUrl: string, index: number) => {
    const fileName = baseUrl.split('/').pop()?.split('.')[0] || 'file';
    return `${baseUrl.substring(0, baseUrl.lastIndexOf('/'))}/${fileName}_part_${index + 1}.pdf`;
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setFileUrl(newUrl)
    // Update all split URLs when main URL changes
    if (newUrl) {
      setPageRanges(prev => prev.map((range, index) => ({
        ...range,
        splitUrl: generateSplitUrl(newUrl, index + 1)
      })))
    }
    setResult(null)
    setError(null)
  }

  const handlePageRangeChange = (index: number, field: 'start' | 'end', value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      setPageRanges(prev => prev.map((range, i) => 
        i === index 
          ? { ...range, [field]: numValue }
          : range
      ))
    }
  }

  const handleSplitUrlChange = (index: number, value: string) => {
    setPageRanges(prev => prev.map((range, i) => 
      i === index 
        ? { ...range, splitUrl: value }
        : range
    ))
  }

  const addPageRange = () => {
    const lastRange = pageRanges[pageRanges.length - 1]
    const nextStart = lastRange.end + 1
    const newRange = {
      start: nextStart,
      end: nextStart + 1,
      splitUrl: fileUrl ? generateSplitUrl(fileUrl, pageRanges.length + 1) : ""
    }
    setPageRanges([...pageRanges, newRange])
  }

  const removePageRange = (index: number) => {
    if (pageRanges.length <= 2) {
      setError("You need at least two page ranges")
      return
    }

    const newRanges = [...pageRanges]
    newRanges.splice(index, 1)
    setPageRanges(newRanges)
  }

  const handleSplitFile = async () => {
    if (!fileUrl) {
      setError("Please enter a file URL to split")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Validate page ranges and split URLs
      for (const range of pageRanges) {
        if (range.start > range.end) {
          throw new Error(
            `Invalid page range: ${range.start}-${range.end}. Start page must be less than or equal to end page.`
          )
        }
        if (!range.splitUrl) {
          throw new Error("All split URLs must be specified")
        }
      }

      const response = await createSplit(
        fileUrl, 
        pageRanges.map(r => [r.start, r.end] as [number, number]),
        pageRanges.map(r => r.splitUrl)
      )
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Split API</h1>
      <p className="text-muted-foreground mb-8">Divide a file into multiple parts by page ranges.</p>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Split PDF</CardTitle>
              <CardDescription>Split your PDF into multiple files.</CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/split/view')}
            >
              View Split Files
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-url">File URL</Label>
            <Input 
              id="file-url" 
              type="url" 
              placeholder="Enter PDF file URL" 
              value={fileUrl}
              onChange={handleUrlChange} 
            />
            {fileUrl && <p className="text-sm text-muted-foreground">File URL: {fileUrl}</p>}
          </div>

          <div className="space-y-2">
            <Label>Page Ranges</Label>
            <p className="text-sm text-muted-foreground mb-2">Define the page ranges for each output file</p>

            {pageRanges.map((range, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">Part {index + 1}:</div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={range.start}
                      onChange={(e) => handlePageRangeChange(index, 'start', e.target.value)}
                      className="w-20"
                    />
                    <span>to</span>
                    <Input
                      type="number"
                      min="1"
                      value={range.end}
                      onChange={(e) => handlePageRangeChange(index, 'end', e.target.value)}
                      className="w-20"
                    />
                  </div>
                  {pageRanges.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => removePageRange(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="ml-20">
                  <Input
                    type="url"
                    placeholder="Split file URL"
                    value={range.splitUrl}
                    onChange={(e) => handleSplitUrlChange(index, e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={addPageRange} className="w-full mt-2">
              <Plus className="mr-2 h-4 w-4" />
              Add Another Page Range
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSplitFile} className="w-full" disabled={isLoading || !fileUrl}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Splitting File...
              </>
            ) : (
              <>
                <Scissors className="mr-2 h-4 w-4" />
                Split File
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Alert className="mt-8">
          <AlertTitle>Split Successful</AlertTitle>
          <AlertDescription>
            <div className="space-y-4">
              <p>Your file has been successfully split into {result.split_files.length} parts.</p>

              <div className="space-y-2">
                <p className="text-sm font-medium">Original File:</p>
                <div className="text-sm p-2 bg-muted rounded-md">{result.file_name.split("/").pop()}</div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Split Files:</p>
                <div className="grid gap-2">
                  {result.split_files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>{file.split("/").pop()}</span>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

