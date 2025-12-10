import { Church } from "lucide-react"

interface ReportHeaderProps {
    title?: string
    subtitle?: string
}

export function ReportHeader({ title, subtitle }: ReportHeaderProps) {
    return (
        <div className="w-full mb-8 border-b-2 border-slate-900 pb-4 print:border-black">
            <div className="flex items-start justify-between gap-4">
                {/* Logo Arche (Gauche) */}
                <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
                    {/* Idéalement utiliser <img src="/logo-arche.png" /> */}
                    <div className="flex flex-col items-center">
                        <Church className="w-12 h-12 text-blue-600 mb-1" />
                        <span className="text-[10px] font-bold text-center leading-tight text-blue-800">ARCHE DE<br />L'ALLIANCE</span>
                    </div>
                </div>

                {/* Texte Central */}
                <div className="flex-1 text-center space-y-1">
                    <h1 className="text-lg font-bold uppercase text-slate-900 print:text-black leading-tight">
                        Communauté des Assemblées de Dieu de la RDC
                    </h1>
                    <h2 className="text-xl font-black text-blue-700 print:text-blue-800 uppercase leading-tight">
                        Centre Evangélique l'Arche de l'Alliance, Masina
                    </h2>
                    <h3 className="text-md font-bold text-slate-800 print:text-black italic">
                        Ministère auprès des Enfants et Adolescents
                    </h3>
                    <div className="pt-2">
                        <span className="inline-block border-b-2 border-slate-900 print:border-black font-black uppercase text-sm tracking-widest px-2 pb-0.5">
                            Coordination
                        </span>
                    </div>
                </div>

                {/* Logo AD (Droite) */}
                <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
                    {/* Logo AD Placeholder - Jaune et Noir */}
                    <div className="w-16 h-20 bg-yellow-400 border-2 border-black rounded-b-full rounded-t-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                        <span className="text-[8px] font-bold text-black border border-black px-0.5 mb-1 bg-white">AD</span>
                        <span className="text-[6px] text-center font-bold leading-none">ASSEMBLÉES<br />DE DIEU</span>
                        <div className="mt-1 w-full h-8 bg-white border border-black rounded-sm flex items-center justify-center">
                            <BookOpenIcon className="w-4 h-4 text-black" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Titre du rapport spécifique si fourni */}
            {(title || subtitle) && (
                <div className="mt-8 text-center space-y-2">
                    {title && <h2 className="text-2xl font-black uppercase underline decoration-2 underline-offset-4">{title}</h2>}
                    {subtitle && <p className="text-lg font-medium text-slate-600 print:text-slate-800">{subtitle}</p>}
                </div>
            )}
        </div>
    )
}

function BookOpenIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    )
}
