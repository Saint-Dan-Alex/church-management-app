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
        { name: "Vision & Mission", href: "#vision" },
        { name: "Notre Histoire", href: "#histoire" },
        { name: "Le Pasteur", href: "#pasteur" },
      ],
    },
    {
      name: "Nos Commissions",
      submenu: [
        { name: "Évangélisation", href: "#evangelisation" },
        { name: "Accueil & Protocole", href: "#accueil" },
        { name: "Social & Compassion", href: "#social" },
        { name: "Jeunesse", href: "#jeunesse" },
        { name: "Femmes", href: "#femmes" },
      ],
    },
    {
      name: "Médias",
      submenu: [
        { name: "Vidéothèque", href: "/videos-public" },
        { name: "Photothèque", href: "/gallery-public" },
        { name: "Enseignements", href: "/blog-public" },
      ],
    },
    { name: "Activités", href: "#activites" },
    { name: "Contact", href: "#contact" },
  ]
  /* Navigation End */

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            {logo ? (
              <img src={logo} alt="Logo" className="h-10 w-10 object-contain transition-transform group-hover:scale-105" />
            ) : (
              <Church className="h-8 w-8 text-white group-hover:text-amber-400 transition-colors" />
            )}
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-none tracking-tight">
                {appName.split(' ')[0]} {/* Affiche le premier mot en gros (ex: COMPASSION) ou nom complet si court */}
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-widest uppercase hidden sm:block">
                {appName.length > 10 ? 'ONLINE' : ''} {/* Petit sous-titre stylé */}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href || "#"}
                  className="px-2 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors flex items-center gap-1 tracking-wide"
                >
                  {item.name}
                  {"submenu" in item && <ChevronDown className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />}
                </Link>

                {/* Dropdown Menu */}
                {"submenu" in item && (
                  <div className="absolute left-0 mt-2 w-56 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 backdrop-blur-xl transform origin-top group-hover:translate-y-0 translate-y-2">
                    <div className="p-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Login Button */}
          <div className="hidden lg:block">
            <Button asChild size="default" className="bg-white text-slate-950 hover:bg-slate-200 rounded-full px-6 font-semibold shadow-lg shadow-white/5 transition-all hover:scale-105">
              <Link href="/login">Se connecter</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl absolute left-0 right-0 px-4 shadow-2xl">
            {navigation.map((item) => (
              <div key={item.name}>
                {"submenu" in item ? (
                  <>
                    <button
                      onClick={() => setExpandedMenu(expandedMenu === item.name ? null : item.name)}
                      className="w-full text-left px-4 py-3 text-slate-200 font-medium rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedMenu === item.name ? "rotate-180" : ""}`}
                      />
                    </button>
                    {expandedMenu === item.name && (
                      <div className="pl-4 space-y-1 mb-2 border-l-2 border-white/10 ml-4">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className="block px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
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
                    className="block px-4 py-3 text-slate-200 font-medium rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 mt-4 border-t border-white/10">
              <Button asChild className="w-full bg-white text-slate-950 hover:bg-slate-200 rounded-full py-6 font-semibold">
                <Link href="/login">Se connecter</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
