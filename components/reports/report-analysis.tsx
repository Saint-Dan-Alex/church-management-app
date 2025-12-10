import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react"

interface AnalysisMetric {
    label: string
    value: number
    previousValue?: number
    target?: number
    unit?: string
    inverse?: boolean // Si true, une baisse est bonne (ex: dépenses)
}

interface ReportAnalysisProps {
    title?: string
    metrics: AnalysisMetric[]
    customComment?: string
}

export function ReportAnalysis({ title = "Analyse & Observations", metrics, customComment }: ReportAnalysisProps) {

    const getAnalysis = (m: AnalysisMetric) => {
        let trend = 'stable'
        let performance = 'neutral'
        let diff = 0
        let percent = 0

        if (m.previousValue !== undefined && m.previousValue !== 0) {
            diff = m.value - m.previousValue
            percent = (diff / m.previousValue) * 100

            if (diff > 0) trend = 'up'
            if (diff < 0) trend = 'down'

            if (m.inverse) {
                performance = trend === 'down' ? 'good' : 'bad'
            } else {
                performance = trend === 'up' ? 'good' : 'bad'
            }
        }

        return { trend, performance, diff, percent }
    }

    return (
        <Card className="mt-8 border-l-4 border-l-blue-600 bg-slate-50/50 print:bg-transparent print:border-slate-300">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 uppercase tracking-tight text-slate-800">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-4">
                {metrics.map((m, i) => {
                    const analysis = getAnalysis(m)
                    const isGood = analysis.performance === 'good'
                    const isBad = analysis.performance === 'bad'

                    return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-100 shadow-sm print:border-none print:shadow-none print:p-0">
                            <div className={`mt-0.5 ${isGood ? 'text-emerald-500' : isBad ? 'text-red-500' : 'text-blue-500'}`}>
                                {isGood ? <CheckCircle2 className="h-5 w-5" /> : isBad ? <AlertCircle className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">
                                    {m.label} : <span className="font-bold">{m.value.toLocaleString()} {m.unit}</span>
                                </p>
                                {m.previousValue !== undefined && (
                                    <p className="mt-1 text-slate-600 leading-relaxed">
                                        On observe une {analysis.trend === 'up' ? 'augmentation' : 'diminution'} de
                                        <span className={`font-bold mx-1 ${isGood ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {Math.abs(analysis.percent).toFixed(1)}%
                                        </span>
                                        par rapport à la période précédente.
                                        {isGood ? " C'est une performance encourageante qui démontre une bonne dynamique." :
                                            isBad ? " Il serait judicieux d'analyser les causes de cette tendance pour y remédier." :
                                                " La situation reste stable."}
                                    </p>
                                )}
                                {/* Target comparison */}
                                {m.target && (
                                    <p className="mt-1 text-slate-500 italic">
                                        Objectif fixé : {m.target.toLocaleString()} {m.unit}.
                                        Taux d'accomplissement : {((m.value / m.target) * 100).toFixed(1)}%.
                                    </p>
                                )}
                            </div>
                        </div>
                    )
                })}

                {customComment && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="italic font-medium text-slate-800">
                            " {customComment} "
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
