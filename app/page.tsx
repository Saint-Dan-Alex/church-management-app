import { Suspense } from "react"
import { HeroSection } from "@/components/public/hero-section"
import { AboutSection } from "@/components/public/about-section"
import { ValuesSection } from "@/components/public/values-section"
import { BlogPreview } from "@/components/public/blog-preview"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { CommissionsSection } from "@/components/public/commissions-section"
import { ActivitiesSection } from "@/components/public/activities-section"
import { Skeleton } from "@/components/ui/skeleton"

// Cache configuration - Revalidate every 5 minutes instead of no-store (instant speed boost)
const FETCH_CONFIG = { next: { revalidate: 300 } }
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'

async function getSettings() {
  try {
    const res = await fetch(`${API_URL}/public-settings`, FETCH_CONFIG)
    if (!res.ok) return {}
    return await res.json()
  } catch (error) {
    return {}
  }
}

async function getActivities() {
  try {
    const res = await fetch(`${API_URL}/public/activities`, FETCH_CONFIG)
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    return []
  }
}

async function getBlogs() {
  try {
    const res = await fetch(`${API_URL}/public/blogs?per_page=3`, FETCH_CONFIG)
    if (!res.ok) return { data: [] }
    return await res.json()
  } catch (error) {
    return { data: [] }
  }
}

// Wrapper components to handle suspense data fetching
async function ActivitiesWrapper() {
  const activities = await getActivities()
  return <ActivitiesSection activities={activities} />
}

async function BlogWrapper() {
  const blogsData = await getBlogs()
  const posts = blogsData.data || []
  return <BlogPreview posts={posts} />
}

// Loading Fallbacks
function SectionLoading() {
  return (
    <div className="py-24 px-4 bg-slate-900">
      <div className="container mx-auto max-w-6xl space-y-8">
        <Skeleton className="h-12 w-64 mx-auto bg-slate-800" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full bg-slate-800" />
          <Skeleton className="h-64 w-full bg-slate-800" />
          <Skeleton className="h-64 w-full bg-slate-800" />
        </div>
      </div>
    </div>
  )
}

export default async function HomePage() {
  // Fetch settings critical for LCP (Largest Contentful Paint) - Header/Hero
  const settings = await getSettings()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-500/30">
      {/* Header - Critical */}
      <PublicHeader settings={settings} />

      <main>
        {/* Hero - Critical */}
        <HeroSection settings={settings} />

        {/* Static Sections - Instant Load */}
        <AboutSection />
        <CommissionsSection />

        {/* Dynamic Sections - Streamed via Suspense */}
        <Suspense fallback={<SectionLoading />}>
          <ActivitiesWrapper />
        </Suspense>

        <ValuesSection />

        <Suspense fallback={<SectionLoading />}>
          <BlogWrapper />
        </Suspense>
      </main>

      {/* Footer */}
      <PublicFooter settings={settings} />
    </div>
  )
}
