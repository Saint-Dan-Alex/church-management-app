"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"
import { EditTeachingDialog } from "@/components/teachings/edit-teaching-dialog"
import type { Teaching } from "@/types/teaching"

// Données de test
const mockTeaching: Teaching = {
  id: "1",
  dateSeance: "2024-01-15",
  theme: "L'amour de Dieu",
  sousTheme: "La miséricorde divine",
  sujet: "Dieu nous aime inconditionnellement",
  textesBibliques: "Jean 3:16, 1 Jean 4:8-10, Romains 5:8",
  butPedagogique: "Faire comprendre aux enfants l'amour inconditionnel de Dieu et comment cet amour se manifeste dans leur vie quotidienne.",
  versetRetenir: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
  chants: [
    { id: "1", titre: "Jésus m'aime", numero: "45" },
    { id: "2", titre: "L'amour de Dieu est grand", numero: "78" },
    { id: "3", titre: "Dieu est amour", numero: "" },
  ],
  materielDidactique: "Images illustrant l'amour de Dieu, cartes avec versets, crayons de couleur",
  sujetRevision: "La création du monde et l'amour de Dieu pour l'humanité",
  sensibilisation: "Commencer par un chant joyeux sur l'amour de Dieu",
  questionsReponses: "Qu'est-ce que l'amour ? Comment savez-vous que quelqu'un vous aime ?",
  questionDecouverte: "Comment Dieu montre-t-il son amour pour nous ?",
  reponseDecouverte: "Dieu a montré son amour en envoyant Jésus pour nous sauver",
  typeContenu: "points_developper",
  pointsDevelopper: [
    {
      id: "1",
      titre: "L'amour de Dieu est inconditionnel",
      sousPoints: [
        { id: "1-1", contenu: "Il nous aime malgré nos erreurs" },
        { id: "1-2", contenu: "Son amour ne change jamais" },
        { id: "1-3", contenu: "Il nous aime avant même que nous l'aimions" },
      ],
    },
    {
      id: "2",
      titre: "L'amour de Dieu se manifeste par Jésus",
      sousPoints: [
        { id: "2-1", contenu: "Il a envoyé son Fils unique" },
        { id: "2-2", contenu: "Jésus est mort pour nos péchés" },
        { id: "2-3", contenu: "Il nous offre le salut gratuit" },
      ],
    },
    {
      id: "3",
      titre: "Comment répondre à l'amour de Dieu",
      sousPoints: [
        { id: "3-1", contenu: "Accepter Jésus dans notre cœur" },
        { id: "3-2", contenu: "Aimer Dieu en retour" },
        { id: "3-3", contenu: "Aimer les autres comme Dieu nous aime" },
      ],
    },
  ],
  conclusion: "L'amour de Dieu est le plus grand cadeau que nous puissions recevoir. Il nous aime tellement qu'il a donné son Fils unique pour nous. Notre réponse doit être d'accepter cet amour et de le partager avec les autres.",
}

export default function TeachingDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [teaching] = useState<Teaching>(mockTeaching)

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet enseignement ?")) {
      console.log("Suppression de l'enseignement:", teaching.id)
      router.push("/teachings")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Détails de l'Enseignement</h1>
            <p className="text-gray-600">Informations complètes de la leçon</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne gauche - Infos principales */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date de la séance</p>
                    <p className="text-base text-gray-900">{formatDate(teaching.dateSeance)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{teaching.theme}</h3>
                  {teaching.sousTheme && (
                    <p className="text-sm text-gray-600 mb-2">{teaching.sousTheme}</p>
                  )}
                  <p className="text-base text-gray-800 font-medium">{teaching.sujet}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Textes bibliques</p>
                  <p className="text-sm text-gray-900">{teaching.textesBibliques}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">But pédagogique</p>
                  <p className="text-sm text-gray-900">{teaching.butPedagogique}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verset à retenir */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <BookOpen className="h-5 w-5" />
                Verset à retenir (V.A.R)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-900 italic">{teaching.versetRetenir}</p>
            </CardContent>
          </Card>

          {/* Chants */}
          {teaching.chants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-blue-600" />
                  Chants ({teaching.chants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teaching.chants.map((chant, index) => (
                    <div
                      key={chant.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">{chant.titre}</span>
                      {chant.numero && (
                        <Badge variant="outline" className="text-xs">
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
        <div className="lg:col-span-2 space-y-6">
          {/* Matériel et Révision */}
          {(teaching.materielDidactique || teaching.sujetRevision) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Préparation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teaching.materielDidactique && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Matériel didactique (M/D)
                      </p>
                      <p className="text-sm text-gray-900">{teaching.materielDidactique}</p>
                    </div>
                  )}
                  {teaching.sujetRevision && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Sujet de révision (S/R)
                      </p>
                      <p className="text-sm text-gray-900">{teaching.sujetRevision}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Introduction */}
          {(teaching.sensibilisation ||
            teaching.questionsReponses ||
            teaching.questionDecouverte ||
            teaching.reponseDecouverte) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔍 Introduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teaching.sensibilisation && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Sensibilisation</p>
                      <p className="text-sm text-gray-900">{teaching.sensibilisation}</p>
                    </div>
                  )}
                  {teaching.questionsReponses && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Questions/Réponses (Q.R)
                      </p>
                      <p className="text-sm text-gray-900">{teaching.questionsReponses}</p>
                    </div>
                  )}
                  {teaching.questionDecouverte && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Question de découverte (Q.D)
                      </p>
                      <p className="text-sm text-gray-900">{teaching.questionDecouverte}</p>
                    </div>
                  )}
                  {teaching.reponseDecouverte && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Réponse de découverte (R)
                      </p>
                      <p className="text-sm text-gray-900">{teaching.reponseDecouverte}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Points à développer */}
          {teaching.typeContenu === "points_developper" && teaching.pointsDevelopper && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-blue-600" />
                  Points à développer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {teaching.pointsDevelopper.map((point, index) => (
                    <div key={point.id} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-blue-600 text-white mt-1">
                          {index + 1}
                        </Badge>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-3">{point.titre}</h4>
                          {point.sousPoints.length > 0 && (
                            <ul className="space-y-2 ml-4">
                              {point.sousPoints.map((sousPoint) => (
                                <li
                                  key={sousPoint.id}
                                  className="flex items-start gap-2 text-sm text-gray-700"
                                >
                                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{sousPoint.contenu}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      {index < teaching.pointsDevelopper!.length - 1 && (
                        <div className="border-t"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Développement avec événements */}
          {teaching.typeContenu === "developpement" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Développement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {teaching.developpement && (
                    <div>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {teaching.developpement}
                      </p>
                    </div>
                  )}

                  {teaching.evenements && teaching.evenements.length > 0 && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Événements et enseignements
                      </h4>
                      <div className="space-y-4">
                        {teaching.evenements.map((evenement, evtIndex) => (
                          <div key={evenement.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className="bg-green-600">{evtIndex + 1}</Badge>
                              <h5 className="font-medium text-gray-900">{evenement.titre}</h5>
                            </div>
                            {evenement.enseignements.length > 0 && (
                              <ul className="space-y-2 ml-8">
                                {evenement.enseignements.map((ens) => (
                                  <li key={ens.id} className="text-sm text-gray-700">
                                    • {ens.contenu}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conclusion */}
          {teaching.conclusion && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <CheckCircle2 className="h-5 w-5" />
                  Conclusion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-900 whitespace-pre-wrap">
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
      />
    </div>
  )
}
