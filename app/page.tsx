import { HeroSection } from "@/components/public/hero-section"
import { AboutSection } from "@/components/public/about-section"
import { ValuesSection } from "@/components/public/values-section"
import { BlogPreview } from "@/components/public/blog-preview"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { CommissionsSection } from "@/components/public/commissions-section"
import { ActivitiesSection } from "@/components/public/activities-section"

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

async function getActivities() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
  try {
    const res = await fetch(`${apiUrl}/public/activities`, { cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    console.error("Error fetching activities:", error)
    return []
  }
}

async function getBlogs() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
  try {
    const res = await fetch(`${apiUrl}/public/blogs?per_page=3`, { cache: 'no-store' })
    if (!res.ok) return { data: [] }
    return await res.json()
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return { data: [] }
  }
}

export default async function HomePage() {
  const [settings, activities, blogsData] = await Promise.all([
    getSettings(),
    getActivities(),
    getBlogs()
  ])

  const posts = blogsData.data || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      <PublicHeader settings={settings} />
      <main>
        <HeroSection settings={settings} />
        <AboutSection />
        <CommissionsSection />
        <ActivitiesSection activities={activities} />
        <ValuesSection />
        <BlogPreview posts={posts} />
      </main>
      <PublicFooter settings={settings} />
    </div>
  )
}
