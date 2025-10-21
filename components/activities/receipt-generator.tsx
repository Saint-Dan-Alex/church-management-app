"use client"

import { useRef } from "react"
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button"
import { CHURCH_INFO } from "@/lib/config/church-info"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Printer, Download } from "lucide-react"
import type { Payment } from "@/types/payment"

interface ReceiptGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: Payment
  activiteNom: string
}

export function ReceiptGenerator({
  open,
  onOpenChange,
  payment,
  activiteNom,
}: ReceiptGeneratorProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    // Méthode améliorée pour l'impression
    const printContent = document.getElementById('receipt-to-print')
    if (!printContent) {
      alert("Erreur : Contenu du reçu introuvable")
      return
    }

    // Créer une fenêtre d'impression
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert("Veuillez autoriser les popups pour imprimer")
      return
    }

    // Styles CSS pour l'impression
    const styles = `
      <style>
        @page {
          size: A4;
          margin: 1.5cm;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #000;
        }
        * {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        button {
          display: none !important;
        }
        .text-center {
          text-align: center;
        }
        .flex {
          display: flex;
        }
        .flex-col {
          flex-direction: column;
        }
        .items-center {
          align-items: center;
        }
        .justify-center {
          justify-content: center;
        }
        .justify-between {
          justify-content: space-between;
        }
        .gap-3 {
          gap: 0.75rem;
        }
        .mb-4 {
          margin-bottom: 1rem;
        }
        .mb-6 {
          margin-bottom: 1.5rem;
        }
        .mt-2 {
          margin-top: 0.5rem;
        }
        .mt-4 {
          margin-top: 1rem;
        }
        .pb-6 {
          padding-bottom: 1.5rem;
        }
        .p-4 {
          padding: 1rem;
        }
        .border-b-2 {
          border-bottom: 2px solid #1f2937;
        }
        .border-gray-800 {
          border-color: #1f2937;
        }
        .bg-gray-50 {
          background-color: #f9fafb;
        }
        .rounded-lg {
          border-radius: 0.5rem;
        }
        .text-xl {
          font-size: 1.25rem;
          line-height: 1.75rem;
        }
        .text-3xl {
          font-size: 1.875rem;
          line-height: 2.25rem;
        }
        .font-bold {
          font-weight: 700;
        }
        .font-semibold {
          font-weight: 600;
        }
        .font-medium {
          font-weight: 500;
        }
        .text-blue-900 {
          color: #1e3a8a;
        }
        .text-blue-700 {
          color: #1d4ed8;
        }
        .text-gray-900 {
          color: #111827;
        }
        .text-gray-700 {
          color: #374151;
        }
        .text-gray-600 {
          color: #4b5563;
        }
        .grid {
          display: grid;
        }
        .grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .gap-4 {
          gap: 1rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 0.75rem 0;
        }
        th {
          text-align: left;
          font-weight: 600;
        }
        .text-right {
          text-align: right;
        }
        .border-b {
          border-bottom: 1px solid #e5e7eb;
        }
        .border-b-2 {
          border-bottom: 2px solid #d1d5db;
        }
      </style>
    `

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Reçu de Paiement - ${payment.numeroRecu}</title>
          ${styles}
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    
    // Attendre le chargement puis imprimer
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  const handleDownload = () => {
    // Solution alternative : Utiliser l'impression vers PDF
    const printContent = document.getElementById('receipt-to-print')
    if (!printContent) {
      alert("Erreur : Contenu du reçu introuvable")
      return
    }

    // Créer une fenêtre pour "Sauvegarder en PDF"
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert("Veuillez autoriser les popups pour télécharger le PDF")
      return
    }

    // Styles CSS pour le PDF
    const styles = `
      <style>
        @page {
          size: A4;
          margin: 1.5cm;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #000;
        }
        * {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        button {
          display: none !important;
        }
        .text-center {
          text-align: center;
        }
        .flex {
          display: flex;
        }
        .flex-col {
          flex-direction: column;
        }
        .items-center {
          align-items: center;
        }
        .justify-center {
          justify-content: center;
        }
        .justify-between {
          justify-content: space-between;
        }
        .gap-3 {
          gap: 0.75rem;
        }
        .mb-4 {
          margin-bottom: 1rem;
        }
        .mb-6 {
          margin-bottom: 1.5rem;
        }
        .mt-2 {
          margin-top: 0.5rem;
        }
        .mt-4 {
          margin-top: 1rem;
        }
        .pb-6 {
          padding-bottom: 1.5rem;
        }
        .p-4 {
          padding: 1rem;
        }
        .border-b-2 {
          border-bottom: 2px solid #1f2937;
        }
        .border-gray-800 {
          border-color: #1f2937;
        }
        .bg-gray-50 {
          background-color: #f9fafb;
        }
        .rounded-lg {
          border-radius: 0.5rem;
        }
        .text-xl {
          font-size: 1.25rem;
          line-height: 1.75rem;
        }
        .text-3xl {
          font-size: 1.875rem;
          line-height: 2.25rem;
        }
        .font-bold {
          font-weight: 700;
        }
        .font-semibold {
          font-weight: 600;
        }
        .font-medium {
          font-weight: 500;
        }
        .text-blue-900 {
          color: #1e3a8a;
        }
        .text-blue-700 {
          color: #1d4ed8;
        }
        .text-gray-900 {
          color: #111827;
        }
        .text-gray-700 {
          color: #374151;
        }
        .text-gray-600 {
          color: #4b5563;
        }
        .grid {
          display: grid;
        }
        .grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .gap-4 {
          gap: 1rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 0.75rem 0;
        }
        th {
          text-align: left;
          font-weight: 600;
        }
        .text-right {
          text-align: right;
        }
        .border-b {
          border-bottom: 1px solid #e5e7eb;
        }
        .border-b-2 {
          border-bottom: 2px solid #d1d5db;
        }
      </style>
    `

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Reçu de Paiement - ${payment.numeroRecu}</title>
          ${styles}
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px; padding: 10px; background-color: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px;">
            <p style="margin: 0; color: #1e40af; font-weight: bold;">
              💡 Utilisez "Enregistrer en PDF" ou "Destination: Enregistrer au format PDF" dans le dialogue d'impression
            </p>
          </div>
          ${printContent.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    
    // Attendre le chargement puis ouvrir le dialogue d'impression
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        // Ne pas fermer automatiquement pour laisser l'utilisateur sauvegarder
      }, 250)
    }
  }

  const formatCurrency = (montant: number, devise: string) => {
    return `${montant.toLocaleString("fr-FR")} ${devise}`
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const numberToWords = (num: number, devise: string): string => {
    // Conversion simplifiée en lettres (français)
    const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"]
    const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"]
    const tens = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"]

    if (num === 0) return "zéro"
    if (num < 10) return units[num]
    if (num < 20) return teens[num - 10]
    if (num < 100) {
      const ten = Math.floor(num / 10)
      const unit = num % 10
      return `${tens[ten]}${unit > 0 ? `-${units[unit]}` : ""}`
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100)
      const rest = num % 100
      const hundredText = hundred === 1 ? "cent" : `${units[hundred]} cent`
      return `${hundredText}${rest > 0 ? ` ${numberToWords(rest, devise)}` : ""}`
    }
    if (num < 1000000) {
      const thousand = Math.floor(num / 1000)
      const rest = num % 1000
      const thousandText = thousand === 1 ? "mille" : `${numberToWords(thousand, devise)} mille`
      return `${thousandText}${rest > 0 ? ` ${numberToWords(rest, devise)}` : ""}`
    }
    return num.toString() // Pour les très grands nombres
  }

  const montantEnLettres = `${numberToWords(payment.montantPaye, payment.devise)} ${
    payment.devise === "CDF" ? "francs congolais" : "dollars américains"
  }`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reçu de Paiement</DialogTitle>
          <DialogDescription>
            Imprimez ou téléchargez ce reçu pour vos archives
          </DialogDescription>
        </DialogHeader>

        {/* Reçu à imprimer */}
        <div
          ref={receiptRef}
          className="bg-white p-8 border-2 border-gray-300 rounded-lg print:border-0"
          id="receipt-to-print"
        >
          {/* En-tête avec logo */}
          <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="w-32 h-32 flex items-center justify-center">
                <img
                  src={CHURCH_INFO.logo}
                  alt={CHURCH_INFO.logoAlt}
                  className="max-w-full max-h-full object-contain"
                  style={{ width: '128px', height: '128px' }}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900">{CHURCH_INFO.name}</h2>
                <p className="text-base text-blue-700">{CHURCH_INFO.ministry}</p>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">REÇU DE PAIEMENT</h1>
            <p className="text-sm text-gray-600 mt-2">{CHURCH_INFO.address}</p>
            {CHURCH_INFO.phone && <p className="text-sm text-gray-600">{CHURCH_INFO.phone}</p>}
          </div>

          {/* Numéro de reçu */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-600">Numéro de reçu</p>
              <p className="text-xl font-bold text-gray-900">{payment.numeroRecu}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date d'émission</p>
              <p className="text-lg font-semibold text-gray-900">
                {payment.datePaiement ? formatDate(payment.datePaiement) : "-"}
              </p>
            </div>
          </div>

          {/* Informations du payeur */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Reçu de:</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nom complet</p>
                <p className="text-base font-medium text-gray-900">{payment.participantNomComplet}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Numéro de paiement</p>
                <p className="text-base font-medium text-gray-900">{payment.numeroPaiement}</p>
              </div>
            </div>
          </div>

          {/* Détails du paiement */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Détails du paiement:</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 text-gray-700">Description</th>
                  <th className="text-right py-2 text-gray-700">Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-900">{activiteNom}</td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    {formatCurrency(payment.montantPaye, payment.devise)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-800">
                  <td className="py-3 text-lg font-bold text-gray-900">TOTAL PAYÉ</td>
                  <td className="py-3 text-right text-2xl font-bold text-gray-900">
                    {formatCurrency(payment.montantPaye, payment.devise)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Montant en lettres */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-1">Montant en toutes lettres:</p>
            <p className="text-base font-semibold text-gray-900 capitalize">{montantEnLettres}</p>
          </div>

          {/* Méthode de paiement */}
          {payment.methodePaiement && (
            <div className="mb-6">
              <p className="text-sm text-gray-600">Méthode de paiement:</p>
              <p className="text-base font-medium text-gray-900">
                {payment.methodePaiement === "cash"
                  ? "Espèces"
                  : payment.methodePaiement === "mobile_money"
                  ? "Mobile Money"
                  : payment.methodePaiement === "bank_transfer"
                  ? "Virement bancaire"
                  : payment.methodePaiement === "card"
                  ? "Carte bancaire"
                  : "Autre"}
              </p>
            </div>
          )}

          {/* Remarques */}
          {payment.remarque && (
            <div className="mb-6">
              <p className="text-sm text-gray-600">Remarques:</p>
              <p className="text-sm text-gray-700 italic">{payment.remarque}</p>
            </div>
          )}

          {/* Pied de page */}
          <div className="border-t-2 border-gray-300 pt-6 mt-8">
            <div className="flex justify-between items-end">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-8">Signature du payeur</p>
                <div className="border-t border-gray-400 w-48"></div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">{CHURCH_INFO.signature.title}</p>
                <p className="text-sm text-gray-600 mb-6">{CHURCH_INFO.signature.name || "_______________"}</p>
                <div className="border-t border-gray-400 w-48"></div>
              </div>
            </div>
          </div>

          {/* Note de bas de page */}
          <div className="text-center mt-6 text-xs text-gray-500">
            <p>Ce reçu fait foi de paiement. Merci de le conserver précieusement.</p>
            <p className="mt-1">{CHURCH_INFO.name} - {CHURCH_INFO.ministry}</p>
            <p className="mt-1">Document généré le {new Date().toLocaleString("fr-FR")}</p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 mt-4">
          <Button onClick={handlePrint} className="flex-1">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
        </div>
      </DialogContent>

      {/* Styles pour l'impression */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-to-print,
          #receipt-to-print * {
            visibility: visible;
          }
          #receipt-to-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </Dialog>
  )
}
