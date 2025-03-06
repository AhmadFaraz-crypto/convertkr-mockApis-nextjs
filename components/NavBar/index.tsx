import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">ConvertKr API Demo</span>
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
  )
}