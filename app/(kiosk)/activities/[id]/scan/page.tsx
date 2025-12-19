"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { QRScanner } from "@/components/activities/qr-scanner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"

export default function KioskScanPage() {
    const params = useParams()
    const router = useRouter()
    const activityId = params.id as string
    const [lastParticipant, setLastParticipant] = useState<any>(null)

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl mx-auto space-y-8">

                {/* Header Navigation */}
                <div className="flex justify-between items-center">
                    <Button
                        variant="ghost"
                        className="text-white hover:text-slate-200 hover:bg-slate-800"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à l'admin
                    </Button>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold">Mode Kiosque</h1>
                        <p className="text-slate-400">Scannez votre code pour valider votre présence</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Scanner Column */}
                    <div className="order-2 md:order-1">
                        <QRScanner
                            activityId={activityId}
                            onScanned={(data) => setLastParticipant(data)}
                        />
                    </div>

                    {/* Feedback Column */}
                    <div className="order-1 md:order-2 space-y-6 text-center">
                        {lastParticipant ? (
                            <div className="animate-in zoom-in-50 duration-300">
                                <div className={`mx-auto h-32 w-32 rounded-full flex items-center justify-center mb-6 ${lastParticipant.status === 'success' || !lastParticipant.error
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                    }`}>
                                    {lastParticipant.status === 'success' || !lastParticipant.error ? (
                                        <CheckCircle2 className="h-20 w-20" />
                                    ) : (
                                        <XCircle className="h-20 w-20" />
                                    )}
                                </div>

                                <h2 className="text-4xl font-bold mb-2">
                                    {lastParticipant.message || "Bienvenue !"}
                                </h2>

                                {lastParticipant.participant && (
                                    <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                        <p className="text-xl font-medium text-slate-200">
                                            {lastParticipant.participant.participant_nom_complet}
                                        </p>
                                        <div className="flex justify-center gap-2 mt-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${lastParticipant.participant.a_paye
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-yellow-500/20 text-yellow-400"
                                                }`}>
                                                {lastParticipant.participant.a_paye ? "Payé" : "Paiement en attente"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-20 animate-in fade-in">
                                <div className="mx-auto h-32 w-32 bg-slate-800 rounded-full flex items-center justify-center mb-6 opacity-50">
                                    <div className="h-24 w-24 border-4 border-slate-600 rounded-lg border-dashed"></div>
                                </div>
                                <h2 className="text-3xl font-bold text-slate-500">Prêt à scanner...</h2>
                                <p className="text-slate-400 mt-2">Présentez votre QR code devant la caméra</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
