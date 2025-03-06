"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scissors, Download, Loader2, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from 'next/navigation'
import { SplitRequest, SplitResponse, splitService } from "@/services/split.service"

interface PageRange {
  start: number;
  end: number;
  splitUrl: string;
}

interface ValidationError {
  field: string;
  message: string;
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
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.toLowerCase().endsWith('.pdf');
    } catch {
      return false;
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setFileUrl(newUrl)
    setResult(null)
    setError(null)
    setValidationErrors(validationErrors.filter(error => error.field !== 'fileUrl'))
  }

  const handlePageRangeChange = (index: number, field: 'start' | 'end', value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      setPageRanges(prev => prev.map((range, i) => 
        i === index 
          ? { ...range, [field]: numValue }
          : range
      ))
      setValidationErrors(validationErrors.filter(error => error.field !== `${field}-${index}`))
    }
  }

  const handleSplitUrlChange = (index: number, value: string) => {
    setPageRanges(prev => prev.map((range, i) => 
      i === index 
        ? { ...range, splitUrl: value }
        : range
    ))
    setValidationErrors(validationErrors.filter(error => error.field !== `splitUrl-${index}`))
  }

  const addPageRange = () => {
    const lastRange = pageRanges[pageRanges.length - 1]
    const nextStart = lastRange.end + 1
    const newRange = {
      start: nextStart,
      end: nextStart + 1,
      splitUrl: ""
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
    setValidationErrors(validationErrors.filter(error => !error.field.includes(`-${index}`)))
  }

  const validateInputs = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!fileUrl) {
      errors.push({ field: 'fileUrl', message: 'Input file URL is required' })
    } else if (!validateUrl(fileUrl)) {
      errors.push({ field: 'fileUrl', message: 'Invalid PDF URL. URL must end with .pdf' })
    }

    pageRanges.forEach((range, index) => {
      if (range.start > range.end) {
        errors.push({ 
          field: `range-${index}`, 
          message: `Invalid page range: ${range.start}-${range.end}. Start page must be less than or equal to end page.`
        })
      }

      if (!range.splitUrl) {
        errors.push({ 
          field: `splitUrl-${index}`, 
          message: `Output URL is required for range ${index + 1}` 
        })
      } else if (!validateUrl(range.splitUrl)) {
        errors.push({ 
          field: `splitUrl-${index}`, 
          message: `Invalid PDF URL for range ${index + 1}. URL must end with .pdf` 
        })
      }
    })

    return errors;
  }

  const handleSplitFile = async () => {
    try {
      const errors = validateInputs()
      if (errors.length > 0) {
        setValidationErrors(errors)
        return
      }

      setIsLoading(true)
      setError(null)
      setValidationErrors([])

      const request: SplitRequest = {
        file_name: fileUrl,
        page_ranges: pageRanges.map(r => [r.start, r.end] as [number, number]),
        split_files: pageRanges.map(r => r.splitUrl)
      }

      const response = await splitService.split(request);
      if (!response) {
        throw new Error("No split files were created")
      }
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(error => error.field === field)?.message
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
              className={getFieldError('fileUrl') ? 'border-red-500' : ''}
            />
            {getFieldError('fileUrl') && (
              <p className="text-sm text-red-500">{getFieldError('fileUrl')}</p>
            )}
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
                      className={`w-20 ${getFieldError(`range-${index}`) ? 'border-red-500' : ''}`}
                    />
                    <span>to</span>
                    <Input
                      type="number"
                      min="1"
                      value={range.end}
                      onChange={(e) => handlePageRangeChange(index, 'end', e.target.value)}
                      className={`w-20 ${getFieldError(`range-${index}`) ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {pageRanges.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => removePageRange(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {getFieldError(`range-${index}`) && (
                  <p className="text-sm text-red-500">{getFieldError(`range-${index}`)}</p>
                )}
                <div className="ml-20">
                  <Input
                    type="url"
                    placeholder="Split file URL"
                    value={range.splitUrl}
                    onChange={(e) => handleSplitUrlChange(index, e.target.value)}
                    className={getFieldError(`splitUrl-${index}`) ? 'border-red-500' : ''}
                  />
                  {getFieldError(`splitUrl-${index}`) && (
                    <p className="text-sm text-red-500">{getFieldError(`splitUrl-${index}`)}</p>
                  )}
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

