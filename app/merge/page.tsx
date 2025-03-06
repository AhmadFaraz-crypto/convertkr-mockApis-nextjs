"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileUp, Plus, Trash2, Download, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { mergeService, type MergeRequest, type MergeResponse } from "../../services/merge.service"
import { useRouter } from 'next/navigation'

interface MergeUrls {
  inputUrls: string[];
  mergedFileUrl: string;
}

export default function MergePage() {
  const router = useRouter()
  const [urls, setUrls] = useState<MergeUrls>({
    inputUrls: ["", ""],
    mergedFileUrl: "",
  })
  const [result, setResult] = useState<MergeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls.inputUrls]
    newUrls[index] = value
    setUrls(prev => ({
      ...prev,
      inputUrls: newUrls
    }))
  }

  const handleMergedUrlChange = (value: string) => {
    setUrls(prev => ({
      ...prev,
      mergedFileUrl: value
    }))
  }

  const addUrlInput = () => {
    setUrls(prev => ({
      ...prev,
      inputUrls: [...prev.inputUrls, ""]
    }))
  }

  const removeUrlInput = (index: number) => {
    if (urls.inputUrls.length <= 2) {
      setError("You need at least two files to merge")
      return
    }
    const newUrls = [...urls.inputUrls]
    newUrls.splice(index, 1)
    setUrls(prev => ({
      ...prev,
      inputUrls: newUrls
    }))
  }

  const handleMergeFiles = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Validate URLs
      if (urls.inputUrls.some(url => !url)) {
        throw new Error("Please provide all input file URLs")
      }
      if (!urls.mergedFileUrl) {
        throw new Error("Please provide the merged file URL")
      }

      const request: MergeRequest = {
        files: urls.inputUrls,
        merged_file: urls.mergedFileUrl
      }

      const response = await mergeService.merge(request)
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Merge API</h1>
      <p className="text-muted-foreground mb-8">Combine multiple files into a single output.</p>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Merge Files</CardTitle>
              <CardDescription>Enter URLs of the files you want to merge.</CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/merge/view')}
            >
              View Merged Files
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {urls.inputUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="url"
                placeholder={`File ${index + 1} URL`}
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                className="flex-1"
              />
              {index >= 2 && (
                <Button variant="outline" size="icon" onClick={() => removeUrlInput(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button variant="outline" onClick={addUrlInput} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Another File
          </Button>

          <div className="pt-4 border-t">
            <Input
              type="url"
              placeholder="Merged File URL"
              value={urls.mergedFileUrl}
              onChange={(e) => handleMergedUrlChange(e.target.value)}
              className="w-full"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleMergeFiles} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Merging Files...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Merge Files
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
          <AlertTitle>Merge Successful</AlertTitle>
          <AlertDescription>
            <div className="space-y-4">
              <p>Your files have been successfully merged.</p>

              <div className="space-y-2">
                <p className="text-sm font-medium">Input Files:</p>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  {result.files.map((file, index) => (
                    <li key={index}>
                      <a 
                        href={file} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {file.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span className="font-medium">{result.merged_file.split("/").pop()}</span>
                <Button variant="outline" asChild>
                  <a 
                    href={result.merged_file} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

