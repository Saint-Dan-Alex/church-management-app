"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { sortiesService, type SortieCategory } from "@/lib/services/sorties.service"
import { useToast } from "@/hooks/use-toast"

interface AddSortieDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSortieDialog({ open, onOpenChange }: AddSortieDialogProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    libelle: "",
    description: "",
    categorie: "",
    montant: "",
    devise: "CDF",
    date_sortie: new Date().toISOString().split('T')[0],
    beneficiaire: "",
    reference: "",
    remarque: "",
    enregistre_par_nom: "Admin",
  })

  const [categories, setCategories] = useState<SortieCategory[]>([])
  const [openCategory, setOpenCategory] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open])

  const loadCategories = async () => {
    try {
      const data = await sortiesService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Erreur chargement catégories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.libelle || !formData.categorie || !formData.montant) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await sortiesService.create({
        ...formData,
        montant: parseFloat(formData.montant),
        enregistre_par: "1", // À remplacer par l'ID de l'utilisateur connecté
      })

      toast({ title: "Succès", description: "Sortie enregistrée avec succès !" })

      // Reset
      setFormData({
        libelle: "",
        description: "",
        categorie: "",
        montant: "",
        devise: "CDF",
        date_sortie: new Date().toISOString().split('T')[0],
        beneficiaire: "",
        reference: "",
        remarque: "",
        enregistre_par_nom: "Admin",
      })
      onOpenChange(false)
      window.location.reload()
    } catch (error) {
      console.error("Erreur:", error)
      toast({ title: "Erreur", description: "Échec de l'enregistrement", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enregistrer une sortie</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle dépense ou sortie d'argent
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 pr-2">
            <div className="grid gap-2">
              <Label htmlFor="libelle">Libellé *</Label>
              <Input
                id="libelle"
                value={formData.libelle || ""}
                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                placeholder="Achat fournitures, transport, etc."
                required
              />
            </div>

            {/* Catégorie dynamique */}
            <div className="grid gap-2">
              <Label>Catégorie *</Label>
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategory}
                    className="w-full justify-between"
                  >
                    {formData.categorie
                      ? categories.find((c) => c.id === formData.categorie)?.name || formData.categorie
                      : "Sélectionner une catégorie..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher..." onValueChange={setCategorySearch} />
                    <CommandList>
                      <CommandEmpty>
                        <div className="p-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-start text-sm"
                            onClick={() => {
                              setFormData({ ...formData, categorie: categorySearch });
                              setOpenCategory(false);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter "{categorySearch}"
                          </Button>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.name}
                            onSelect={() => {
                              setFormData({ ...formData, categorie: category.id })
                              setOpenCategory(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.categorie === category.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="montant">Montant *</Label>
                <Input
                  id="montant"
                  type="number"
                  value={formData.montant || ""}
                  onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                  placeholder="10000"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="devise">Devise</Label>
                <Select
                  value={formData.devise}
                  onValueChange={(value) => setFormData({ ...formData, devise: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDF">CDF</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date_sortie">Date de sortie</Label>
                <Input
                  id="date_sortie"
                  type="date"
                  value={formData.date_sortie || ""}
                  onChange={(e) => setFormData({ ...formData, date_sortie: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="beneficiaire">Bénéficiaire</Label>
                <Input
                  id="beneficiaire"
                  value={formData.beneficiaire || ""}
                  onChange={(e) => setFormData({ ...formData, beneficiaire: e.target.value })}
                  placeholder="Nom du fournisseur"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Détails de la sortie..."
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reference">Référence</Label>
              <Input
                id="reference"
                value={formData.reference || ""}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="N° facture, bon de commande..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="remarque">Remarque</Label>
              <Textarea
                id="remarque"
                value={formData.remarque || ""}
                onChange={(e) => setFormData({ ...formData, remarque: e.target.value })}
                placeholder="Notes ou observations..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
