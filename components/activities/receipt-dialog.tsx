"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useRef } from "react"

interface ReceiptDialogProps {
    isOpen: boolean
    onClose: () => void
    payment: any
}

export function ReceiptDialog({ isOpen, onClose, payment }: ReceiptDialogProps) {
    const contentRef = useRef<HTMLDivElement>(null)

    if (!payment) return null

    const handlePrint = () => {
        const printContent = contentRef.current
        if (printContent) {
            const originalContents = document.body.innerHTML
            const printContents = printContent.innerHTML

            // Créer une iframe invisible pour l'impression propre ou utiliser une fenêtre
            // Méthode simple : ouvrir une fenêtre
            const printWindow = window.open('', '', 'height=600,width=800')
            if (printWindow) {
                printWindow.document.write('<html><head><title>Reçu de Paiement</title>')
                printWindow.document.write('<style>')
                printWindow.document.write(`
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #1a365d; margin: 0; }
          .subtitle { color: #718096; margin-top: 5px; }
          .details { margin-bottom: 30px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .label { font-weight: bold; color: #4a5568; }
          .value { text-align: right; }
          .amount-box { background: #f7fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; border: 1px solid #e2e8f0; }
          .amount-label { font-size: 14px; text-transform: uppercase; color: #718096; letter-spacing: 1px; }
          .amount-value { font-size: 32px; font-weight: bold; color: #2d3748; margin-top: 5px; }
          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #eee; padding-top: 20px; }
          .status-paid { color: #276749; font-weight: bold; text-transform: uppercase; border: 2px solid #276749; padding: 5px 10px; display: inline-block; transform: rotate(-10deg); opacity: 0.8; }
        `)
                printWindow.document.write('</style></head><body>')
                printWindow.document.write(printContents)
                printWindow.document.write('</body></html>')
                printWindow.document.close()
                printWindow.print()
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Reçu de Paiement</DialogTitle>
                </DialogHeader>

                <div className="bg-white p-6 rounded-lg border shadow-sm my-4" ref={contentRef}>
                    <div className="text-center border-b pb-4 mb-6">
                        <h2 className="text-xl font-bold text-slate-800">REÇU DE PAIEMENT</h2>
                        <p className="text-sm text-slate-500 mt-1">Église Eaux Paisibles</p>
                    </div>

                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500">Date</span>
                            <span className="font-medium">
                                {new Date(payment.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500">Référence</span>
                            <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                                PAY-{payment.id.substring(0, 8).toUpperCase()}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500">Participant</span>
                            <span className="font-medium text-slate-900">
                                {payment.participant_nom_complet}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500">Activité</span>
                            <span className="font-medium text-slate-900">
                                {payment.activity_nom}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500">Moyen de paiement</span>
                            <span className="capitalize">{payment.methode_paiement || 'Espèces'}</span>
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
                            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Montant Payé</span>
                            <div className="text-3xl font-bold text-slate-800 mt-1">
                                {parseFloat(payment.montant).toLocaleString(undefined, { minimumFractionDigits: 2 })} {payment.devise}
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <span className="border-2 border-green-600 text-green-700 font-bold px-3 py-1 rounded uppercase text-xs inline-block transform -rotate-6">
                                {payment.statut === 'paid' ? 'PAYÉ' : 'REÇU PARTIEL'}
                            </span>
                        </div>

                        <div className="mt-8 pt-4 border-t text-center text-xs text-slate-400">
                            <p>Merci pour votre contribution !</p>
                            <p className="mt-1">Ce document tient lieu de reçu officiel.</p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Fermer</Button>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Imprimer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
