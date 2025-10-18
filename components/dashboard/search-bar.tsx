import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SearchBar() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Rechercher par nom, téléphone ou email..."
          className="pl-10 bg-white border-gray-200"
        />
      </div>
      <Button variant="outline" size="icon" className="shrink-0">
        <Filter className="h-4 w-4" />
      </Button>
      <Select defaultValue="tous">
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Filtrer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous">Tous</SelectItem>
          <SelectItem value="actifs">Actifs</SelectItem>
          <SelectItem value="inactifs">Inactifs</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
