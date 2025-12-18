"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  BookOpen,
  Music,
  FileText,
  List,
  CheckCircle2,
  Download,
  Loader2,
} from "lucide-react"
import { EditTeachingDialog } from "@/components/teachings/edit-teaching-dialog"
import type { Teaching } from "@/types/teaching"
import { teachingsService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

export default function TeachingDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { toast } = useToast()
  const [teaching, setTeaching] = useState<Teaching | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    if (id) {
      loadTeaching()
    }
  }, [id])

  const loadTeaching = async () => {
    try {
      setLoading(true)
      const data = await teachingsService.getById(id)
      setTeaching(data)
    } catch (error) {
      console.error("Erreur lors du chargement de l'enseignement:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de l'enseignement.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet enseignement ?")) {
      try {
        await teachingsService.delete(id)
        toast({
          title: "Succès",
          description: "Enseignement supprimé avec succès.",
        })
        router.push("/teachings")
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'enseignement.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdate = async (updatedTeaching: Teaching) => {
    try {
      await teachingsService.update(updatedTeaching.id, updatedTeaching)
      setTeaching(updatedTeaching)
      toast({
        title: "Succès",
        description: "Enseignement mis à jour avec succès.",
      })
      loadTeaching() // Recharger pour être sûr d'avoir les données fraîches
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'enseignement.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDownloadPDF = () => {
    if (!teaching) return
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) return

    // Générer le contenu HTML pour le PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Enseignement - ${teaching.theme}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            h1 { color: #1e40af; font-size: 28px; margin-bottom: 10px; }
            h2 { color: #2563eb; font-size: 20px; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
            h3 { color: #1e40af; font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
            h4 { color: #374151; font-size: 16px; margin-top: 15px; margin-bottom: 8px; }
            p { margin-bottom: 10px; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; }
            .date { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
            .subtitle { color: #6b7280; font-size: 16px; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .var-box { background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; font-style: italic; }
            .chant-list { list-style: none; }
            .chant-item { padding: 8px; background: #f9fafb; margin-bottom: 5px; border-radius: 4px; }
            .point { margin-bottom: 20px; padding-left: 20px; }
            .point-title { font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            .sous-point { padding-left: 20px; margin-bottom: 8px; display: flex; align-items: start; }
            .sous-point:before { content: "✓"; color: #10b981; margin-right: 8px; font-weight: bold; }
            .conclusion-box { background: #d1fae5; border: 2px solid #10b981; padding: 20px; margin-top: 30px; border-radius: 8px; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="date">📅 ${formatDate(teaching.date_seance)}</div>
            <h1>${teaching.theme}</h1>
            ${teaching.sous_theme ? `<div class="subtitle">${teaching.sous_theme}</div>` : ''}
            <h3>${teaching.sujet}</h3>
          </div>

          <div class="section">
            <p><strong>Textes bibliques :</strong> ${teaching.textes_bibliques}</p>
            <p><strong>But pédagogique :</strong> ${teaching.but_pedagogique}</p>
          </div>

          <div class="var-box">
            <strong>📖 Verset à retenir (V.A.R) :</strong><br>
            ${teaching.verset_retenir}
          </div>

          ${teaching.chants && teaching.chants.length > 0 ? `
            <div class="section">
              <h2>🎶 Chants</h2>
              <ul class="chant-list">
                ${teaching.chants.map(chant => `
                  <li class="chant-item">
                    ${chant.titre}${chant.numero ? ` (N° ${chant.numero})` : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          ${teaching.materiel_didactique || teaching.sujet_revision ? `
            <div class="section">
              <h2>📝 Préparation</h2>
              ${teaching.materiel_didactique ? `
                <div>
                  <h4>Matériel didactique (M/D) :</h4>
                  <p>${teaching.materiel_didactique}</p>
                </div>
              ` : ''}
              ${teaching.sujet_revision ? `
                <div>
                  <h4>Sujet de révision (S/R) :</h4>
                  <p>${teaching.sujet_revision}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}

          ${teaching.sensibilisation || teaching.questions_reponses || teaching.question_decouverte || teaching.reponse_decouverte ? `
            <div class="section">
              <h2>🔍 Introduction</h2>
              ${teaching.sensibilisation ? `<div><h4>Sensibilisation :</h4><p>${teaching.sensibilisation}</p></div>` : ''}
              ${teaching.questions_reponses ? `<div><h4>Questions/Réponses (Q.R) :</h4><p>${teaching.questions_reponses}</p></div>` : ''}
              ${teaching.question_decouverte ? `<div><h4>Question de découverte (Q.D) :</h4><p>${teaching.question_decouverte}</p></div>` : ''}
              ${teaching.reponse_decouverte ? `<div><h4>Réponse de découverte (R) :</h4><p>${teaching.reponse_decouverte}</p></div>` : ''}
            </div>
          ` : ''}

          ${teaching.type_contenu === 'points_developper' && teaching.points ? `
            <div class="section">
              <h2>📚 Points à développer</h2>
              ${teaching.points.map((point, index) => `
                <div class="point">
                  <div class="point-title">${index + 1}. ${point.titre}</div>
                  ${point.sous_points.map(sp => `
                    <div class="sous-point">${sp.contenu}</div>
                  `).join('')}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${teaching.type_contenu === 'developpement' && teaching.evenements ? `
            <div class="section">
              <h2>📚 Développement</h2>
              ${teaching.evenements.map((evt, index) => `
                <div class="point">
                  <div class="point-title">${index + 1}. ${evt.titre}</div>
                  ${evt.enseignements.map(ens => `
                    <div class="sous-point">${ens.contenu}</div>
                  `).join('')}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${teaching.conclusion ? `
            <div class="conclusion-box">
              <h2>✅ Conclusion</h2>
              <p>${teaching.conclusion}</p>
            </div>
          ` : ''}
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Attendre que le contenu soit chargé avant d'imprimer
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!teaching) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Enseignement non trouvé</p>
        <Button onClick={() => router.push("/teachings")} variant="outline">
          Retour à la liste
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header responsive */}
      <div className="flex flex-col gap-4">
        {/* Ligne du haut : Bouton retour + Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-1 sm:gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs sm:text-sm px-2 sm:px-3">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Télécharger</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)} className="text-xs sm:text-sm px-2 sm:px-3">
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Modifier</span>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} className="text-xs sm:text-sm px-2 sm:px-3">
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Supprimer</span>
            </Button>
          </div>
        </div>

        {/* Titre */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Détails de l'Enseignement</h1>
          <p className="text-sm sm:text-base text-gray-600">Informations complètes de la leçon</p>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Colonne gauche - Infos principales */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <Card className="shadow-sm">
            <CardContent className="pt-4 sm:pt-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Date de la séance</p>
                    <p className="text-sm sm:text-base text-gray-900 break-words">{formatDate(teaching.date_seance)}</p>
                  </div>
                </div>

                <div className="border-t pt-3 sm:pt-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{teaching.theme}</h3>
                  {teaching.sous_theme && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{teaching.sous_theme}</p>
                  )}
                  <p className="text-sm sm:text-base text-gray-800 font-medium">{teaching.sujet}</p>
                </div>

                <div className="border-t pt-3 sm:pt-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Textes bibliques</p>
                  <p className="text-xs sm:text-sm text-gray-900">{teaching.textes_bibliques}</p>
                </div>

                <div className="border-t pt-3 sm:pt-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">But pédagogique</p>
                  <p className="text-xs sm:text-sm text-gray-900">{teaching.but_pedagogique}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verset à retenir */}
          <Card className="border-blue-200 bg-blue-50 shadow-sm">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-blue-900 text-sm sm:text-base">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                Verset à retenir (V.A.R)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-blue-900 italic">{teaching.verset_retenir}</p>
            </CardContent>
          </Card>

          {/* Chants */}
          {teaching.chants && teaching.chants.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Music className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Chants ({teaching.chants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teaching.chants.map((chant, index) => (
                    <div
                      key={chant.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded gap-2"
                    >
                      <span className="text-xs sm:text-sm text-gray-900 truncate">{chant.titre}</span>
                      {chant.numero && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          N° {chant.numero}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne droite - Contenu détaillé */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Matériel et Révision */}
          {(teaching.materiel_didactique || teaching.sujet_revision) && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Préparation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {teaching.materiel_didactique && (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                        Matériel didactique (M/D)
                      </p>
                      <p className="text-xs sm:text-sm text-gray-900">{teaching.materiel_didactique}</p>
                    </div>
                  )}
                  {teaching.sujet_revision && (
                    <div className="border-t pt-3 sm:pt-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                        Sujet de révision (S/R)
                      </p>
                      <p className="text-xs sm:text-sm text-gray-900">{teaching.sujet_revision}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Introduction */}
          {(teaching.sensibilisation ||
            teaching.questions_reponses ||
            teaching.question_decouverte ||
            teaching.reponse_decouverte) && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    🔍 Introduction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {teaching.sensibilisation && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Sensibilisation</p>
                        <p className="text-xs sm:text-sm text-gray-900">{teaching.sensibilisation}</p>
                      </div>
                    )}
                    {teaching.questions_reponses && (
                      <div className="border-t pt-3 sm:pt-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                          Questions/Réponses (Q.R)
                        </p>
                        <p className="text-xs sm:text-sm text-gray-900">{teaching.questions_reponses}</p>
                      </div>
                    )}
                    {teaching.question_decouverte && (
                      <div className="border-t pt-3 sm:pt-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                          Question de découverte (Q.D)
                        </p>
                        <p className="text-xs sm:text-sm text-gray-900">{teaching.question_decouverte}</p>
                      </div>
                    )}
                    {teaching.reponse_decouverte && (
                      <div className="border-t pt-3 sm:pt-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                          Réponse de découverte (R)
                        </p>
                        <p className="text-xs sm:text-sm text-gray-900">{teaching.reponse_decouverte}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Points à développer */}
          {teaching.type_contenu === "points_developper" && teaching.points && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <List className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Points à développer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  {teaching.points.map((point, index) => (
                    <div key={point.id} className="space-y-2 sm:space-y-3">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Badge className="bg-blue-600 text-white mt-0.5 sm:mt-1 text-xs">
                          {index + 1}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">{point.titre}</h4>
                          {point.sous_points && point.sous_points.length > 0 && (
                            <ul className="space-y-1 sm:space-y-2 ml-2 sm:ml-4">
                              {point.sous_points.map((sousPoint) => (
                                <li
                                  key={sousPoint.id}
                                  className="flex items-start gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700"
                                >
                                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{sousPoint.contenu}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      {index < (teaching.points?.length || 0) - 1 && (
                        <div className="border-t"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Développement */}
          {teaching.type_contenu === "developpement" && teaching.evenements && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <List className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Développement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  {teaching.evenements.map((evenement, index) => (
                    <div key={evenement.id} className="space-y-2 sm:space-y-3">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Badge className="bg-green-600 text-white mt-0.5 sm:mt-1 text-xs">
                          {index + 1}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">{evenement.titre}</h4>
                          {evenement.enseignements && evenement.enseignements.length > 0 && (
                            <ul className="space-y-1 sm:space-y-2 ml-2 sm:ml-4">
                              {evenement.enseignements.map((enseignement) => (
                                <li
                                  key={enseignement.id}
                                  className="flex items-start gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700"
                                >
                                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{enseignement.contenu}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      {index < (teaching.evenements?.length || 0) - 1 && (
                        <div className="border-t"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conclusion */}
          {teaching.conclusion && (
            <Card className="border-green-200 bg-green-50 shadow-sm">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-green-900 text-sm sm:text-base">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Conclusion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-green-900 whitespace-pre-wrap">
                  {teaching.conclusion}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <EditTeachingDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        teaching={teaching}
        onSave={handleUpdate}
      />
    </div>
  )
}
