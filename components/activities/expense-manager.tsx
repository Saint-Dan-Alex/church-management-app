"use client"

import { useState } from "react"
import { AddExpenseDialog } from "./add-expense-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Search,
  Download,
  Trash2,
  Edit,
} from "lucide-react"
import type { Expense, FinancialSummary, Currency } from "@/types/expense"
import { EXPENSE_CATEGORIES } from "@/types/expense"

interface ExpenseManagerProps {
  activiteId: string
  activiteNom: string
  totalPaiementsCollectes: number
  devisePaiements: Currency
}

// Données mockées
const mockExpenses: Expense[] = [
  {
    id: "1",
    activiteId: "1",
    activiteNom: "Réunion des moniteurs",
    categorie: "repas",
    description: "Rafraîchissements pour les participants",
    montant: 15000,
    devise: "CDF",
    date: "2025-01-20",
    beneficiaire: "Restaurant La Paix",
    referenceFacture: "FACT-2025-001",
    ajoutePar: "user1",
    ajouteParNom: "Admin",
    createdAt: new Date(),
  },
  {
    id: "2",
    activiteId: "1",
    activiteNom: "Réunion des moniteurs",
    categorie: "materiel",
    description: "Cahiers et stylos",
    montant: 8000,
    devise: "CDF",
    date: "2025-01-19",
    beneficiaire: "Librairie Centrale",
    ajoutePar: "user1",
    ajouteParNom: "Admin",
    createdAt: new Date(),
  },
]

export function ExpenseManager({
  activiteId,
  activiteNom,
  totalPaiementsCollectes,
  devisePaiements,
}: ExpenseManagerProps) {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

  // Calculer le total des dépenses
  const totalDepenses = expenses.reduce((sum, expense) => {
    if (expense.devise === devisePaiements) {
      return sum + expense.montant
    }
    return sum
  }, 0)

  // Calculer le bilan
  const bilan = totalPaiementsCollectes - totalDepenses

  // Filtrer les dépenses
  const filteredExpenses = expenses.filter((expense) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      expense.description.toLowerCase().includes(searchLower) ||
      expense.beneficiaire?.toLowerCase().includes(searchLower) ||
      expense.categorie.toLowerCase().includes(searchLower)
    )
  })

  const formatCurrency = (montant: number, devise: Currency) => {
    return `${montant.toLocaleString("fr-FR")} ${devise}`
  }

  const getCategoryLabel = (categorie: string) => {
    const category = EXPENSE_CATEGORIES.find((c) => c.value === categorie)
    return category ? `${category.icon} ${category.label}` : categorie
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette dépense ?")) {
      setExpenses(expenses.filter((e) => e.id !== id))
      alert("Dépense supprimée avec succès")
    }
  }

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense)
    // TODO: Ouvrir le dialog d'édition
    alert(`Édition de : ${expense.description}\n(Fonctionnalité à venir)`)
  }

  const handleExport = () => {
    // TODO: Implémenter l'export
    alert("Export des dépenses\n(Fonctionnalité à venir)")
  }

  return (
    <div className="space-y-6">
      {/* Résumé financier */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Total Entrées</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(totalPaiementsCollectes, devisePaiements)}
                </p>
                <p className="text-xs text-green-600 mt-1">Paiements collectés</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Total Dépenses</p>
                <p className="text-2xl font-bold text-red-900">
                  {formatCurrency(totalDepenses, devisePaiements)}
                </p>
                <p className="text-xs text-red-600 mt-1">{expenses.length} dépenses</p>
              </div>
              <TrendingDown className="h-10 w-10 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={
            bilan >= 0
              ? "border-blue-200 bg-blue-50"
              : "border-orange-200 bg-orange-50"
          }
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={bilan >= 0 ? "text-sm text-blue-700" : "text-sm text-orange-700"}>
                  Bilan
                </p>
                <p className={bilan >= 0 ? "text-2xl font-bold text-blue-900" : "text-2xl font-bold text-orange-900"}>
                  {formatCurrency(bilan, devisePaiements)}
                </p>
                <p className={bilan >= 0 ? "text-xs mt-1 text-blue-600" : "text-xs mt-1 text-orange-600"}>
                  {bilan >= 0 ? "Excédent" : "Déficit"}
                </p>
              </div>
              <DollarSign className={bilan >= 0 ? "h-10 w-10 text-blue-600" : "h-10 w-10 text-orange-600"} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des dépenses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Dépenses de l'activité
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
              <Button size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter Dépense
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Barre de recherche */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher une dépense..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Liste */}
          <div className="space-y-3">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <TrendingDown className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucune dépense enregistrée</p>
                <p className="text-sm mt-1">Cliquez sur "Ajouter Dépense" pour commencer</p>
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-sm">
                        {getCategoryLabel(expense.categorie)}
                      </Badge>
                      <p className="font-semibold text-gray-900">{expense.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {expense.beneficiaire && (
                        <span>→ {expense.beneficiaire}</span>
                      )}
                      <span>
                        {new Date(expense.date).toLocaleDateString("fr-FR")}
                      </span>
                      {expense.referenceFacture && (
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                          {expense.referenceFacture}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-700">
                        {formatCurrency(expense.montant, expense.devise)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(expense)}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(expense.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog Ajouter Dépense */}
      <AddExpenseDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        activiteId={activiteId}
        activiteNom={activiteNom}
        devise={devisePaiements}
      />
    </div>
  )
}
