import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Heart, Handshake, Baby, Flower2 } from "lucide-react"

const commissions = [
    {
        id: "evangelisation",
        title: "Évangélisation",
        description: "Proclamer la bonne nouvelle et gagner des âmes pour Christ.",
        icon: Users,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        id: "accueil",
        title: "Accueil & Protocole",
        description: "Recevoir chaque visiteur comme un invité d'honneur dans la maison du Seigneur.",
        icon: Handshake,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
    },
    {
        id: "social",
        title: "Social & Compassion",
        description: "Manifester l'amour de Dieu par des actes concrets envers les nécessiteux.",
        icon: Heart,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
    },
    {
        id: "jeunesse",
        title: "Jeunesse",
        description: "Encadrer et dynamiser la jeunesse pour qu'elle soit une force pour le Royaume.",
        icon: Baby,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
    },
    {
        id: "femmes",
        title: "Femmes",
        description: "Équiper les femmes pour qu'elles soient des piliers dans l'église et la famille.",
        icon: Flower2,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
]

export function CommissionsSection() {
    return (
        <section className="py-24 px-4 bg-slate-950">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">Nos Commissions</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Découvrez les différents départements où vous pouvez servir et vous épanouir.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {commissions.map((item) => (
                        <div key={item.id} id={item.id} className="scroll-mt-24">
                            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 h-full">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-4`}>
                                        <item.icon className={`h-6 w-6 ${item.color}`} />
                                    </div>
                                    <CardTitle className="text-xl font-bold text-white">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-slate-400 text-base">
                                        {item.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
