// Utilitaire pour générer des PDFs à partir de composants HTML

/**
 * Génère un PDF à partir d'un élément HTML
 * Utilise la méthode window.print() avec des styles CSS spécifiques
 */
export function generatePDFFromElement(elementId: string, filename: string = "rapport.pdf") {
  const element = document.getElementById(elementId)
  
  if (!element) {
    console.error(`Element with id "${elementId}" not found`)
    return
  }

  // Cloner l'élément pour ne pas affecter l'original
  const clone = element.cloneNode(true) as HTMLElement
  
  // Créer un conteneur temporaire pour l'impression
  const printWindow = window.open("", "_blank")
  
  if (!printWindow) {
    alert("Veuillez autoriser les popups pour imprimer le rapport")
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
      
      .no-print {
        display: none !important;
      }
      
      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
      }
      
      table, figure {
        page-break-inside: avoid;
      }
      
      .page-break {
        page-break-after: always;
      }
      
      @media print {
        body {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
      }
    </style>
  `

  // Construire le document HTML
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${filename}</title>
        ${styles}
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body>
        ${clone.innerHTML}
      </body>
    </html>
  `)

  printWindow.document.close()
  
  // Attendre que le contenu soit chargé
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}

/**
 * Alternative : Utilise jsPDF avec html2canvas pour générer un vrai PDF téléchargeable
 * Nécessite les packages : npm install jspdf html2canvas
 */
export async function generatePDFDownload(
  elementId: string,
  filename: string = "rapport.pdf"
): Promise<void> {
  try {
    // Vérifier si les packages sont disponibles
    const jsPDF = (await import("jspdf")).default
    const html2canvas = (await import("html2canvas")).default

    const element = document.getElementById(elementId)
    
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    // Cacher temporairement les boutons
    const buttons = element.querySelectorAll("button")
    buttons.forEach((btn) => {
      ;(btn as HTMLElement).style.display = "none"
    })

    // Capturer l'élément en canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    // Restaurer les boutons
    buttons.forEach((btn) => {
      ;(btn as HTMLElement).style.display = ""
    })

    // Calculer les dimensions pour A4
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    const pdf = new jsPDF("p", "mm", "a4")
    let position = 0

    // Ajouter l'image au PDF
    const imgData = canvas.toDataURL("image/png")
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Ajouter des pages supplémentaires si nécessaire
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Télécharger le PDF
    pdf.save(filename)
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error)
    
    // Fallback vers la méthode d'impression
    console.log("Fallback vers la méthode d'impression...")
    generatePDFFromElement(elementId, filename)
  }
}

/**
 * Formate le nom de fichier pour le PDF
 */
export function formatPDFFilename(
  prefix: string,
  title: string,
  date?: Date | string
): string {
  const dateStr = date
    ? new Date(date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0]
  
  const titleSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
    .replace(/[^a-z0-9]+/g, "-") // Remplacer les caractères spéciaux
    .replace(/^-+|-+$/g, "") // Enlever les tirets au début/fin
  
  return `${prefix}_${titleSlug}_${dateStr}.pdf`
}
