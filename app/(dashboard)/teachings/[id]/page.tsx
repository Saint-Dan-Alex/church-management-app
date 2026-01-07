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
  Printer, // Added Printer icon
} from "lucide-react"
import { EditTeachingDialog } from "@/components/teachings/edit-teaching-dialog"
import type { Teaching } from "@/types/teaching"
import { teachingsService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { ReportHeader } from "@/components/reports/report-header" // Added ReportHeader import

export default function TeachingDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { toast } = useToast()
  const { can } = useUser()
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

  const handlePrint = () => {
    window.print()
  }

  // (suppression de handleDownloadPDF et son énorme template string)


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
    <div className="min-w-0 w-full">
      {/* SECTION D'IMPRESSION (Visible uniquement à l'impression) */}
      <div className="hidden print:block space-y-6 text-black">
        <ReportHeader />

        <div className="text-center mb-8 border-b-2 border-black pb-4">
          <p className="text-sm text-gray-600 mb-1">Date : {formatDate(teaching.date_seance)}</p>
          <h1 className="text-2xl font-bold uppercase mb-1">{teaching.theme}</h1>
          {teaching.sous_theme && <h2 className="text-lg font-semibold italic mb-1">{teaching.sous_theme}</h2>}
          <h3 className="text-base font-medium">{teaching.sujet}</h3>
        </div>

        <div className="space-y-4">
          {teaching.textes_bibliques && (
            <p><strong>Textes bibliques :</strong> {teaching.textes_bibliques}</p>
          )}
          {teaching.but_pedagogique && (
            <p><strong>But pédagogique :</strong> {teaching.but_pedagogique}</p>
          )}

          {teaching.verset_retenir && (
            <div className="border border-black p-4 my-4 rounded bg-gray-50">
              <strong className="block mb-2">Verset à retenir (V.A.R) :</strong>
              <p className="italic">{teaching.verset_retenir}</p>
            </div>
          )}

          {teaching.chants && teaching.chants.length > 0 && (
            <div className="mt-4">
              <h4 className="font-bold border-b border-black mb-2 uppercase text-sm">Chants</h4>
              <ul className="list-disc pl-5 space-y-1">
                {teaching.chants.map((chant, i) => (
                  <li key={i}>
                    {chant.titre} {chant.numero && `(N° ${chant.numero})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(teaching.materiel_didactique || teaching.sujet_revision) && (
            <div className="mt-4">
              <h4 className="font-bold border-b border-black mb-2 uppercase text-sm">Préparation</h4>
              {teaching.materiel_didactique && (
                <p className="mb-1"><span className="underline">Matériel didactique (M/D)</span> : {teaching.materiel_didactique}</p>
              )}
              {teaching.sujet_revision && (
                <p><span className="underline">Sujet de révision (S/R)</span> : {teaching.sujet_revision}</p>
              )}
            </div>
          )}

          {(teaching.sensibilisation || teaching.questions_reponses || teaching.question_decouverte || teaching.reponse_decouverte) && (
            <div className="mt-4">
              <h4 className="font-bold border-b border-black mb-2 uppercase text-sm">Introduction</h4>
              {teaching.sensibilisation && <p className="mb-2"><span className="underline">Sensibilisation</span> : {teaching.sensibilisation}</p>}
              {teaching.questions_reponses && <p className="mb-2"><span className="underline">Questions/Réponses (Q.R)</span> : {teaching.questions_reponses}</p>}
              {teaching.question_decouverte && <p className="mb-2"><span className="underline">Question de découverte (Q.D)</span> : {teaching.question_decouverte}</p>}
              {teaching.reponse_decouverte && <p className="mb-2"><span className="underline">Réponse de découverte (R)</span> : {teaching.reponse_decouverte}</p>}
            </div>
          )}

          {teaching.type_contenu === 'points_developper' && teaching.points && (
            <div className="mt-6">
              <h4 className="font-bold border-b border-black mb-4 uppercase text-sm">Points à développer</h4>
              <div className="space-y-4">
                {teaching.points.map((point, index) => (
                  <div key={index}>
                    <p className="font-bold mb-1">{index + 1}. {point.titre}</p>
                    {point.sous_points && (
                      <ul className="list-disc pl-5">
                        {point.sous_points.map((sp, idx) => (
                          <li key={idx}>{sp.contenu}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {teaching.type_contenu === 'developpement' && teaching.evenements && (
            <div className="mt-6">
              <h4 className="font-bold border-b border-black mb-4 uppercase text-sm">Développement</h4>
              <div className="space-y-4">
                {teaching.evenements.map((evt, index) => (
                  <div key={index}>
                    <p className="font-bold mb-1">{index + 1}. {evt.titre}</p>
                    {evt.enseignements && (
                      <ul className="list-disc pl-5">
                        {evt.enseignements.map((ens, idx) => (
                          <li key={idx}>{ens.contenu}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {teaching.conclusion && (
            <div className="mt-6 border-t border-black pt-4">
              <h4 className="font-bold mb-2 uppercase text-sm">Conclusion</h4>
              <p>{teaching.conclusion}</p>
            </div>
          )}
        </div>
      </div>

      {/* INTERFACE ECRAN (Masquée à l'impression) */}
      <div className="space-y-4 sm:space-y-6 print:hidden">
        {/* Header responsive */}
        <div className="flex flex-col gap-4">
          {/* Ligne du haut : Bouton retour + Actions */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-1 sm:gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs sm:text-sm px-2 sm:px-3">
                <Printer className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Imprimer</span>
              </Button>
              {can("teachings.update") && (
                <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)} className="text-xs sm:text-sm px-2 sm:px-3">
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Modifier</span>
                </Button>
              )}
              {can("teachings.delete") && (
                <Button variant="destructive" size="sm" onClick={handleDelete} className="text-xs sm:text-sm px-2 sm:px-3">
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Supprimer</span>
                </Button>
              )}
            </div>
          </div>

          {/* Titre */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Détails de l'Enseignement</h1>
            <p className="text-sm sm:text-base text-gray-600">Informations complètes de la leçon</p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 min-w-0">
          {/* Colonne gauche - Infos principales */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6 min-w-0">
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
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
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
    </div>
  )
}
