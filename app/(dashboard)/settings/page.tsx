"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { settingsService, Setting } from "@/lib/services/settings.service"
import { Loader2, Upload, Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState<Record<string, string>>({})

    // États locaux pour les uploads
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null)

    // Aperçus
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [heroPreview, setHeroPreview] = useState<string | null>(null)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        setLoading(true)
        try {
            const data = await settingsService.getAll()
            // Transformer la liste en objet clé-valeur pour faciliter l'usage dans le form
            const settingsMap: Record<string, string> = {}
            data.forEach(s => {
                if (s.value) settingsMap[s.key] = s.value
            })
            setSettings(settingsMap)

            // Init previews
            if (settingsMap['app_logo']) setLogoPreview(settingsMap['app_logo'])
            if (settingsMap['landing_hero_image']) setHeroPreview(settingsMap['landing_hero_image'])

        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de charger les paramètres.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'hero') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const previewUrl = URL.createObjectURL(file)

            if (type === 'logo') {
                setLogoFile(file)
                setLogoPreview(previewUrl)
            } else {
                setHeroImageFile(file)
                setHeroPreview(previewUrl)
            }
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // 1. Sauvegarder les fichiers s'il y en a
            if (logoFile) {
                const res = await settingsService.uploadFile('app_logo', logoFile, 'general')
                settings['app_logo'] = res.url // Update local state URL incase we need it
                setLogoFile(null) // Reset file to avoid re-upload
            }

            if (heroImageFile) {
                const res = await settingsService.uploadFile('landing_hero_image', heroImageFile, 'landing')
                settings['landing_hero_image'] = res.url
                setHeroImageFile(null)
            }

            // 2. Sauvegarder les textes
            // Convertir l'objet settings en tableau pour l'API
            const updates = Object.entries(settings).map(([key, value]) => ({ key, value }))

            await settingsService.updateSettings(updates)

            toast({
                title: "Succès",
                description: "Paramètres mis à jour avec succès.",
            })

            // Recharger pour être sûr (et mettre à jour les contextes si on en avait)
            await loadSettings()

        } catch (error) {
            console.error(error)
            toast({
                title: "Erreur",
                description: "Erreur lors de la sauvegarde.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
                    <p className="text-muted-foreground">
                        Configurez l'apparence et le contenu de votre application.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Enregistrer
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">Général</TabsTrigger>
                    <TabsTrigger value="appearance">Apparence</TabsTrigger>
                    <TabsTrigger value="landing">Page d'accueil</TabsTrigger>
                </TabsList>

                {/* ONGLET GENERAL */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations Générales</CardTitle>
                            <CardDescription>
                                Détails de base de votre église / application.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="app_name">Nom de l'application</Label>
                                <Input
                                    id="app_name"
                                    value={settings['app_name'] || ''}
                                    onChange={(e) => handleInputChange('app_name', e.target.value)}
                                    placeholder="Ex: Ma Super Église"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="app_description">Description (Méta-description site)</Label>
                                <Textarea
                                    id="app_description"
                                    value={settings['app_description'] || ''}
                                    onChange={(e) => handleInputChange('app_description', e.target.value)}
                                    placeholder="Une brève description de votre assemblée..."
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Logo de l'application</Label>
                                <div className="flex items-center gap-4">
                                    {logoPreview && (
                                        <div className="h-20 w-20 relative border rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                                            <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'logo')}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Format recommandé : PNG transparent, 512x512px.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ONGLET APPARENCE */}
                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Couleurs & Thème</CardTitle>
                            <CardDescription>
                                Personnalisez les couleurs de l'interface.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="theme_primary_color">Couleur Primaire</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="theme_primary_color"
                                            type="color"
                                            className="w-12 h-10 p-1 cursor-pointer"
                                            value={settings['theme_primary_color'] || '#2563eb'}
                                            onChange={(e) => handleInputChange('theme_primary_color', e.target.value)}
                                        />
                                        <Input
                                            value={settings['theme_primary_color'] || '#2563eb'}
                                            onChange={(e) => handleInputChange('theme_primary_color', e.target.value)}
                                            placeholder="#2563eb"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Utilisée pour les boutons principaux, liens et header.</p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="theme_secondary_color">Couleur Secondaire / Accent</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="theme_secondary_color"
                                            type="color"
                                            className="w-12 h-10 p-1 cursor-pointer"
                                            value={settings['theme_secondary_color'] || '#1e40af'}
                                            onChange={(e) => handleInputChange('theme_secondary_color', e.target.value)}
                                        />
                                        <Input
                                            value={settings['theme_secondary_color'] || '#1e40af'}
                                            onChange={(e) => handleInputChange('theme_secondary_color', e.target.value)}
                                            placeholder="#1e40af"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ONGLET LANDING PAGE */}
                <TabsContent value="landing">
                    <Card>
                        <CardHeader>
                            <CardTitle>Page d'accueil (Landing Page)</CardTitle>
                            <CardDescription>
                                Contenu affiché aux visiteurs non connectés.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="landing_hero_title">Titre Principal (Hero Title)</Label>
                                <Input
                                    id="landing_hero_title"
                                    value={settings['landing_hero_title'] || ''}
                                    onChange={(e) => handleInputChange('landing_hero_title', e.target.value)}
                                    placeholder="Ex: Bienvenue à l'Église de la Grâce"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="landing_hero_subtitle">Sous-titre (Hero Subtitle)</Label>
                                <Textarea
                                    id="landing_hero_subtitle"
                                    value={settings['landing_hero_subtitle'] || ''}
                                    onChange={(e) => handleInputChange('landing_hero_subtitle', e.target.value)}
                                    placeholder="Une communauté vivante..."
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Image de fond / Hero Image</Label>
                                <div className="flex flex-col gap-4">
                                    {heroPreview && (
                                        <div className="w-full h-40 relative border rounded bg-gray-100 overflow-hidden">
                                            <img src={heroPreview} alt="Hero Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'hero')}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
