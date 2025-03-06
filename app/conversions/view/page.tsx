"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Download, FileText, Loader2, Eye } from "lucide-react"
import { conversionService, type ConversionResponse } from "@/services/conversion.service"

export default function ViewConversionsPage() {
  const [conversions, setConversions] = useState<ConversionResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConversions()
  }, [])

  const fetchConversions = async () => {
    try {
      setIsLoading(true)
      const response = await conversionService.getConversions()
      setConversions(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch conversions")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading conversions...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">File Conversions</h1>
      <p className="text-muted-foreground mb-8">View all your converted files.</p>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : conversions.length === 0 ? (
        <Alert>
          <AlertTitle>No conversions</AlertTitle>
          <AlertDescription>You haven't converted any files yet.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6">
          {conversions.map((conversion, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Conversion {index + 1}: {conversion.file_type.toUpperCase()} to {conversion.target_type.toUpperCase()}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Original File ({conversion.file_type.toUpperCase()}):</p>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="text-sm">{conversion.file_url.split("/").pop()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={conversion.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Open Original
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={conversion.file_url} 
                            download
                            rel="noopener noreferrer"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Converted File ({conversion.target_type.toUpperCase()}):</p>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="text-sm">{conversion.output_file_url.split("/").pop()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={conversion.output_file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Open Converted
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={conversion.output_file_url} 
                            download
                            rel="noopener noreferrer"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </div>
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