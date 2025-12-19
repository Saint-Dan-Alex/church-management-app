"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { videosService } from "@/lib/services/videos.service"
import { blogsService } from "@/lib/services/blogs.service"
import type { Video, VideoCategory } from "@/lib/types/api"
import { useToast } from "@/hooks/use-toast"

interface EditVideoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    video: Video | null
    onSuccess?: () => void
}

export function EditVideoDialog({ open, onOpenChange, video, onSuccess }: EditVideoDialogProps) {
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        categorie: "",
        url: "",
        miniature: "",
        auteur: "",
        date: "",
        duree: "",
    })

    const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null)
    const [categories, setCategories] = useState<VideoCategory[]>([])
    const [openCategory, setOpenCategory] = useState(false)
    const [categorySearch, setCategorySearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Charger les catégories et initialiser le formulaire
    useEffect(() => {
        if (open) {
            loadCategories()
        }

        if (open && video) {
            // Initialiser le formulaire avec les données de la vidéo
            let catValue = ""
            if (video.video_category_id) {
                catValue = video.video_category_id
            } else if (typeof video.category === 'object' && video.category !== null) {
                catValue = video.category.id
            } else if (typeof video.categorie === 'string') {
                catValue = video.categorie
            }

            setFormData({
                titre: video.titre || video.title || "",
                description: video.description || "",
                categorie: catValue,
                url: video.url || "",
                miniature: video.miniature || "",
                auteur: video.auteur || "",
                date: video.date ? new Date(video.date).toISOString().split('T')[0] : "",
                duree: video.duree || "",
            })
        }
    }, [open, video])

    const loadCategories = async () => {
        try {
            const data = await videosService.getCategories()
            setCategories(data)
        } catch (error) {
            console.error("Erreur chargement catégories:", error)
        }
    }

    const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Fichier trop volumineux",
                description: "L'image ne doit pas dépasser 5 Mo.",
                variant: "destructive",
            })
            return
        }

        setUploading(true)
        try {
            const uploadData = new FormData()
            uploadData.append("file", file)
            const res = await blogsService.uploadImage(uploadData)
            setFormData(prev => ({ ...prev, miniature: res.url }))
            toast({
                title: "Succès",
                description: "Miniature uploadée avec succès !",
            })
        } catch (err) {
            console.error("Erreur upload:", err)
            toast({
                title: "Erreur",
                description: "Échec de l'upload de la miniature.",
                variant: "destructive",
            })
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!video) return
        if (!formData.titre) {
            toast({ title: "Erreur", description: "Le titre est obligatoire", variant: "destructive" })
            return
        }

        setLoading(true)
        try {
            await videosService.update(video.id, {
                titre: formData.titre,
                description: formData.description || null,
                categorie: formData.categorie || null,
                url: formData.url,
                miniature: formData.miniature || null,
                auteur: formData.auteur || null,
                date: formData.date || null,
                duree: formData.duree || null,
            })

            toast({ title: "Succès", description: "Vidéo mise à jour avec succès !" })
            onOpenChange(false)
            if (onSuccess) onSuccess()

        } catch (error) {
            console.error("Erreur mise à jour:", error)
            toast({ title: "Erreur", description: "Échec de la mise à jour", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    if (!video) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifier la Vidéo</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de la vidéo
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4 pr-2">

                        <div className="grid gap-2">
                            <Label htmlFor="url">URL de la vidéo</Label>
                            <Input
                                id="url"
                                type="url"
                                value={formData.url || ""}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://youtube.com/..."
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Miniature</Label>
                            <div className="flex flex-col gap-2">
                                {formData.miniature && (
                                    <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden border">
                                        <img src={formData.miniature} alt="Aperçu" className="w-full h-full object-cover" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6"
                                            onClick={() => setFormData({ ...formData, miniature: "" })}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailSelect}
                                    disabled={uploading || loading}
                                />
                                {uploading && <p className="text-xs text-muted-foreground animate-pulse">Upload en cours...</p>}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="titre">Titre *</Label>
                            <Input
                                id="titre"
                                value={formData.titre || ""}
                                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Catégorie</Label>
                            <Popover open={openCategory} onOpenChange={setOpenCategory}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCategory}
                                        className="w-full justify-between"
                                    >
                                        {formData.categorie
                                            ? categories.find((cat) => cat.id === formData.categorie)?.name || formData.categorie
                                            : "Sélectionner..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Rechercher..." onValueChange={setCategorySearch} />
                                        <CommandList>
                                            <CommandEmpty>
                                                <div className="p-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="w-full justify-start text-sm"
                                                        onClick={() => {
                                                            setFormData({ ...formData, categorie: categorySearch });
                                                            setOpenCategory(false);
                                                        }}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Ajouter "{categorySearch}"
                                                    </Button>
                                                </div>
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {categories.map((category) => (
                                                    <CommandItem
                                                        key={category.id}
                                                        value={category.name}
                                                        onSelect={() => {
                                                            setFormData({ ...formData, categorie: category.id })
                                                            setOpenCategory(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.categorie === category.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {category.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date || ""}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="auteur">Auteur</Label>
                                <Input
                                    id="auteur"
                                    value={formData.auteur || ""}
                                    onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                                    placeholder="Admin"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="duree">Durée</Label>
                            <Input
                                id="duree"
                                value={formData.duree || ""}
                                onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                                placeholder="ex: 10:30"
                            />
                        </div>

                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
