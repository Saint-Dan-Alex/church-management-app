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
import { cotisationsService, type CotisationType, type Cotisation } from "@/lib/services/cotisations.service"
import { monitorsService } from "@/lib/services/monitors.service"
import { useToast } from "@/hooks/use-toast"

interface Monitor {
  id: string
  nom: string
  prenom: string
  postNom?: string
}

interface EditCotisationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cotisation: Cotisation | null
  onSuccess?: () => void
}

export function EditCotisationDialog({ open, onOpenChange, cotisation, onSuccess }: EditCotisationDialogProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    membre_id: "",
    membre_nom: "",
    type_cotisation: "",
    montant: "",
    devise: "CDF",
    date_cotisation: "",
    mois: "",
    annee: "",
    mode_paiement: "cash",
    numero_recu: "",
    remarque: "",
    enregistre_par_nom: "Admin",
  })

  const [types, setTypes] = useState<CotisationType[]>([])
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [openType, setOpenType] = useState(false)
  const [openMonitor, setOpenMonitor] = useState(false)
  const [typeSearch, setTypeSearch] = useState("")
  const [monitorSearch, setMonitorSearch] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadTypes()
      loadMonitors()
    }
  }, [open])

  useEffect(() => {
    if (cotisation && open) {
      setFormData({
        membre_id: cotisation.membre_id || "",
        membre_nom: cotisation.membre_nom || "",
        type_cotisation: cotisation.type ? (typeof cotisation.type === 'string' ? cotisation.type : cotisation.type.id) : (cotisation.cotisation_type_id || ""),
        montant: cotisation.montant.toString(),
        devise: cotisation.devise || "CDF",
        date_cotisation: cotisation.date_cotisation ? new Date(cotisation.date_cotisation).toISOString().split('T')[0] : "",
        mois: cotisation.mois || "",
        annee: cotisation.annee || "",
        mode_paiement: cotisation.mode_paiement || "cash",
        numero_recu: cotisation.numero_recu || "",
        remarque: cotisation.remarque || "",
        enregistre_par_nom: cotisation.enregistre_par_nom || "Admin",
      })
    }
  }, [cotisation, open])

  const loadTypes = async () => {
    try {
      const data = await cotisationsService.getTypes()
      setTypes(data)
    } catch (error) {
      console.error("Erreur chargement types:", error)
    }
  }

  const loadMonitors = async () => {
    try {
      const response = await monitorsService.getAll({ per_page: 1000 })
      // L'API peut retourner les données directement ou dans une propriété 'data'
      const monitorsData = response.data || response
      setMonitors(Array.isArray(monitorsData) ? monitorsData : [])
    } catch (error) {
      console.error("Erreur chargement moniteurs:", error)
    }
  }

  const getMonitorFullName = (monitor: Monitor): string => {
    return [monitor.nom, monitor.postNom, monitor.prenom].filter(Boolean).join(" ")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cotisation) return

    if (!formData.membre_nom || !formData.type_cotisation || !formData.montant) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await cotisationsService.update(cotisation.id, {
        ...formData,
        montant: parseFloat(formData.montant),
      })

      toast({ title: "Succès", description: "Cotisation modifiée avec succès !" })
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Erreur:", error)
      toast({ title: "Erreur", description: "Échec de la modification", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const mois = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ]

  if (!cotisation) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la cotisation</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la cotisation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 pr-2">
            {/* Sélection du moniteur */}
            <div className="grid gap-2">
              <Label>Nom du membre *</Label>
              <Popover open={openMonitor} onOpenChange={setOpenMonitor}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openMonitor}
                    className="w-full justify-between"
                  >
                    {formData.membre_nom || "Sélectionner un moniteur..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher un moniteur..."
                      onValueChange={setMonitorSearch}
                    />
                    <CommandList>
                      <CommandEmpty>
                        <div className="p-2 text-sm text-muted-foreground">
                          Aucun moniteur trouvé
                        </div>
                      </CommandEmpty>
                      <CommandGroup heading="Moniteurs">
                        {monitors.map((monitor) => {
                          const fullName = getMonitorFullName(monitor)
                          return (
                            <CommandItem
                              key={monitor.id}
                              value={fullName}
                              onSelect={() => {
                                setFormData({
                                  ...formData,
                                  membre_id: monitor.id,
                                  membre_nom: fullName
                                })
                                setOpenMonitor(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.membre_id === monitor.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {fullName}
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Type de cotisation dynamique */}
            <div className="grid gap-2">
              <Label>Type de cotisation *</Label>
              <Popover open={openType} onOpenChange={setOpenType}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openType}
                    className="w-full justify-between"
                  >
                    {formData.type_cotisation
                      ? types.find((t) => t.id === formData.type_cotisation)?.name || formData.type_cotisation
                      : "Sélectionner un type..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher..." onValueChange={setTypeSearch} />
                    <CommandList>
                      <CommandEmpty>
                        <div className="p-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-start text-sm"
                            onClick={() => {
                              setFormData({ ...formData, type_cotisation: typeSearch });
                              setOpenType(false);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter "{typeSearch}"
                          </Button>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {types.map((type) => (
                          <CommandItem
                            key={type.id}
                            value={type.name}
                            onSelect={() => {
                              setFormData({ ...formData, type_cotisation: type.id })
                              setOpenType(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.type_cotisation === type.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {type.name}
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
                  placeholder="5000"
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
                <Label htmlFor="mois">Mois</Label>
                <Select
                  value={formData.mois}
                  onValueChange={(value) => setFormData({ ...formData, mois: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le mois" />
                  </SelectTrigger>
                  <SelectContent>
                    {mois.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="annee">Année</Label>
                <Input
                  id="annee"
                  value={formData.annee || ""}
                  onChange={(e) => setFormData({ ...formData, annee: e.target.value })}
                  placeholder="2025"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date_cotisation">Date de cotisation</Label>
                <Input
                  id="date_cotisation"
                  type="date"
                  value={formData.date_cotisation || ""}
                  onChange={(e) => setFormData({ ...formData, date_cotisation: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mode_paiement">Mode de paiement</Label>
                <Select
                  value={formData.mode_paiement}
                  onValueChange={(value) => setFormData({ ...formData, mode_paiement: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Espèces</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                    <SelectItem value="card">Carte</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="numero_recu">Numéro de reçu</Label>
              <Input
                id="numero_recu"
                value={formData.numero_recu || ""}
                readOnly
                className="bg-muted cursor-not-allowed"
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
              {loading ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
