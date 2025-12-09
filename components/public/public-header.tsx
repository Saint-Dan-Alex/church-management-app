"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Church, Menu, X, ChevronDown } from "lucide-react"
import { useState } from "react"

interface PublicHeaderProps {
  settings?: Record<string, any>
}

export function PublicHeader({ settings = {} }: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const appName = settings?.app_name || "Centre Evangelique Arche de l'Alliance"
  const logo = settings?.app_logo

  const navigation = [
    { name: "Accueil", href: "/" },
    {
      name: "L'Église",
      submenu: [
        { name: "Doctrine", href: "#doctrine" },
        { name: "Le Pentecôtisme", href: "#pentecostisme" },
        { name: "Le Pasteur", href: "#pasteur" },
        { name: "Nos réunions", href: "#reunions" },
        { name: "Nos cellules de prière", href: "#cellules" },
      ],
    },
    { name: "Projet Construction", href: "#construction" },
    {
      name: "Nos Églises",
      submenu: [
        { name: "À Kinshasa", href: "#kinshasa" },
        { name: "En RDC", href: "#rdc" },
        { name: "À travers le Monde", href: "#monde" },
      ],
    },
    {
      name: "Médias",
      submenu: [
        { name: "Messages", href: "/blog-public" },
        { name: "La Borne TV", href: "/videos-public" },
        { name: "Photothèque", href: "/gallery-public" },
      ],
    },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ]
  /* Navigation End */

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-b border-amber-600/30">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {logo ? (
              <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
            ) : (
              <Church className="h-8 w-8 text-amber-500" />
            )}
            <span className="text-sm md:text-base font-bold text-white hidden sm:inline">
              {appName}
            </span>
            <span className="text-xs md:hidden text-white">{appName.substring(0, 4).toUpperCase()}...</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href || "#"}
                  className="px-3 py-2 text-sm text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  {item.name}
                  {"submenu" in item && <ChevronDown className="h-4 w-4" />}
                </Link>

                {/* Dropdown Menu */}
                {"submenu" in item && (
                  <div className="absolute left-0 mt-0 w-48 bg-slate-900 border border-amber-600/30 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className="block px-4 py-2 text-sm text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Login Button */}
          <div className="hidden lg:block">
            <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
              <Link href="/login">Connexion Admin</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-amber-600/30">
            {navigation.map((item) => (
              <div key={item.name}>
                {"submenu" in item ? (
                  <>
                    <button
                      onClick={() => setExpandedMenu(expandedMenu === item.name ? null : item.name)}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded transition-colors flex items-center justify-between"
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedMenu === item.name ? "rotate-180" : ""}`}
                      />
                    </button>
                    {expandedMenu === item.name && (
                      <div className="pl-4 space-y-2">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className="block px-4 py-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Button asChild variant="default" className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
              <Link href="/login">Connexion Admin</Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}
