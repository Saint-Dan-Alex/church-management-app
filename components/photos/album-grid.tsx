"use client"

import { useState, useEffect } from "react"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Image as ImageIcon,
    Folder,
    ArrowLeft,
    Plus,
    Loader2,
} from "lucide-react"
import { photosService, type Photo, type PhotoAlbum } from "@/lib/services/photos.service"
import { PhotoGallery } from "./photo-gallery"

interface AlbumGridProps {
    refreshKey?: number
    onUploadClick?: () => void
}

export function AlbumGrid({ refreshKey = 0, onUploadClick }: AlbumGridProps) {
    const [albums, setAlbums] = useState<(PhotoAlbum & { photos_count?: number; cover_photo?: string })[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedAlbum, setSelectedAlbum] = useState<PhotoAlbum | null>(null)
    const [internalRefreshKey, setInternalRefreshKey] = useState(0)

    // Charger les albums avec leurs photos
    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                setLoading(true)
                const albumsData = await photosService.getAlbums()

                // Pour chaque album, récupérer le nombre de photos et la couverture
                const albumsWithDetails = await Promise.all(
                    albumsData.map(async (album) => {
                        try {
                            const response: any = await photosService.getAll({ album: album.id })
                            const photos = response.data || response
                            const photosArray = Array.isArray(photos) ? photos : []
                            return {
                                ...album,
                                photos_count: photosArray.length,
                                cover_photo: photosArray[0]?.url || null,
                            }
                        } catch {
                            return { ...album, photos_count: 0, cover_photo: null }
                        }
                    })
                )

                setAlbums(albumsWithDetails)
            } catch (err) {
                setError("Erreur lors du chargement des albums")
                console.error("Erreur:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchAlbums()
    }, [refreshKey, internalRefreshKey])

    const handleAlbumClick = (album: PhotoAlbum) => {
        setSelectedAlbum(album)
    }

    const handleBackClick = () => {
        setSelectedAlbum(null)
        setInternalRefreshKey(prev => prev + 1) // Recharger les albums au retour
    }

    // Affichage du contenu d'un album sélectionné
    if (selectedAlbum) {
        return (
            <div className="space-y-4">
                {/* Header de l'album */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackClick}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour
                    </Button>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold">{selectedAlbum.name}</h2>
                        {selectedAlbum.description && (
                            <p className="text-sm text-muted-foreground">{selectedAlbum.description}</p>
                        )}
                    </div>
                </div>

                {/* Photos de l'album */}
                <PhotoGallery
                    album={selectedAlbum.id}
                    refreshKey={internalRefreshKey}
                />
            </div>
        )
    }

    // Affichage de la grille des albums
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-gray-400 mb-3 animate-spin" />
                <p className="text-gray-500">Chargement des albums...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-red-400 mb-3" />
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {albums.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                    <Folder className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">Aucun album trouvé</p>
                    {onUploadClick && (
                        <PermissionGuard permission="photos.create">
                            <Button onClick={onUploadClick} size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Créer un album
                            </Button>
                        </PermissionGuard>
                    )}
                </div>
            ) : (
                albums.map((album) => (
                    <Card
                        key={album.id}
                        className="overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
                        onClick={() => handleAlbumClick(album)}
                    >
                        {/* Couverture de l'album */}
                        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                            {album.cover_photo ? (
                                <img
                                    src={album.cover_photo}
                                    alt={album.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Folder className="h-16 w-16 text-gray-300" />
                                </div>
                            )}

                            {/* Overlay avec nombre de photos */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Badge nombre de photos */}
                            <Badge
                                variant="secondary"
                                className="absolute bottom-2 right-2 bg-black/70 text-white border-0"
                            >
                                <ImageIcon className="h-3 w-3 mr-1" />
                                {album.photos_count || 0}
                            </Badge>
                        </div>

                        {/* Nom de l'album */}
                        <CardContent className="p-3">
                            <h3 className="font-semibold text-sm truncate">{album.name}</h3>
                            {album.description && (
                                <p className="text-xs text-gray-500 truncate mt-1">{album.description}</p>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    )
}
