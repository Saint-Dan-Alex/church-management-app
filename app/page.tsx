import { HeroSection } from "@/components/public/hero-section"
import { AboutSection } from "@/components/public/about-section"
import { ValuesSection } from "@/components/public/values-section"
import { BlogPreview } from "@/components/public/blog-preview"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"

async function getSettings() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
  try {
    const res = await fetch(`${apiUrl}/public-settings`, { cache: 'no-store' })
    if (!res.ok) return {}
    return await res.json()
  } catch (error) {
    console.error("Error fetching settings:", error)
    return {}
  }
}

export default async function HomePage() {
  const settings = await getSettings()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      <PublicHeader settings={settings} />
      <main>
        <HeroSection settings={settings} />
        <AboutSection />
        <ValuesSection />
        <BlogPreview />
      </main>
      <PublicFooter settings={settings} />
    </div>
  )
}
