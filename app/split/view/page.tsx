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
  const [fileErrors, setFileErrors] = useState<{ [key: string]: string }>({})

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
          {splitFiles.map((splitFile, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">Split Operation {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Original File:</p>
                    <div>
                      <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          <span className="text-sm">{splitFile.file_name.split("/").pop()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              if (handleFileClick(splitFile.file_name, `original-${index}`)) {
                                window.open(splitFile.file_name, '_blank')
                              }
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Open Original
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              if (handleFileClick(splitFile.file_name, `original-${index}`)) {
                                const a = document.createElement('a')
                                a.href = splitFile.file_name
                                a.download = splitFile.file_name.split("/").pop() || ""
                                a.click()
                              }
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                      {fileErrors[`original-${index}`] && (
                        <p className="text-sm text-red-500 mt-1">{fileErrors[`original-${index}`]}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Split Parts:</p>
                    <div className="space-y-2">
                      {splitFile.split_files.map((file, fileIndex) => (
                        <div key={fileIndex}>
                          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              <span className="text-sm">
                                Part {fileIndex + 1} (Pages {splitFile.page_ranges[fileIndex][0]}-{splitFile.page_ranges[fileIndex][1]})
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  if (handleFileClick(file, `split-${index}-${fileIndex}`)) {
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
                                  if (handleFileClick(file, `split-${index}-${fileIndex}`)) {
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
                          {fileErrors[`split-${index}-${fileIndex}`] && (
                            <p className="text-sm text-red-500 mt-1">{fileErrors[`split-${index}-${fileIndex}`]}</p>
                          )}
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