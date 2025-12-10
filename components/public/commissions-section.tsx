```
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Users, Heart, Handshake, Baby, Flower2, Music, Mic2, Tv, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react"

const commissions = [
  {
    id: "intercession",
    title: "Commission d'Intercession",
    shortDesc: "Une sentinelle qui veille et prie avec insistance pour l'œuvre de Dieu.",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    details: {
      definition: "L’intercession est une détermination intérieure de prier Dieu avec insistance pour quelqu’un ou quelque chose jusqu’à l’accomplissement. L'intercesseur est une sentinelle, un assistant (paraclet) qui veille.",
      mission: [
        "Prier pour l’action du Saint Esprit au sein de l’Eglise.",
        "Prier pour détruire les forteresses et l’orgueil dans les cœurs.",
        "Combattre dans la prière les actions de l’ennemi.",
        "Prier pour le réveil spirituel et le maintien de la flamme au sein du Ministère."
      ],
      roles: [
        "Veiller et surveiller pour épargner l'église de tout mal.",
        "Prier pour la vie de l’Eglise et de tous les serviteurs.",
        "Veiller à la bonne santé spirituelle de l’église.",
        "Prier pour le salut des âmes.",
        "Ecouter la pensée de Dieu et la transmettre à son peuple."
      ],
      conditions: [
        "Accepter Jésus Christ comme Seigneur et sauveur.",
        "Avoir la vie de prière et de méditation personnelle.",
        "Etre disponible, humble et respectueux.",
        "Jouir d’un bon témoignage.",
        "Aspirer au baptême dans le Saint Esprit."
      ],
      dispositions: [
        "Réunion de prière chaque samedi.",
        "Mise en place d’une chaudière pendant les activités.",
        "Prière personnelle chaque nuit de samedi à dimanche (30 min).",
        "Répartition stratégique les dimanches selon la pensée du culte."
      ]
    }
  },
  {
    id: "accueil",
    title: "Protocole & Accueil",
    shortDesc: "Recevoir dignement les fidèles et offrir l'hospitalité dans la maison du Seigneur.",
    icon: Handshake,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    details: {
      definition: "Le service d’accueil est destiné à recevoir dignement les fidèles en leur offrant l’hospitalité qui leur est due.",
      mission: [
        "Servir le Seigneur en impactant notre génération.",
        "Aider les membres à extérioriser leurs talents par la mise en ordre et la gestion des lieux d’activités."
      ],
      roles: [
        "Recevoir et accueillir les fidèles en leur procurant le confort nécessaire.",
        "Classer les fidèles avec ordre dans la salle.",
        "Assurer la propreté et nettoyer les sièges.",
        "Veiller aux déplacements dans la salle."
      ],
      conditions: [
        "Accepter Jésus Christ comme Seigneur et sauveur.",
        "Avoir l’amour et le fardeau du service.",
        "Etre disponible, humble, souriant et respectueux.",
        "Jouir d’un bon témoignage.",
        "Aspirer au baptême dans le Saint Esprit."
      ],
      dispositions: [
        "Port obligatoire de l’uniforme et tenue décente.",
        "Préparer son service et veiller à la propreté.",
        "Etre joyeux et ne pas s'énerver pendant le service."
      ]
    }
  },
  {
    id: "evangelisation",
    title: "Conseil, Suivi & Évangélisation",
    shortDesc: "Apporter la bonne nouvelle, gagner des âmes et fortifier les frères et sœurs.",
    icon: Heart,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    details: {
      definition: "Commission consistant à apporter la bonne nouvelle de JÉSUS, encourager et fortifier les frères et sœurs pour qu'ils soient des ambassadeurs de Christ.",
      mission: [
        "Gagner des âmes à Christ.",
        "Former les âmes pour qu'elles deviennent des disciples accomplis capables d'évangéliser à leur tour."
      ],
      roles: [
        "Gagner des âmes par l'évangile.",
        "Suivre et soutenir les âmes gagnées.",
        "Encadrer et participer aux descentes évangéliques.",
        "Accueillir et conseiller les nouveaux venus."
      ],
      conditions: [
        "Accepter Jésus Christ comme Seigneur et sauveur.",
        "Avoir la vie de prière et de méditation.",
        "Etre disponible, humble et respectueux.",
        "Jouir d’un bon témoignage."
      ],
      dispositions: [
        "Apporter la bonne nouvelle et visiter les frères en semaine.",
        "Suivre l'évolution spirituelle des âmes.",
        "Accueillir les nouveaux venus le dimanche et prendre leurs coordonnées."
      ]
    }
  },
  {
    id: "louange",
    title: "Louange & Adoration",
    shortDesc: "Conduire le peuple de Dieu dans la présence du Seigneur par le chant.",
    icon: Mic2,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    details: {
      definition: "La chorale est chargée de conduire le peuple de Dieu dans la louange et l'adoration.",
      mission: [
        "Conduire le peuple par les chants pour donner gloire au Seigneur JÉSUS-CHRIST."
      ],
      roles: [
        "Conduite du culte.",
        "Évangéliser, édifier et exhorter par des chants.",
        "Amener les cœurs dans la présence de Dieu et attirer sa gloire (2 Chroniques 5:11-14)."
      ],
      conditions: [
        "Accepter Jésus Christ comme Seigneur et sauveur.",
        "Avoir la vie de prière et de méditation.",
        "Suivre une formation spécifique (solfège, conduite, instruments).",
        "Etre humble, poli et soumis aux responsables."
      ],
      dispositions: [
        "Répétitions chaque samedi et sessions spéciales pour activités.",
        "Participation à l'intercession du matin le dimanche.",
        "Mise en voix obligatoire."
      ]
    }
  },
  {
    id: "danse",
    title: "Danse & Chorégraphie",
    shortDesc: "Exprimer la gloire de Dieu et évangéliser par le mouvement et la chorégraphie.",
    icon: Flower2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    details: {
      definition: "Exprimer les sentiments par les gestes au rythme d’une mélodie pour communiquer la pensée de Dieu et édifier l'église.",
      mission: [
        "Édifier, évangéliser et ramener les âmes perdues par le moyen des chorégraphies musicales."
      ],
      roles: [
        "Louer et adorer le Seigneur JÉSUS (Psaumes 150:1-6).",
        "Communiquer la pensée et les messages de Dieu par des pas de danse."
      ],
      conditions: [
        "Accepter Jésus Christ comme Seigneur et sauveur.",
        "Etre apte pour réaliser des mouvements de danse.",
        "Suivre une formation spécifique sur la danse.",
        "Avoir une vie de prière."
      ],
      dispositions: [
        "Répétitions chaque samedi.",
        "Pas de danse inspirés de Dieu, sains et harmonieux (pas de style profane).",
        "Tenues correctes et décentes exigées."
      ]
    }
  },
  {
    id: "medias",
    title: "Logistique & Médias",
    shortDesc: "Assurer l'aménagement technique et la couverture médiatique des événements.",
    icon: Tv,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    details: {
      definition: "Logistique : mise en œuvre des moyens techniques et matériels. Médias : diffusion de l'information (photos, vidéos, projection).",
      mission: [
        "Aménager les lieux de cultes pour faciliter le service.",
        "Rendre disponible les matériels (sonores, visuels, chaises)."
      ],
      roles: [
        "Transporter et installer le matériel (chaises, instruments).",
        "Aménager le temple avant le service.",
        "Couvrir les activités par les moyens de communication (photos, vidéos, projection).",
        "Veiller au bon usage du matériel."
      ],
      conditions: [
        "Accepter Jésus Christ comme Seigneur et sauveur.",
        "Etre disponible, humble et respectueux.",
        "Aimer le service pratique.",
        "Etre ponctuel (arriver le premier, partir le dernier)."
      ],
      dispositions: [
        "Avant le culte : essuyer et classer les chaises, arranger la salle.",
        "Pendant le culte : assurer le placement et la technique.",
        "Après le culte : ranger le matériel et nettoyer."
      ]
    }
  },
]

export function CommissionsSection() {
  return (
    <section id="commissions" className="py-24 px-4 bg-slate-950">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">Nos Commissions</h2>
            <div className="h-1 w-20 bg-amber-500 rounded-full mx-auto"></div>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Découvrez les différents départements de l'Arche de l'Alliance où vous pouvez servir Dieu, développer vos talents et impacter des vies.
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {commissions.map((item) => (
            <Dialog key={item.id}>
                <DialogTrigger asChild>
                    <div id={item.id} className="scroll-mt-32 cursor-pointer group h-full">
                        <Card className="bg-slate-900 border-slate-800 hover:border-amber-600/50 transition-all hover:-translate-y-2 h-full flex flex-col items-start text-left relative overflow-hidden">
                             {/* Effet de lueur au hover */}
                             <div className={`absolute top - 0 right - 0 w - 32 h - 32 ${ item.bgColor } blur - 3xl rounded - full - mr - 16 - mt - 16 opacity - 0 group - hover: opacity - 50 transition - opacity`} />
                            
                            <CardHeader className="relative z-10 w-full">
                                <div className={`w - 14 h - 14 rounded - xl ${ item.bgColor } flex items - center justify - center mb - 6 group - hover: scale - 110 transition - transform duration - 300`}>
                                    <item.icon className={`h - 7 w - 7 ${ item.color } `} />
                                </div>
                                <CardTitle className="text-2xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                                    {item.title}
                                </CardTitle>
                                <CardDescription className="text-slate-400 text-base leading-relaxed">
                                    {item.shortDesc}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto pt-0 relative z-10 w-full">
                                <div className="flex items-center text-sm font-bold text-amber-600 uppercase tracking-widest gap-2 group-hover:gap-3 transition-all">
                                    En savoir plus <ArrowRight className="h-4 w-4" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DialogTrigger>
                
                <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="p-8 pb-4 bg-slate-900/50 border-b border-slate-800">
                        <div className="flex items-center gap-4 mb-2">
                             <div className={`w - 10 h - 10 rounded - lg ${ item.bgColor } flex items - center justify - center`}>
                                <item.icon className={`h - 5 w - 5 ${ item.color } `} />
                            </div>
                            <DialogTitle className="text-2xl md:text-3xl font-bold uppercase tracking-tight">{item.title}</DialogTitle>
                        </div>
                        <DialogDescription className="text-slate-400 text-lg">
                            {item.details.definition}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <ScrollArea className="flex-1 p-8 pt-6">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Mission */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-amber-500 uppercase tracking-wide">
                                    <BookOpen className="h-5 w-5" /> Mission
                                </h4>
                                <ul className="space-y-3">
                                    {item.details.mission.map((m, i) => (
                                        <li key={i} className="flex items-start gap-3 group">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2.5 group-hover:bg-amber-500 transition-colors" />
                                            <span className="text-slate-300 leading-relaxed">{m}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                             {/* Rôles */}
                             <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-blue-500 uppercase tracking-wide">
                                    <CheckCircle2 className="h-5 w-5" /> Rôles
                                </h4>
                                <ul className="space-y-3">
                                    {item.details.roles.map((r, i) => (
                                        <li key={i} className="flex items-start gap-3 group">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2.5 group-hover:bg-blue-500 transition-colors" />
                                            <span className="text-slate-300 leading-relaxed">{r}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Conditions */}
                            <div className="space-y-4 pt-4 border-t border-slate-800/50 md:border-none md:pt-0">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-emerald-500 uppercase tracking-wide">
                                    <CheckCircle2 className="h-5 w-5" /> Conditions d'Adhésion
                                </h4>
                                <ul className="space-y-3">
                                    {item.details.conditions.map((c, i) => (
                                        <li key={i} className="flex items-start gap-3 group">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2.5 group-hover:bg-emerald-500 transition-colors" />
                                            <span className="text-slate-300 leading-relaxed">{c}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                             {/* Dispositions */}
                             <div className="space-y-4 pt-4 border-t border-slate-800/50 md:border-none md:pt-0">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-purple-500 uppercase tracking-wide">
                                    <CheckCircle2 className="h-5 w-5" /> Dispositions Pratiques
                                </h4>
                                <ul className="space-y-3">
                                    {item.details.dispositions.map((d, i) => (
                                        <li key={i} className="flex items-start gap-3 group">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2.5 group-hover:bg-purple-500 transition-colors" />
                                            <span className="text-slate-300 leading-relaxed">{d}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </ScrollArea>
                    
                    <div className="p-6 bg-slate-900 border-t border-slate-800 flex justify-end">
                        <Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold">
                            Rejoindre cette commission
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  )
}
```
