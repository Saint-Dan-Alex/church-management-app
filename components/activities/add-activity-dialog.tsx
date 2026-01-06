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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Check, ChevronsUpDown, X, Plus } from "lucide-react"
import { activitiesService } from "@/lib/services/activities.service"
import { commissionsService } from "@/lib/services/commissions.service"
import { childrenService } from "@/lib/services/children.service"
import { monitorsService } from "@/lib/services/monitors.service"
import { toast } from "sonner"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface AddActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddActivityDialog({ open, onOpenChange, onSuccess }: AddActivityDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "libre" as "libre" | "payante",
    date: "",
    end_date: "",
    startTime: "",
    endTime: "",
    location: "",
    category: "",
    maxParticipants: "",
    organizers: [] as string[],
    montantRequis: "",
    devise: "CDF" as "CDF" | "USD",
    audience: "public" as "public" | "moniteurs",
  })

  const [categories, setCategories] = useState<Array<{ id: number, name: string }>>([])
  const [commissions, setCommissions] = useState<Array<{ id: string, nom: string }>>([])
  const [people, setPeople] = useState<Array<{ id: string, nom: string, type: string }>>([])
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false)
  const [openCategory, setOpenCategory] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  const loadData = async () => {
    try {
      const cats = await activitiesService.getCategories()
      setCategories(cats)

      const comms = await commissionsService.getAll()
      setCommissions(Array.isArray(comms) ? comms : comms.data || [])

      const [children, monitors] = await Promise.all([
        childrenService.getAll(),
        monitorsService.getAll()
      ])

      const childrenData = Array.isArray(children) ? children : children.data || []
      const monitorsData = Array.isArray(monitors) ? monitors : monitors.data || []

      const allPeople = [
        ...childrenData.map((c: any, index: number) => ({ id: c.id || `child-${index}`, nom: `${c.prenom} ${c.nom}`, type: 'Enfant' })),
        ...monitorsData.map((m: any, index: number) => ({ id: m.id || `monitor-${index}`, nom: m.nom_complet || m.nomComplet || `${m.prenom} ${m.nom}`, type: 'Moniteur' }))
      ]
      setPeople(allPeople)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    }
  }

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return ""

    const [startH, startM] = formData.startTime.split(':').map(Number)
    const [endH, endM] = formData.endTime.split(':').map(Number)

    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM
    // Si la date de fin est différente et définie, on pourrait calculer plus précisément,
    // mais pour l'instant on garde la logique journalière ou on laisse l'utilisateur gérer.
    // Si endMinutes < startMinutes, on suppose que c'est le lendemain si c'est sur 2 jours ?
    // Simplifions : on calcule juste la différence d'heures.

    let diffMinutes = endMinutes - startMinutes

    // Si on a des jours différents
    if (formData.date && formData.end_date && formData.date !== formData.end_date) {
      const start = new Date(`${formData.date}T${formData.startTime}`)
      const end = new Date(`${formData.end_date}T${formData.endTime}`)
      const diffMs = end.getTime() - start.getTime()
      diffMinutes = Math.floor(diffMs / 60000)
    } else if (diffMinutes < 0) {
      // Si même jour mais heure fin < heure début, c'est incohérent sauf si jour suivant non spécifié
      return "Invalide (fin avant début)"
    }

    if (diffMinutes <= 0 && (!formData.end_date || formData.date === formData.end_date)) return ""

    const days = Math.floor(diffMinutes / (24 * 60))
    const remainingMinutesAfterDays = diffMinutes % (24 * 60)
    const hours = Math.floor(remainingMinutesAfterDays / 60)
    const minutes = remainingMinutesAfterDays % 60

    let durationStr = ""
    if (days > 0) durationStr += `${days}j `
    if (hours > 0) durationStr += `${hours}h `
    if (minutes > 0) durationStr += `${minutes}min`

    return durationStr.trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category) {
      toast.error("Veuillez sélectionner une catégorie")
      return
    }

    try {
      setIsSaving(true)

      const duration = calculateDuration()
      if (!duration || duration.startsWith("Invalide")) {
        toast.error("La durée de l'activité est invalide")
        return
      }

      await activitiesService.create({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        end_date: formData.end_date || undefined,
        time: formData.startTime,
        duration: duration,
        location: formData.location,
        category: formData.category,
        type: formData.type,
        maxParticipants: parseInt(formData.maxParticipants) || 100,
        status: "upcoming",
        organizer: formData.organizers.join(", ") || "Non spécifié",
        // @ts-ignore
        price: formData.type === "payante" ? parseFloat(formData.montantRequis) : undefined,
        currency: formData.type === "payante" ? formData.devise : undefined,
        audience: formData.audience,
      })

      toast.success("Activité créée avec succès")
      onOpenChange(false)
      onSuccess?.()

      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "libre",
        date: "",
        end_date: "",
        startTime: "",
        endTime: "",
        location: "",
        category: "",
        maxParticipants: "",
        organizers: [],
        montantRequis: "",
        devise: "CDF",
        audience: "public",
      })
    } catch (error: any) {
      console.error("Erreur lors du création:", error)
      toast.error(error.message || "Impossible de créer l'activité")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleOrganizer = (name: string) => {
    setFormData(prev => ({
      ...prev,
      organizers: prev.organizers.includes(name)
        ? prev.organizers.filter(o => o !== name)
        : [...prev.organizers, name]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle Activité</DialogTitle>
          <DialogDescription>Créez une nouvelle activité ou événement</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Culte Spécial"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de l'activité..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Audience (Visibilité) *</Label>
              <RadioGroup
                value={formData.audience}
                onValueChange={(value: "public" | "moniteurs") => setFormData({ ...formData, audience: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="font-normal cursor-pointer">
                    <span className="flex items-center gap-2">Public (Tout le monde)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moniteurs" id="moniteurs" />
                  <Label htmlFor="moniteurs" className="font-normal cursor-pointer">
                    <span className="flex items-center gap-2">Moniteurs Uniquement</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label>Type d'activité *</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value: "libre" | "payante") => setFormData({ ...formData, type: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="libre" id="libre" />
                  <Label htmlFor="libre" className="font-normal cursor-pointer">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Libre
                    </Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="payante" id="payante" />
                  <Label htmlFor="payante" className="font-normal cursor-pointer">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Payante
                    </Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.type === "payante" && (
              <div className="grid grid-cols-2 gap-4 border rounded-lg p-4 bg-blue-50/50">
                <div className="grid gap-2">
                  <Label htmlFor="montantRequis">Prix *</Label>
                  <Input
                    id="montantRequis"
                    type="number"
                    min="0"
                    placeholder="Ex: 5000"
                    value={formData.montantRequis}
                    onChange={(e) => setFormData({ ...formData, montantRequis: e.target.value })}
                    required={formData.type === "payante"}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="devise">Devise</Label>
                  <Select
                    value={formData.devise}
                    onValueChange={(value: "CDF" | "USD") => setFormData({ ...formData, devise: value })}
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
            )}

            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {formData.category
                      ? formData.category
                      : "Sélectionner une catégorie"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher une catégorie..." onValueChange={setCategorySearch} />
                    <CommandList>
                      <CommandEmpty>
                        <div className="p-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-start text-sm"
                            onClick={() => {
                              setFormData({ ...formData, category: categorySearch });
                              setOpenCategory(false);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter "{categorySearch}"
                          </Button>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {categories.map((cat) => (
                          <CommandItem
                            key={cat.id}
                            value={cat.name}
                            onSelect={() => {
                              setFormData({ ...formData, category: cat.name })
                              setOpenCategory(false)
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${formData.category === cat.name ? "opacity-100" : "opacity-0"
                                }`}
                            />
                            {cat.name}
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
                <Label htmlFor="date">Date de début *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">Date de fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  min={formData.date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  placeholder="Optionnel"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Heure de début *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">Heure de fin *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            {(formData.startTime && formData.endTime) && (
              <div className="text-sm text-muted-foreground">
                Durée calculée: <strong>{calculateDuration()}</strong>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="location">Lieu *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Salle principale, Jardin, etc."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxParticipants">Participants max</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                placeholder="100"
                min="1"
              />
            </div>

            <div className="grid gap-2">
              <Label>Coordinateurs (optionnel)</Label>
              <Popover open={isOrganizerOpen} onOpenChange={setIsOrganizerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between"
                  >
                    {formData.organizers.length > 0
                      ? `${formData.organizers.length} sélectionné(s)`
                      : "Sélectionner des coordinateurs"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandEmpty>Aucune personne trouvée</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {people.map((person) => (
                        <CommandItem
                          key={person.id}
                          onSelect={() => toggleOrganizer(person.nom)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${formData.organizers.includes(person.nom) ? "opacity-100" : "opacity-0"
                              }`}
                          />
                          {person.nom}
                          <Badge variant="outline" className="ml-auto text-xs">
                            {person.type}
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {formData.organizers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.organizers.map((org) => (
                    <Badge key={org} variant="secondary" className="gap-1">
                      {org}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => toggleOrganizer(org)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Création..." : "Créer l'Activité"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
