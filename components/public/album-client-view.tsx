"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface Photo {
    id: string
    url: string
    titre?: string
    description?: string
}

interface AlbumClientViewProps {
    albumName: string
    photos: Photo[]
}

export function AlbumClientView({ albumName, photos }: AlbumClientViewProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    const openLightbox = (index: number) => setSelectedIndex(index)
    const closeLightbox = () => setSelectedIndex(null)
    const nextPhoto = () => setSelectedIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : prev))
    const prevPhoto = () => setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))

    // Handle keyboard navigation
    // (Omitted for brevity to stay simple, but good enhancement)

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {photos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="aspect-square relative overflow-hidden rounded-xl cursor-pointer bg-slate-900 group"
                        onClick={() => openLightbox(index)}
                    >
                        <img
                            src={photo.url}
                            alt={photo.titre || `Photo ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                ))}
            </div>

            <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && closeLightbox()}>
                <DialogContent className="max-w-[95vw] w-fit p-0 bg-transparent border-none shadow-none text-white overflow-hidden flex items-center justify-center">
                    {/* Overlay Navigation */}
                    <button onClick={closeLightbox} className="absolute top-4 right-4 z-[60] p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                        <X className="w-6 h-6" />
                    </button>

                    {selectedIndex !== null && (
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                            <div className="relative flex items-center justify-center">
                                {selectedIndex > 0 && (
                                    <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }} className="fixed left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                )}

                                <img
                                    src={photos[selectedIndex].url}
                                    alt={photos[selectedIndex].titre || "Full size"}
                                    className="max-h-[85vh] max-w-[90vw] object-contain rounded-md shadow-2xl"
                                />

                                {selectedIndex < photos.length - 1 && (
                                    <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }} className="fixed right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                )}
                            </div>

                            {(photos[selectedIndex].titre || photos[selectedIndex].description) && (
                                <div className="mt-4 text-center p-4 bg-black/60 backdrop-blur-sm text-white rounded-xl max-w-2xl">
                                    {photos[selectedIndex].titre && <h3 className="font-bold text-lg">{photos[selectedIndex].titre}</h3>}
                                    {photos[selectedIndex].description && <p className="text-sm text-slate-300">{photos[selectedIndex].description}</p>}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
