"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUp, Download, Settings2, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from 'next/navigation'
import { ConversionResponse, conversionService } from "@/services/conversion.service"
// Available conversion formats
const conversionFormats = {
  pdf: ["png", "jpg"],
  png: ["pdf", "jpg"],
  jpg: ["pdf", "png"],
  webp: ["pdf", "png", "jpg"],
}

export default function ConversionsPage() {
  const router = useRouter()
  const [fileUrl, setFileUrl] = useState<string>("")
  const [fileType, setFileType] = useState<string>("")
  const [targetType, setTargetType] = useState<string>("")
  const [outputFileUrl, setOutputFileUrl] = useState<string>("")
  const [result, setResult] = useState<ConversionResponse | null>(null)
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUrlChange = (url: string) => {
    setFileUrl(url)
    setResult(null)
    setError(null)

    // Detect file type from URL extension
    const extension = url.split('.').pop()?.toLowerCase() || ""
    if (conversionFormats[extension as keyof typeof conversionFormats]) {
      setFileType(extension)
      setTargetType("")
    }
  }

  const getAvailableFormats = () => {
    if (!fileType || !conversionFormats[fileType as keyof typeof conversionFormats]) {
      return []
    }
    return conversionFormats[fileType as keyof typeof conversionFormats]
  }

  const handleConvert = async () => {
    if (!fileUrl) {
      setError("Please enter a file URL to convert")
      return
    }

    if (!fileType) {
      setError("Please select input file type")
      return
    }

    if (!targetType) {
      setError("Please select an output format")
      return
    }

    if (!outputFileUrl) {
      setError("Please enter the output file URL")
      return
    }

    try {
      setIsConverting(true)
      setError(null)

      const response = await conversionService.convert({
        file_type: fileType,
        file_url: fileUrl,
        target_type: targetType,
        output_file_url: outputFileUrl,
      })
      setResult(response)
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">File Conversion API</h1>
      <p className="text-muted-foreground mb-8">
        Convert files between different formats with our powerful conversion API.
      </p>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Convert Files</CardTitle>
              <CardDescription>Convert files between different formats.</CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/conversions/view')}
            >
              View Conversions
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file-url">Input File URL</Label>
            <Input
              id="file-url"
              type="url"
              placeholder="Enter the URL of your file"
              value={fileUrl}
              onChange={(e) => handleFileUrlChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-type">Input File Type</Label>
            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger id="file-type">
                <SelectValue placeholder="Select input format" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(conversionFormats).map((format) => (
                  <SelectItem key={format} value={format}>
                    {format.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {fileType && (
            <div className="space-y-2">
              <Label htmlFor="target-format">Output Format</Label>
              <Select value={targetType} onValueChange={setTargetType}>
                <SelectTrigger id="target-format">
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableFormats().map((format) => (
                    <SelectItem key={format} value={format}>
                      {format.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {targetType && (
            <div className="space-y-2">
              <Label htmlFor="output-url">Output File URL</Label>
              <Input
                id="output-url"
                type="url"
                placeholder="Enter the desired output file URL"
                value={outputFileUrl}
                onChange={(e) => setOutputFileUrl(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleConvert}
            className="w-full"
            disabled={isConverting || !fileUrl || !fileType || !targetType || !outputFileUrl}
          >
            {isConverting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Convert File
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
          <AlertTitle>Conversion Successful</AlertTitle>
          <AlertDescription>
            <div className="space-y-4">
              <p>
                Your file has been successfully converted from {result.file_type.toUpperCase()} to{" "}
                {result.target_type.toUpperCase()}.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Input File:</p>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span>{result.file_url.split("/").pop()}</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={result.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download Original
                    </a>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Converted File:</p>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span>{result.output_file_url.split("/").pop()}</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={result.output_file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download Converted
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

