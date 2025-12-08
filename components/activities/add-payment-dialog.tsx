"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { activitiesService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"
import { childrenService } from "@/lib/services/children.service"
import { monitorsService } from "@/lib/services/monitors.service"

const paymentSchema = z.object({
  participant_id: z.string().optional(),
  participant_nom: z.string().min(1, "Le nom est requis"),
  participant_prenom: z.string().optional(),
  montant: z.coerce.number().min(0, "Le montant doit être positif"),
  devise: z.enum(["CDF", "USD"]),
  methode_paiement: z.string().min(1, "Méthode de paiement requise"),
  date_paiement: z.date(),
  remarque: z.string().optional(),
})

interface AddPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activityId: string
  activityName: string
  defaultPrice?: number
  defaultCurrency?: "CDF" | "USD"
  onSuccess: () => void
}

export function AddPaymentDialog({
  open,
  onOpenChange,
  activityId,
  activityName,
  defaultPrice = 0,
  defaultCurrency = "CDF",
  onSuccess,
}: AddPaymentDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [people, setPeople] = useState<Array<{ id: string, nom: string, prenom: string, type: string }>>([])
  const [comboboxOpen, setComboboxOpen] = useState(false)

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      montant: defaultPrice,
      devise: defaultCurrency,
      methode_paiement: "cash",
      date_paiement: new Date(),
      participant_nom: "",
      participant_prenom: "",
    },
  })

  // Charger les gens (participants potentiels)
  useEffect(() => {
    const loadPeople = async () => {
      try {
        const [children, monitors] = await Promise.all([
          childrenService.getAll(),
          monitorsService.getAll()
        ])
        const childrenData = Array.isArray(children) ? children : (children as any).data || []
        const monitorsData = Array.isArray(monitors) ? monitors : (monitors as any).data || []

        const allPeople = [
          ...childrenData.map((c: any) => ({ id: c.id, nom: c.nom, prenom: c.prenom, type: 'Enfant' })),
          ...monitorsData.map((m: any) => ({ id: m.id, nom: m.nom, prenom: m.prenom, type: 'Moniteur' }))
        ]
        setPeople(allPeople)
      } catch (e) {
        console.error("Erreur chargement personnes", e)
      }
    }
    if (open) {
      loadPeople()
      // Reset form values when opening
      form.reset({
        montant: defaultPrice,
        devise: defaultCurrency,
        methode_paiement: "cash",
        date_paiement: new Date(),
        participant_nom: "",
        participant_prenom: "",
      })
    }
  }, [open, defaultPrice, defaultCurrency, form])

  const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
    try {
      setIsSubmitting(true)

      const payload = {
        activity_id: activityId,
        activity_nom: activityName,
        participant_id: values.participant_id || null, // Peut être null pour visiteur
        participant_nom: values.participant_nom,
        participant_prenom: values.participant_prenom || "",
        participant_nom_complet: `${values.participant_prenom || ''} ${values.participant_nom}`.trim(),
        montant: values.montant,
        devise: values.devise,
        methode_paiement: values.methode_paiement,
        date_paiement: values.date_paiement.toISOString().split('T')[0],
        date_echeance: values.date_paiement.toISOString().split('T')[0], // Par défaut aujourd'hui
        statut: "paid", // Directement payé
        numero_paiement: `PAY-${Date.now()}`, // Génération auto simple
        remarque: values.remarque
      }

      await activitiesService.addPayment(payload)

      toast({
        title: "Paiement enregistré",
        description: "Le paiement a été ajouté avec succès.",
      })
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement du paiement.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Enregistrez un paiement pour l'activité "{activityName}".
            Cela inscrira automatiquement la personne si elle ne l'est pas déjà.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="participant_nom"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Participant</FormLabel>
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? `${form.getValues("participant_prenom")} ${field.value}`.trim()
                            : "Sélectionner ou saisir un nom"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher..." />
                        <CommandEmpty>
                          <div className="p-2 text-sm text-center">
                            Personne introuvable.
                            <Button variant="link" size="sm" onClick={() => {
                              // Saisie manuelle implicite si on ferme sans choisir
                              setComboboxOpen(false)
                            }}>
                              Continuer pour saisir manuellement (fermer)
                            </Button>
                          </div>
                        </CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-auto">
                          {people.map((person) => (
                            <CommandItem
                              key={person.id + person.type}
                              value={`${person.prenom} ${person.nom}`}
                              onSelect={() => {
                                form.setValue("participant_id", person.id)
                                form.setValue("participant_nom", person.nom)
                                form.setValue("participant_prenom", person.prenom)
                                setComboboxOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  person.id === form.getValues("participant_id")
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {person.prenom} {person.nom}
                              <span className="ml-auto text-xs text-muted-foreground">{person.type}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nom"
                      {...form.register("participant_nom")}
                      className={cn(form.getValues("participant_id") ? "bg-gray-100" : "")}
                      readOnly={!!form.getValues("participant_id")}
                    />
                    <Input
                      placeholder="Prénom"
                      {...form.register("participant_prenom")}
                      className={cn(form.getValues("participant_id") ? "bg-gray-100" : "")}
                      readOnly={!!form.getValues("participant_id")}
                    />
                  </div>
                  {form.getValues("participant_id") && (
                    <Button variant="ghost" size="sm" onClick={() => {
                      form.setValue("participant_id", undefined)
                      form.setValue("participant_nom", "")
                      form.setValue("participant_prenom", "")
                    }} type="button" className="h-6 text-xs text-red-500">
                      Effacer la sélection
                    </Button>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="montant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="devise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devise</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Devise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CDF">CDF</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="methode_paiement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de paiement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Espèces</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="bank_transfer">Virement Bancaire</SelectItem>
                      <SelectItem value="card">Carte Bancaire</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_paiement"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date du paiement</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Choisir une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
