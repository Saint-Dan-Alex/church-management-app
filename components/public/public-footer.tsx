import { Church, Mail, Phone, MapPin, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PublicFooter() {
  return (
    <footer id="contact" className="bg-slate-950 border-t border-amber-600/30 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Church className="h-8 w-8 text-amber-500" />
              <div>
                <span className="text-lg font-bold text-white block">Centre Evangelique Arche de l'Alliance</span>
                <span className="text-xs text-amber-400">Ministère auprès des Enfants & Adolescents</span>
              </div>
            </div>
            <p className="text-slate-400 mb-4">
              Une communauté de foi vivante, engagée à transformer des vies par l'amour de Christ et la puissance du
              Saint-Esprit.
            </p>
            <p className="text-sm text-slate-500">Gloire à Dieu pour toutes ses bénédictions</p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-amber-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/blog-public" className="text-slate-400 hover:text-amber-400 transition-colors">
                  Messages
                </Link>
              </li>
              <li>
                <Link href="/videos-public" className="text-slate-400 hover:text-amber-400 transition-colors">
                  Vidéothèque
                </Link>
              </li>
              <li>
                <Link href="/gallery-public" className="text-slate-400 hover:text-amber-400 transition-colors">
                  Photothèque
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-400">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-500" />
                <span>contact@archedelalliance.cd</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-500" />
                <span>+243 XX XXX XXXX</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-500" />
                <span>Kinshasa, RDC</span>
              </li>
              <li>
                <Button asChild size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700 text-white w-full">
                  <a
                    href="https://wa.me/243"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-600/30 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Centre Evangelique Arche de l'Alliance. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
