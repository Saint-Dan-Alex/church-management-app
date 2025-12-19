"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogList } from "@/components/blog/blog-list"
import { AddBlogDialog } from "@/components/blog/add-blog-dialog"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleBlogCreated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 w-full">
      {/* Header responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Articles et communications</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="sm"
          className="w-full sm:w-auto text-xs sm:text-sm"
        >
          <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Nouvel Article</span>
          <span className="sm:hidden">Nouveau</span>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        {/* Onglets avec scroll horizontal sur mobile */}
        <div className="overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          <TabsList className="inline-flex min-w-max">
            <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Tous les Articles</span>
              <span className="sm:hidden">Tous</span>
            </TabsTrigger>
            <TabsTrigger value="published" className="text-xs sm:text-sm px-2 sm:px-3">Publiés</TabsTrigger>
            <TabsTrigger value="draft" className="text-xs sm:text-sm px-2 sm:px-3">Brouillons</TabsTrigger>
          </TabsList>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <TabsContent value="all">
          <BlogList searchQuery={searchQuery} filter="all" refreshKey={refreshKey} />
        </TabsContent>

        <TabsContent value="published">
          <BlogList searchQuery={searchQuery} filter="published" refreshKey={refreshKey} />
        </TabsContent>

        <TabsContent value="draft">
          <BlogList searchQuery={searchQuery} filter="draft" refreshKey={refreshKey} />
        </TabsContent>
      </Tabs>

      <AddBlogDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleBlogCreated}
      />
    </div>
  )
}
