"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Download, FileText, Loader2, Eye } from "lucide-react"
import { mergeService, type MergeResponse } from "@/services/merge.service"

export default function ViewMergedFilesPage() {
  const [mergedFiles, setMergedFiles] = useState<MergeResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fileErrors, setFileErrors] = useState<{ [key: string]: string }>({})

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

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleFileClick = (url: string, errorKey: string) => {
    if (!isValidUrl(url)) {
      setFileErrors(prev => ({
        ...prev,
        [errorKey]: "Invalid URL format"
      }))
      return false
    }
    setFileErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[errorKey]
      return newErrors
    })
    return true
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
          {mergedFiles.map((mergedFile, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">Merged File {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Source Files:</p>
                    <div className="space-y-2">
                      {mergedFile.files.map((file, fileIndex) => (
                        <div key={fileIndex}>
                          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              <span className="text-sm">{file.split("/").pop()}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  if (handleFileClick(file, `source-${index}-${fileIndex}`)) {
                                    window.open(file, '_blank')
                                  }
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Open
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  if (handleFileClick(file, `source-${index}-${fileIndex}`)) {
                                    const a = document.createElement('a')
                                    a.href = file
                                    a.download = file.split("/").pop() || ""
                                    a.click()
                                  }
                                }}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </div>
                          {fileErrors[`source-${index}-${fileIndex}`] && (
                            <p className="text-sm text-red-500 mt-1">{fileErrors[`source-${index}-${fileIndex}`]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Merged Result:</p>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="text-sm">{mergedFile.merged_file.split("/").pop()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            if (handleFileClick(mergedFile.merged_file, `merged-${index}`)) {
                              window.open(mergedFile.merged_file, '_blank')
                            }
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Open Merged
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            if (handleFileClick(mergedFile.merged_file, `merged-${index}`)) {
                              const a = document.createElement('a')
                              a.href = mergedFile.merged_file
                              a.download = mergedFile.merged_file.split("/").pop() || ""
                              a.click()
                            }
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                    {fileErrors[`merged-${index}`] && (
                      <p className="text-sm text-red-500 mt-1">{fileErrors[`merged-${index}`]}</p>
                    )}
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