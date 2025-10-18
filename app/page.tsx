import { HeroSection } from "@/components/public/hero-section"
import { AboutSection } from "@/components/public/about-section"
import { ValuesSection } from "@/components/public/values-section"
import { BlogPreview } from "@/components/public/blog-preview"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
      <PublicHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <ValuesSection />
        <BlogPreview />
      </main>
      <PublicFooter />
    </div>
  )
}
