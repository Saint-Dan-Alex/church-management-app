import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  return (
    <section className="py-24 px-4 bg-slate-900 overflow-hidden relative">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl z-0" />

      <div className="container mx-auto max-w-6xl relative z-10 space-y-24">

        {/* VISION & MISSION */}
        <div id="vision" className="scroll-mt-24">
          <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-16 uppercase tracking-tight">Notre Vision & Mission</h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
              <p>
                Le Centre Evangelique Arche de l'Alliance est un ministère dédié aux enfants et adolescents. Nous croyons
                en une communauté authentique, bienveillante et engagée dans la transformation spirituelle des jeunes
                générations.
              </p>
              <p>
                Nous sommes une église pentecôtiste qui croit au pouvoir du Saint-Esprit et à la manifestation de ses dons
                dans nos vies. Notre vision est de former des disciples engagés qui connaissent Jésus-Christ
                personnellement.
              </p>
            </div>

            <Card className="bg-slate-800/80 border-amber-600/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">Piliers de notre Mission</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5" />
                    <span className="text-slate-300">Proclamer l'Évangile de Jésus-Christ</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5" />
                    <span className="text-slate-300">Former des disciples enracinés dans la foi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5" />
                    <span className="text-slate-300">Servir notre communauté avec compassion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5" />
                    <span className="text-slate-300">Cultiver une adoration authentique</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* HISTOIRE */}
        <div id="histoire" className="scroll-mt-24 border-t border-slate-800 pt-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">Notre Histoire</h3>
            <p className="text-slate-400 leading-relaxed">
              Fondée avec la vision de bâtir un refuge pour les âmes assoiffées, l'Arche de l'Alliance a commencé comme un petit groupe de prière.
              Au fil des années, Dieu a fidèlement béni cette œuvre, la faisant grandir pour devenir une communauté vibrante qui impacte aujourd'hui des centaines de vies.
              Notre histoire est celle de la fidélité de Dieu et de la passion d'hommes et de femmes dévoués à Sa cause.
            </p>
          </div>
        </div>

        {/* PASTEUR */}
        <div id="pasteur" className="scroll-mt-24 border-t border-slate-800 pt-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative h-[400px] w-full bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Placeholder pour photo pasteur */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
              <div className="absolute bottom-6 left-6 z-20">
                <h4 className="text-2xl font-bold text-white">Pasteur Principal</h4>
                <p className="text-amber-500 font-medium">Serviteur de Dieu</p>
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3 className="text-3xl font-bold text-white uppercase tracking-tight">Le Pasteur</h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                Notre église est conduite par un homme de vision, passionné par l'enseignement de la Parole et le salut des âmes.
                Avec un cœur de berger, il guide l'assemblée dans la vérité biblique, encourageant chacun à développer une relation intime avec Dieu
                et à découvrir son appel.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Son ministère est marqué par un fort accent sur la prière, la famille et l'intégrité chrétienne.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
