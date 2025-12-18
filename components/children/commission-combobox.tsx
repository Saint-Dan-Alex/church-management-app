"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { commissionsService, type Commission } from "@/lib/services/commissions.service"
import { toast } from "sonner"

interface CommissionComboboxProps {
    value?: string
    onValueChange: (value: string) => void
    placeholder?: string
}

export function CommissionCombobox({ value, onValueChange, placeholder = "Sélectionner une commission..." }: CommissionComboboxProps) {
    const [open, setOpen] = useState(false)
    const [commissions, setCommissions] = useState<Commission[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchValue, setSearchValue] = useState("")

    useEffect(() => {
        loadCommissions()
    }, [])

    const loadCommissions = async () => {
        try {
            setIsLoading(true)
            const data = await commissionsService.getAll()
            setCommissions(data)
        } catch (error) {
            console.error("Erreur lors du chargement des commissions:", error)
            toast.error("Impossible de charger les commissions")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateCommission = async () => {
        if (!searchValue.trim()) return

        try {
            const newCommission = await commissionsService.create({ nom: searchValue.trim() })
            setCommissions([...commissions, newCommission])
            onValueChange(newCommission.nom)
            setSearchValue("")
            setOpen(false)
            toast.success(`Commission "${newCommission.nom}" créée avec succès`)
        } catch (error) {
            console.error("Erreur lors de la création de la commission:", error)
            toast.error("Impossible de créer la commission")
        }
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onValueChange("")
    }

    const selectedCommission = commissions.find((c) => c.nom === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <span className="truncate">{selectedCommission ? selectedCommission.nom : placeholder}</span>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                        {selectedCommission && (
                            <X
                                className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity"
                                onClick={handleClear}
                            />
                        )}
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder="Rechercher ou créer..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandEmpty>
                        <div className="p-2">
                            <p className="text-sm text-muted-foreground mb-2">Aucune commission trouvée.</p>
                            {searchValue.trim() && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={handleCreateCommission}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Créer "{searchValue}"
                                </Button>
                            )}
                        </div>
                    </CommandEmpty>
                    <CommandGroup>
                        {isLoading ? (
                            <div className="p-2 text-sm text-muted-foreground">Chargement...</div>
                        ) : (
                            commissions.map((commission) => (
                                <CommandItem
                                    key={commission.id}
                                    value={commission.nom}
                                    onSelect={(currentValue) => {
                                        onValueChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === commission.nom ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {commission.nom}
                                </CommandItem>
                            ))
                        )}
                    </CommandGroup>
                    {!isLoading && searchValue.trim() && !commissions.some(c => c.nom.toLowerCase() === searchValue.toLowerCase()) && (
                        <div className="border-t p-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                                onClick={handleCreateCommission}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Créer "{searchValue}"
                            </Button>
                        </div>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    )
}
