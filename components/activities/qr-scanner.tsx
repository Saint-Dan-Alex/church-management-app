"use client"

import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/utils/api"

interface QRScannerProps {
    activityId: string
    onScanned: (participant: any) => void
}

export function QRScanner({ activityId, onScanned }: QRScannerProps) {
    const [lastScanned, setLastScanned] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const scannerRef = useRef<Html5QrcodeScanner | null>(null)

    useEffect(() => {
        // Initialisation du scanner
        const initScanner = () => {
            // Configuration pour prioriser les QR Codes
            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
            }

            const scanner = new Html5QrcodeScanner(
                "reader",
                config,
        /* verbose= */ false
            )

            scanner.render(onScanSuccess, onScanFailure)
            scannerRef.current = scanner
        }

        // Petit délai pour s'assurer que le DOM est prêt
        const timer = setTimeout(() => {
            initScanner()
        }, 100)

        return () => {
            clearTimeout(timer)
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode scanner. ", error)
                })
            }
        }
    }, [])

    const onScanSuccess = async (decodedText: string, decodedResult: any) => {
        // Éviter les doubles scans immédiats
        if (lastScanned === decodedText) return

        setLastScanned(decodedText)
        setError(null)

        // Jouer un bip (optionnel, peut nécessiter une interaction utilisateur préalable sur certains navigateurs)
        // const audio = new Audio('/beep.mp3'); audio.play().catch(() => {});

        try {
            // Appel API pour enregistrer la présence
            const response = await api.post(`/activities/${activityId}/scan`, {
                qr_code: decodedText
            })

            if (response && (response.status === 'success' || response.participant)) { // check flexibility
                onScanned(response)
                toast.success(response.message || "Scanné avec succès")

                // Reset last scanned after 3 seconds to allow re-scan if needed (though typically once per presence)
                setTimeout(() => setLastScanned(null), 3000)
            }
        } catch (err: any) {
            console.error("Scan error:", err)
            const errorMsg = err.response?.data?.message || "Erreur lors du traitement du scan"
            setError(errorMsg)
            toast.error(errorMsg)

            // Allow retry after error shortly
            setTimeout(() => setLastScanned(null), 2000)
        }
    }

    const onScanFailure = (error: any) => {
        // handle scan failure, usually better to ignore and keep scanning.
        // console.warn(`Code scan error = ${error}`);
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Scanner de Présence</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div id="reader" className="w-full overflow-hidden rounded-lg bg-gray-100 min-h-[300px]"></div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-5 w-5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {lastScanned && !error && (
                        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <div className="flex-1">
                                <p className="text-xs uppercase font-bold tracking-wider text-blue-500">Code détecté</p>
                                <p className="font-mono text-sm truncate">{lastScanned}</p>
                            </div>
                            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                        </div>
                    )}

                    <div className="text-center text-xs text-muted-foreground mt-4">
                        Placez le QR Code du participant devant la caméra
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
