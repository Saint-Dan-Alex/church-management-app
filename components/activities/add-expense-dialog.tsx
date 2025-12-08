"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { activitiesService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

const expenseSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  montant: z.coerce.number().min(0, "Le montant doit être positif"),
  devise: z.enum(["CDF", "USD"]),
  categorie: z.string().min(1, "La catégorie est requise"),
  date: z.date(),
  description: z.string().optional(),
})

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activityId: string
  activityName: string
  onSuccess: () => void
  maxAuthorizedAmount?: number
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  activityId,
  activityName,
  onSuccess,
  maxAuthorizedAmount,
}: AddExpenseDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      titre: "",
      montant: 0,
      devise: "CDF",
      categorie: "transport", // Valeur par défaut valide
      date: new Date(),
      description: "",
    },
  })

  // Reset form when opening
  // (Optional: use useEffect if needed)

  const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
    // Validation du budget
    if (maxAuthorizedAmount !== undefined && values.montant > maxAuthorizedAmount) {
      form.setError("montant", {
        type: "manual",
        message: `Montant supérieur au budget disponible (${maxAuthorizedAmount.toLocaleString()} ${values.devise})`
      })
      toast({
        title: "Budget dépassé",
        description: `Le montant de la dépense dépasse les fonds disponibles (${maxAuthorizedAmount.toLocaleString()})`,
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      // ... suite du code

      const payload = {
        activity_id: activityId,
        activity_nom: activityName,
        // Le backend n'a pas de champ titre, on le met au début de la description
        description: `[${values.titre}] ${values.description || ''}`.trim(),
        montant: values.montant,
        devise: values.devise,
        date: values.date.toISOString().split('T')[0],
        categorie: values.categorie,
        // Champs user (devraient venir du contexte auth, on hardcode pour l'instant comme avant)
        ajoute_par: "019afd76-9372-739c-8911-b9aaf32a0f81", // Un ID UUID valide (ex: user connecté)
        ajoute_par_nom: "Admin",
      }

      await activitiesService.addExpense(payload)

      toast({
        title: "Dépense enregistrée",
        description: "La dépense a été ajoutée avec succès.",
      })
      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement de la dépense.",
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
          <DialogTitle>Ajouter une dépense</DialogTitle>
          <DialogDescription>
            Enregistrez une dépense liée à l'activité "{activityName}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre (intitulé court)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Achat boissons" {...field} />
                  </FormControl>
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
              name="categorie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="repas">Repas</SelectItem>
                      <SelectItem value="materiel">Matériel</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                      <SelectItem value="decoration">Décoration</SelectItem>
                      <SelectItem value="sonorisation">Sonorisation</SelectItem>
                      <SelectItem value="honoraires">Honoraires</SelectItem>
                      <SelectItem value="cadeaux">Cadeaux</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optionnel)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Détails supplémentaires..." {...field} />
                  </FormControl>
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
