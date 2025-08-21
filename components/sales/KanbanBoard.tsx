import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Opportunity {
  id: string
  name: string
  company?: string
  contact_name?: string
  email?: string
  phone?: string
  value: number
  stage_id: string
  probability: number
  priority: string
  position: number
  close_date?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

interface Pipeline {
  id: string
  name: string
  stages: Stage[]
}

interface Stage {
  id: string
  name: string
  position: number
}

interface KanbanBoardProps {
  opportunities: Opportunity[]
  currentPipeline: Pipeline | null
  onDragEnd: (result: { active: any; over: any }) => void
  onMoveStage: (stageId: string, direction: 'forward' | 'backward') => void
  onEditStage: (oldStageId: string, newStageName: string) => void
  onDeleteStage: (stageId: string) => void
  onMoveLead: (lead: Opportunity, direction: 'forward' | 'backward') => void
  onEditLead: (lead: Opportunity) => void
  onDeleteLead: (id: string) => void
}

// Sortable Stage Component
function SortableStage({ stage, opportunities, onEditStage, onDeleteStage, onMoveLead, onEditLead, onDeleteLead }: {
  stage: Stage
  opportunities: Opportunity[]
  onEditStage: (stageId: string, newName: string) => void
  onDeleteStage: (stageId: string) => void
  onMoveLead: (lead: Opportunity, direction: 'forward' | 'backward') => void
  onEditLead: (lead: Opportunity) => void
  onDeleteLead: (id: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(stage.name)
  const [viewingLead, setViewingLead] = useState<Opportunity | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: stage.id,
    data: {
      type: 'stage',
      stage,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const stageOpportunities = opportunities.filter(opp => opp.stage_id === stage.id)
    .sort((a, b) => (a.position || 0) - (b.position || 0))

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== stage.name) {
      onEditStage(stage.id, editName.trim())
    }
    setIsEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="min-w-[350px] bg-muted/50 rounded-lg p-4 space-y-4"
    >
      <div className="flex items-center justify-between" {...attributes} {...listeners}>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                className="h-8 text-sm"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveEdit} className="h-8 px-2">
                ✓
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setIsEditing(false)
                  setEditName(stage.name)
                }} 
                className="h-8 px-2"
              >
                ✕
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-lg cursor-grab">{stage.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {stageOpportunities.length}
              </Badge>
            </>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDeleteStage(stage.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <SortableContext
        items={stageOpportunities.map(opp => opp.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[200px]">
          {stageOpportunities.map((opportunity) => (
            <SortableOpportunity
              key={opportunity.id}
              opportunity={opportunity}
              onMoveLead={onMoveLead}
              onEditLead={onEditLead}
              onDeleteLead={onDeleteLead}
              onViewLead={setViewingLead}
            />
          ))}
        </div>
      </SortableContext>

      {viewingLead && (
        <Dialog open={!!viewingLead} onOpenChange={() => setViewingLead(null)}>
          <DialogContent className="glass-effect border-0 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-heading-4">Lead Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Name:</span> {viewingLead.name}
              </div>
              <div>
                <span className="font-medium">Value:</span> ${viewingLead.value?.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Probability:</span> {viewingLead.probability}%
              </div>
              <div>
                <span className="font-medium">Priority:</span>
                <Badge variant={viewingLead.priority === 'High' ? 'destructive' : viewingLead.priority === 'Medium' ? 'default' : 'secondary'} className="ml-2">
                  {viewingLead.priority}
                </Badge>
              </div>
              {viewingLead.company && (
                <div>
                  <span className="font-medium">Company:</span> {viewingLead.company}
                </div>
              )}
              {viewingLead.contact_name && (
                <div>
                  <span className="font-medium">Contact:</span> {viewingLead.contact_name}
                </div>
              )}
              {viewingLead.email && (
                <div>
                  <span className="font-medium">Email:</span> {viewingLead.email}
                </div>
              )}
              {viewingLead.phone && (
                <div>
                  <span className="font-medium">Phone:</span> {viewingLead.phone}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Sortable Opportunity Component
function SortableOpportunity({ opportunity, onMoveLead, onEditLead, onDeleteLead, onViewLead }: {
  opportunity: Opportunity
  onMoveLead: (lead: Opportunity, direction: 'forward' | 'backward') => void
  onEditLead: (lead: Opportunity) => void
  onDeleteLead: (id: string) => void
  onViewLead: (lead: Opportunity) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: opportunity.id,
    data: {
      type: 'opportunity',
      opportunity,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-sm line-clamp-2">{opportunity.name}</h4>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onViewLead(opportunity)
              }}
              className="h-6 w-6 p-0"
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onEditLead(opportunity)
              }}
              className="h-6 w-6 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteLead(opportunity.id)
              }}
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>${opportunity.value?.toLocaleString()}</span>
          <span>{opportunity.probability}%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant={getPriorityColor(opportunity.priority)} className="text-xs">
            {opportunity.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export function KanbanBoard({ 
  opportunities, 
  currentPipeline, 
  onDragEnd, 
  onMoveStage, 
  onEditStage, 
  onDeleteStage, 
  onMoveLead, 
  onEditLead, 
  onDeleteLead 
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required to start drag
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString())
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setActiveId(null)
      return
    }

    // Pass the drag result to the parent component
    onDragEnd({ active, over })
    setActiveId(null)
  }

  if (!currentPipeline) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No pipeline selected</p>
      </div>
    )
  }

  const sortedStages = [...currentPipeline.stages].sort((a, b) => a.position - b.position)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto">
        <div className="flex space-x-6 min-h-[600px] pb-4">
          <SortableContext
            items={sortedStages.map(stage => stage.id)}
            strategy={horizontalListSortingStrategy}
          >
            {sortedStages.map((stage) => (
              <SortableStage
                key={stage.id}
                stage={stage}
                opportunities={opportunities}
                onEditStage={onEditStage}
                onDeleteStage={onDeleteStage}
                onMoveLead={onMoveLead}
                onEditLead={onEditLead}
                onDeleteLead={onDeleteLead}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </DndContext>
  )
}

