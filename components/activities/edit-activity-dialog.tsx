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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react"
import { activitiesService, type Activity } from "@/lib/services/activities.service"
import { childrenService } from "@/lib/services/children.service"
import { monitorsService } from "@/lib/services/monitors.service"
import { toast } from "sonner"

interface EditActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: Activity | null
  onSuccess?: () => void
}

export function EditActivityDialog({ open, onOpenChange, activity, onSuccess }: EditActivityDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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
    responsable: "", // Garde pour compatibilité si besoin, mais on utilise organizers
  })

  const [categories, setCategories] = useState<Array<{ id: number, name: string }>>([])
  const [people, setPeople] = useState<Array<{ nom: string, type: string }>>([])
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false)

  // Charger les données référentielles
  useEffect(() => {
    if (open) {
      loadReferenceData()
    }
  }, [open])

  // Charger les données de l'activité dans le formulaire
  useEffect(() => {
    if (activity && open) {
      const organizersList = activity.organizer
        ? activity.organizer.split(',').map((o: string) => o.trim())
        : []

      setFormData({
        title: activity.title,
        description: activity.description || "",
        type: (activity.type === 'libre' || activity.type === 'gratuite') ? 'libre' : 'payante',
        date: activity.date ? new Date(activity.date).toISOString().split('T')[0] : "",
        end_date: activity.end_date ? new Date(activity.end_date).toISOString().split('T')[0] : "",
        startTime: activity.time ? activity.time.substring(0, 5) : "",
        endTime: "", // Difficile à déduire sans calcul inverse, on laisse vide ou à remplir
        location: activity.location,
        category: activity.category,
        maxParticipants: activity.maxParticipants ? activity.maxParticipants.toString() : "",
        organizers: organizersList,
        responsable: activity.organizer, // Fallback
        montantRequis: activity.price ? activity.price.toString() : "",
        devise: (activity.currency as "CDF" | "USD") || "CDF",
      })
    }
  }, [activity, open])

  const loadReferenceData = async () => {
    try {
      const [cats, children, monitors] = await Promise.all([
        activitiesService.getCategories(),
        childrenService.getAll(),
        monitorsService.getAll()
      ])

      setCategories(cats)

      const childrenData = Array.isArray(children) ? children : (children as any).data || []
      const monitorsData = Array.isArray(monitors) ? monitors : (monitors as any).data || []

      const allPeople = [
        ...childrenData.map((c: any) => ({ nom: `${c.prenom} ${c.nom}`, type: 'Enfant' })),
        ...monitorsData.map((m: any) => ({ nom: m.nom, type: 'Moniteur' }))
      ]
      setPeople(allPeople)
    } catch (error) {
      console.error("Erreur chargement refs:", error)
    }
  }

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return ""

    const [startH, startM] = formData.startTime.split(':').map(Number)
    const [endH, endM] = formData.endTime.split(':').map(Number)

    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM

    let diffMinutes = endMinutes - startMinutes

    if (formData.date && formData.end_date && formData.date !== formData.end_date) {
      const start = new Date(`${formData.date}T${formData.startTime}`)
      const end = new Date(`${formData.end_date}T${formData.endTime}`)
      const diffMs = end.getTime() - start.getTime()
      diffMinutes = Math.floor(diffMs / 60000)
    } else if (diffMinutes < 0) {
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
    if (!activity) return

    try {
      setIsSaving(true)
      const duration = calculateDuration()

      const updateData: any = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        end_date: formData.end_date || null,
        time: formData.startTime,
        location: formData.location,
        category: formData.category,
        type: formData.type,
        maxParticipants: parseInt(formData.maxParticipants) || 100,
        organizer: formData.organizers.join(", ") || formData.responsable || "Non spécifié",
        price: formData.type === "payante" ? parseFloat(formData.montantRequis) : null,
        currency: formData.type === "payante" ? formData.devise : null,
      }

      if (duration && !duration.startsWith("Invalide")) {
        updateData.duration = duration
      }

      await activitiesService.update(activity.id, updateData)

      toast.success("Activité mise à jour")
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Erreur update:", error)
      toast.error("Erreur lors de la mise à jour")
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

  if (!activity) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'Activité</DialogTitle>
          <DialogDescription>Modifiez les informations de l'activité</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Titre */}
            <div className="grid gap-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            {/* Type */}
            <div className="grid gap-2">
              <Label>Type d'activité *</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value: "libre" | "payante") => setFormData({ ...formData, type: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="libre" id="libre_dialog" />
                  <Label htmlFor="libre_dialog" className="font-normal cursor-pointer">
                    <Badge variant="outline" className="bg-green-50 text-green-700">Libre</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="payante" id="payante_dialog" />
                  <Label htmlFor="payante_dialog" className="font-normal cursor-pointer">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">Payante</Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Prix (si payante) */}
            {formData.type === "payante" && (
              <div className="grid grid-cols-2 gap-4 border rounded-lg p-4 bg-blue-50/50">
                <div className="grid gap-2">
                  <Label htmlFor="montantRequis">Prix *</Label>
                  <Input
                    id="montantRequis"
                    type="number"
                    min="0"
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
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="heureDebut">Heure de début *</Label>
                <Input
                  id="heureDebut"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="heureFin">Heure de fin *</Label>
                <Input
                  id="heureFin"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  placeholder="Recalculer durée..."
                />
              </div>
            </div>

            {(formData.startTime && formData.endTime) && (
              <div className="text-sm text-muted-foreground">
                Nouvelle durée: <strong>{calculateDuration()}</strong>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lieu">Lieu</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Coordinateurs (optionnel)</Label>
              <Popover open={isOrganizerOpen} onOpenChange={setIsOrganizerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="justify-between w-full">
                    {formData.organizers.length > 0
                      ? `${formData.organizers.length} sélectionné(s)`
                      : "Modifier les coordinateurs"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandEmpty>Aucune personne trouvée</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {people.map((person) => (
                        <CommandItem key={person.nom} onSelect={() => toggleOrganizer(person.nom)}>
                          <Check className={`mr-2 h-4 w-4 ${formData.organizers.includes(person.nom) ? "opacity-100" : "opacity-0"}`} />
                          {person.nom}
                          <Badge variant="outline" className="ml-auto text-xs">{person.type}</Badge>
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
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleOrganizer(org)} />
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
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

