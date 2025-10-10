import { useState, useEffect } from "react"
import { Logo } from "./Logo"
import { Nav } from "./Nav"
import { MobileNav } from "./MobileNav"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${isScrolled ? "bg-white/20 backdrop-blur-lg shadow-lg" : "bg-transparent"}
  `

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <a href="#" className="flex items-center gap-2">
          <Logo isScrolled={isScrolled} />
        </a>
        <Nav isScrolled={isScrolled} />
        <MobileNav isScrolled={isScrolled} />
      </div>
    </header>
  )
}