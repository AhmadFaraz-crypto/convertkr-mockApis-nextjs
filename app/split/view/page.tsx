"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Download, FileText, Loader2, Eye } from "lucide-react"
import { splitService, type SplitResponse } from "@/services/split.service"

export default function ViewSplitFilesPage() {
  const [splitFiles, setSplitFiles] = useState<SplitResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSplitFiles()
  }, [])

  const fetchSplitFiles = async () => {
    try {
      setIsLoading(true)
      const response = await splitService.getSplitFiles()
      setSplitFiles(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch split files")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading split files...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Split Files</h1>
      <p className="text-muted-foreground mb-8">View all your split PDF files.</p>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : splitFiles.length === 0 ? (
        <Alert>
          <AlertTitle>No split files</AlertTitle>
          <AlertDescription>You haven't split any files yet.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6">
          {splitFiles.map((split, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Split Operation {index + 1}</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={split.file_name} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Original PDF
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Original File:</p>
                    <div className="flex items-center text-sm p-2 bg-muted rounded-md">
                      <FileText className="h-4 w-4 mr-2" />
                      {split.file_name.split("/").pop()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Split Files:</p>
                    <div className="grid gap-2">
                      {split.split_files.map((file, fileIndex) => (
                        <div key={fileIndex} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            <span className="text-sm">
                              Part {fileIndex + 1} (Pages {split.page_ranges[fileIndex][0]}-{split.page_ranges[fileIndex][1]})
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a 
                                href={file} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Open
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a 
                                href={file} 
                                download
                                rel="noopener noreferrer"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
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