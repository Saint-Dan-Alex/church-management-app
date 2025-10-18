"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Printer } from "lucide-react"
import QRCode from "qrcode"

interface QRCodeDialogProps {
  monitorId: string | null
  onOpenChange: () => void
}

export function QRCodeDialog({ monitorId, onOpenChange }: QRCodeDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (monitorId && canvasRef.current) {
      const qrData = JSON.stringify({
        type: "monitor_attendance",
        monitorId: monitorId,
        timestamp: Date.now(),
      })

      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
    }
  }, [monitorId])

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `qr-code-monitor-${monitorId}.png`
      link.href = url
      link.click()
    }
  }

  const handlePrint = () => {
    if (canvasRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        const url = canvasRef.current.toDataURL("image/png")
        printWindow.document.write(`
          <html>
            <head>
              <title>QR Code - Moniteur ${monitorId}</title>
              <style>
                body { 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  height: 100vh; 
                  margin: 0;
                  flex-direction: column;
                  font-family: sans-serif;
                }
                img { max-width: 400px; }
                h2 { margin-bottom: 20px; }
              </style>
            </head>
            <body>
              <h2>QR Code de Pointage</h2>
              <img src="${url}" />
              <p>Moniteur ID: ${monitorId}</p>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  return (
    <Dialog open={!!monitorId} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>QR Code de Pointage</DialogTitle>
          <DialogDescription>Scannez ce code pour enregistrer la présence du moniteur</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="rounded-lg border p-4 bg-white">
            <canvas ref={canvasRef} />
          </div>
          <p className="text-sm text-muted-foreground">Moniteur ID: {monitorId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
