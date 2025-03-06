import Link from "next/link"
import { ArrowRight, Combine, Scissors, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">API Demo</span>
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/merge"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Merge
              </Link>
              <Link
                href="/split"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Split
              </Link>
              <Link
                href="/conversions"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Conversions
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  API Demo Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Explore our powerful APIs for merging, splitting, and tracking conversions.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Combine className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Merge API</CardTitle>
                  <CardDescription>Combine multiple files or data sources into a single output.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our merge API allows you to seamlessly combine multiple files, documents, or data sources into a
                    unified format.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/merge" className="w-full">
                    <Button className="w-full">
                      Try Merge API
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Scissors className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Split API</CardTitle>
                  <CardDescription>Divide a single file or data source into multiple parts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    The split API enables you to divide large files or data sets into smaller, more manageable pieces
                    with precision.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/split" className="w-full">
                    <Button className="w-full">
                      Try Split API
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <History className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Conversion API</CardTitle>
                  <CardDescription>Convert files between different formats.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Easily convert files between various formats including documents, images, audio, and video with our
                    powerful conversion API.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/conversions" className="w-full">
                    <Button className="w-full">
                      Try Conversion API
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Powerful API Solutions</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our APIs are designed to handle complex data operations with ease, providing reliable and efficient
                    solutions for your needs.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Fast and reliable processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Secure data handling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Comprehensive conversion tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Simple, intuitive interfaces</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Get Started Today</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Explore our API documentation and start integrating our powerful tools into your workflow.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button variant="outline"><a target="_blank" href="https://www.postman.com/ahmadfarazjutt3/convertkr/overview">View Documentation</a></Button>
                  <Button><a target="_blank" href="https://convertkr.com/mock-apis">Try Demo</a></Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            © {new Date().getFullYear()} API Demo. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Docs
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

