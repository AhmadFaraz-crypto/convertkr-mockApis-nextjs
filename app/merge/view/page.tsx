"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Download, FileText, Loader2 } from "lucide-react"
import { mergeService, type MergeResponse } from "@/services/merge.service"

export default function ViewMergedFilesPage() {
  const [mergedFiles, setMergedFiles] = useState<MergeResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMergedFiles()
  }, [])

  const fetchMergedFiles = async () => {
    try {
      setIsLoading(true)
      const response = await mergeService.getMergedFiles()
      setMergedFiles(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch merged files")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading merged files...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Merged Files</h1>
      <p className="text-muted-foreground mb-8">View all your merged PDF files.</p>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : mergedFiles.length === 0 ? (
        <Alert>
          <AlertTitle>No merged files</AlertTitle>
          <AlertDescription>You haven't merged any files yet.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6">
          {mergedFiles.map((merge, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">Merged File {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Source Files:</p>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      {merge.files.map((file, fileIndex) => (
                        <li key={fileIndex}>
                          <a 
                            href={file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {file.split("/").pop()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>{merge.merged_file.split("/").pop()}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={merge.merged_file} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 