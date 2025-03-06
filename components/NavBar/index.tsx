"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Github } from "lucide-react" // Add Github icon

const navigation = [
  { name: "Merge PDF", href: "/merge" },
  { name: "Split PDF", href: "/split" },
  { name: "Convert Files", href: "/conversions" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 text-xl font-bold">
            PDF Tools
          </Link>
          <div className="flex gap-6">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-black dark:text-white" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
        <a
          href="https://github.com/AhmadFaraz-crypto/convertkr-mockApis-nextjs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <Github className="h-5 w-5" />
          <span className="hidden sm:inline">View on GitHub</span>
        </a>
      </div>
    </nav>
  )
}