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
import { Check, ChevronsUpDown, X } from "lucide-react"
import { activitiesService } from "@/lib/services/activities.service"
import { commissionsService } from "@/lib/services/commissions.service"
import { childrenService } from "@/lib/services/children.service"
import { monitorsService } from "@/lib/services/monitors.service"
import { toast } from "sonner"

interface AddActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddActivityDialog({ open, onOpenChange, onSuccess }: AddActivityDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "gratuite" as "gratuite" | "payante",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    category: "",
    maxParticipants: "",
    organizers: [] as string[],
    montantRequis: "",
    devise: "CDF" as "CDF" | "USD",
  })

  const [categories, setCategories] = useState<Array<{ id: number, name: string }>>([])
  const [commissions, setCommissions] = useState<Array<{ id: string, nom: string }>>([])
  const [people, setPeople] = useState<Array<{ nom: string, type: string }>>([])
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  const loadData = async () => {
    try {
      // Charger les catégories
      const cats = await activitiesService.getCategories()
      setCategories(cats)

      // Charger les commissions
      const comms = await commissionsService.getAll()
      setCommissions(Array.isArray(comms) ? comms : comms.data || [])

      // Charger les enfants et moniteurs pour les coordinateurs
      const [children, monitors] = await Promise.all([
        childrenService.getAll(),
        monitorsService.getAll()
      ])

      const childrenData = Array.isArray(children) ? children : children.data || []
      const monitorsData = Array.isArray(monitors) ? monitors : monitors.data || []

      const allPeople = [
        ...childrenData.map((c: any) => ({ nom: `${c.prenom} ${c.nom}`, type: 'Enfant' })),
        ...monitorsData.map((m: any) => ({ nom: m.nom, type: 'Moniteur' }))
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
    const diffMinutes = endMinutes - startMinutes

    if (diffMinutes <= 0) return ""

    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60

    if (hours === 0) return `${minutes}min`
    if (minutes === 0) return `${hours}h`
    return `${hours}h${minutes}`
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
      if (!duration) {
        toast.error("L'heure de fin doit être après l'heure de début")
        return
      }

      await activitiesService.create({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.startTime,
        duration: duration,
        location: formData.location,
        category: formData.category,
        type: formData.type,
        maxParticipants: parseInt(formData.maxParticipants) || 100,
        status: "upcoming",
        organizer: formData.organizers.join(", ") || "Non spécifié",
      })

      toast.success("Activité créée avec succès")
      onOpenChange(false)
      onSuccess?.()

      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "gratuite",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        category: "",
        maxParticipants: "",
        organizers: [],
      })
    } catch (error: any) {
      console.error("Erreur lors de la création:", error)
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
                placeholder="École du Dimanche"
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
              <Label>Type d'activité *</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value: "gratuite" | "payante") => setFormData({ ...formData, type: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gratuite" id="gratuite" />
                  <Label htmlFor="gratuite" className="font-normal cursor-pointer">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      🎉 Gratuite
                    </Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="payante" id="payante" />
                  <Label htmlFor="payante" className="font-normal cursor-pointer">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      💰 Payante
                    </Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
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

            {formData.startTime && formData.endTime && (
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
              <Label htmlFor="maxParticipants">Participants maximum</Label>
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
                          key={person.nom}
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
