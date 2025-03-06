export default function Footer() {
    return (
      <footer className="border-t">
        <div className="container flex h-14 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PDF Tools. All rights reserved.
          </p>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <a 
              href="https://github.com/AhmadFaraz-crypto/convertkr-mockApis-nextjs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    )
  }