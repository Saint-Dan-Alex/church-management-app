"use client"

import type React from "react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { sallesService } from "@/lib/services/salles.service"
import { monitorsService } from "@/lib/services/monitors.service"
import { childrenService } from "@/lib/services/children.service"
import { worshipReportsService } from "@/lib/services/worship-reports.service"
import type { Salle, Monitor } from "@/lib/types/api"
import { toast } from "sonner"

interface AddWorshipReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface Person {
  id: string
  nom: string
  type: 'moniteur' | 'enfant'
}

export function AddWorshipReportDialog({ open, onOpenChange, onSuccess }: AddWorshipReportDialogProps) {
  const [salles, setSalles] = useState<Salle[]>([])
  const [personnes, setPersonnes] = useState<Person[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Popovers states
  const [openModerateurs, setOpenModerateurs] = useState(false)
  const [openAssistants, setOpenAssistants] = useState(false)
  const [openOrateurs, setOpenOrateurs] = useState(false)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    salle: "",
    moderateurs: [] as string[],
    assistants: [] as string[],
    orateurs: [] as string[],
    effectif_freres: "",
    effectif_soeurs: "",
    offrandes: "",
    nombre_nouveaux_venus: "",
  })

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  const loadData = async () => {
    try {
      setIsLoadingData(true)
      const [sallesResponse, moniteursResponse, enfantsResponse] = await Promise.all([
        sallesService.getAll(),
        monitorsService.getAll(),
        childrenService.getAll()
      ])

      const sallesData = Array.isArray(sallesResponse) ? sallesResponse : (sallesResponse as any).data || []
      const moniteursData = Array.isArray(moniteursResponse) ? moniteursResponse : (moniteursResponse as any).data || []
      const enfantsData = Array.isArray(enfantsResponse) ? enfantsResponse : (enfantsResponse as any).data || []

      // Combiner moniteurs et enfants
      const personnesList: Person[] = [
        ...moniteursData.map((m: any) => ({
          id: m.id,
          nom: m.nom_complet,
          type: 'moniteur' as const
        })),
        ...enfantsData.map((e: any) => ({
          id: e.id,
          nom: `${e.prenom} ${e.nom}`,
          type: 'enfant' as const
        }))
      ]

      setSalles(sallesData)
      setPersonnes(personnesList)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
      toast.error("Impossible de charger les données")
    } finally {
      setIsLoadingData(false)
    }
  }

  const addPersonne = (field: 'moderateurs' | 'assistants' | 'orateurs', nom: string) => {
    if (!formData[field].includes(nom)) {
      setFormData({ ...formData, [field]: [...formData[field], nom] })
    }
  }

  const removePersonne = (field: 'moderateurs' | 'assistants' | 'orateurs', nom: string) => {
    setFormData({ ...formData, [field]: formData[field].filter(p => p !== nom) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.salle) {
      toast.error("Veuillez sélectionner une salle")
      return
    }

    try {
      setIsSaving(true)

      const dataToSend = {
        date: formData.date,
        salle: formData.salle,
        orateurs: formData.orateurs,
        predicateur: formData.orateurs[0] || "",
        moderateurs: formData.moderateurs,
        assistants: formData.assistants,
        effectif_freres: parseInt(formData.effectif_freres) || 0,
        effectif_soeurs: parseInt(formData.effectif_soeurs) || 0,
        offrandes: formData.offrandes,
        nombre_nouveaux_venus: parseInt(formData.nombre_nouveaux_venus) || 0,
      }

      await worshipReportsService.create(dataToSend)

      toast.success("Rapport de culte enregistré avec succès")
      onOpenChange(false)
      if (onSuccess) onSuccess()

      setFormData({
        date: new Date().toISOString().split("T")[0],
        salle: "",
        moderateurs: [],
        assistants: [],
        orateurs: [],
        effectif_freres: "",
        effectif_soeurs: "",
        offrandes: "",
        nombre_nouveaux_venus: "",
      })
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement:", error)
      toast.error(error.message || "Impossible d'enregistrer le rapport")
    } finally {
      setIsSaving(false)
    }
  }

  const effectifTotal = (parseInt(formData.effectif_freres) || 0) + (parseInt(formData.effectif_soeurs) || 0)

  const PersonneCombobox = ({
    field,
    label,
    open,
    setOpen
  }: {
    field: 'moderateurs' | 'assistants' | 'orateurs'
    label: string
    open: boolean
    setOpen: (open: boolean) => void
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {formData[field].length > 0
              ? `${formData[field].length} sélectionné(s)`
              : "Sélectionner..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Rechercher..." />
            <CommandEmpty>Aucune personne trouvée.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {personnes.map((personne) => (
                <CommandItem
                  key={personne.id}
                  value={personne.nom}
                  onSelect={() => {
                    if (formData[field].includes(personne.nom)) {
                      removePersonne(field, personne.nom)
                    } else {
                      addPersonne(field, personne.nom)
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      formData[field].includes(personne.nom) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {personne.nom}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {personne.type}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Liste des personnes sélectionnées */}
      {formData[field].length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {formData[field].map((nom) => (
            <Badge key={nom} variant="secondary" className="gap-1">
              {nom}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => removePersonne(field, nom)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Nouveau Rapport de Culte</DialogTitle>
          <DialogDescription>Enregistrez le rapport du culte dominical</DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        ) : (
          <ScrollArea className="max-h-[75vh]">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4 pr-4">

                {/* INFORMATIONS GÉNÉRALES */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">
                    Informations générales
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date du culte *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="salle">Salle *</Label>
                      <Select
                        value={formData.salle}
                        onValueChange={(value) => setFormData({ ...formData, salle: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une salle" />
                        </SelectTrigger>
                        <SelectContent>
                          {salles.map((salle) => (
                            <SelectItem key={salle.id} value={salle.nom}>
                              {salle.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* MODÉRATEURS */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">Modérateurs</h3>
                  <PersonneCombobox
                    field="moderateurs"
                    label="Sélectionner les modérateurs"
                    open={openModerateurs}
                    setOpen={setOpenModerateurs}
                  />
                </div>

                {/* ASSISTANTS */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">Assistants</h3>
                  <PersonneCombobox
                    field="assistants"
                    label="Sélectionner les assistants"
                    open={openAssistants}
                    setOpen={setOpenAssistants}
                  />
                </div>

                {/* ORATEURS / PRÉDICATEURS */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">Orateurs / Prédicateurs</h3>
                  <PersonneCombobox
                    field="orateurs"
                    label="Sélectionner les orateurs"
                    open={openOrateurs}
                    setOpen={setOpenOrateurs}
                  />
                </div>

                {/* EFFECTIFS */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">Effectifs</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="effectif_freres">Frères *</Label>
                      <Input
                        id="effectif_freres"
                        type="number"
                        min="0"
                        value={formData.effectif_freres}
                        onChange={(e) => setFormData({ ...formData, effectif_freres: e.target.value })}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="effectif_soeurs">Sœurs *</Label>
                      <Input
                        id="effectif_soeurs"
                        type="number"
                        min="0"
                        value={formData.effectif_soeurs}
                        onChange={(e) => setFormData({ ...formData, effectif_soeurs: e.target.value })}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="effectif_total">Total</Label>
                      <Input
                        id="effectif_total"
                        type="number"
                        value={effectifTotal}
                        disabled
                        className="bg-gray-100 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* OFFRANDES */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">Offrandes</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="offrandes">Montant des offrandes</Label>
                    <Input
                      id="offrandes"
                      value={formData.offrandes}
                      onChange={(e) => setFormData({ ...formData, offrandes: e.target.value })}
                      placeholder="Ex: 171,700 FC + 1 GN"
                    />
                    <p className="text-xs text-gray-500">Vous pouvez indiquer plusieurs devises</p>
                  </div>
                </div>

                {/* NOUVEAUX VENUS */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">Nouveaux venus</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="nombre_nouveaux_venus">Nombre de nouveaux venus</Label>
                    <Input
                      id="nombre_nouveaux_venus"
                      type="number"
                      min="0"
                      value={formData.nombre_nouveaux_venus}
                      onChange={(e) => setFormData({ ...formData, nombre_nouveaux_venus: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="pr-4 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer le rapport"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
