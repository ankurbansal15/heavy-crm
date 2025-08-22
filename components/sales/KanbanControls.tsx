import { useState } from 'react'
import { Search, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Opportunity } from '@/types/sales'

interface KanbanControlsProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  filteredOpportunities: Opportunity[]
  onSort: (key: keyof Opportunity) => void
  onAddStage: (stageName: string) => void
  onAddLeadClick: () => void
}

export function KanbanControls({
  searchTerm,
  onSearchChange,
  filteredOpportunities,
  onSort,
  onAddStage,
  onAddLeadClick
}: KanbanControlsProps) {
  const [newStageName, setNewStageName] = useState('')
  const [isAddStageOpen, setIsAddStageOpen] = useState(false)

  const handleAddStage = () => {
    if (newStageName.trim()) {
      onAddStage(newStageName)
      setNewStageName('')
      setIsAddStageOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-heading-4 flex items-center gap-2">
            Sales Opportunities Kanban Board
            <span className="text-sm font-normal text-muted-foreground">
              ({filteredOpportunities.length} opportunities)
            </span>
          </h3>
          <p className="text-muted-foreground">Drag and drop opportunities to update their stage</p>
        </div>
        <Dialog open={isAddStageOpen} onOpenChange={setIsAddStageOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="glass-effect border-0 shadow-md hover-lift">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Stage
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect border-0 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-heading-4">Add New Stage</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newStage">Stage Name</Label>
                <Input 
                  id="newStage" 
                  placeholder="Enter new stage name" 
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddStage()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddStage} className="btn-primary">
                Add Stage
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            className="pl-10 w-full sm:w-[300px] glass-effect border-0 shadow-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => onSort('value')} 
            variant="outline" 
            size="sm"
            className="glass-effect border-0 shadow-sm hover-lift"
          >
            Sort by Value
          </Button>
          <Button 
            onClick={() => onSort('probability')} 
            variant="outline" 
            size="sm"
            className="glass-effect border-0 shadow-sm hover-lift"
          >
            Sort by Probability
          </Button>
          <Button 
            onClick={onAddLeadClick}
            className="btn-primary shadow-md hover-lift"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>
    </div>
  )
}
