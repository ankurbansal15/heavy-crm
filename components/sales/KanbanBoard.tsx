import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
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
  value: number
  stage_id: string
  probability: number
  priority: string
  date_added: string
  position: number
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
  onDragEnd: (result: DropResult) => void
  onMoveStage: (stageId: string, direction: 'forward' | 'backward') => void
  onEditStage: (oldStageId: string, newStageName: string) => void
  onDeleteStage: (stageId: string) => void
  onMoveLead: (lead: Opportunity, direction: 'forward' | 'backward') => void
  onEditLead: (lead: Opportunity) => void
  onDeleteLead: (id: string) => void
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
  const [editingStage, setEditingStage] = useState<string | null>(null)
  const [showingStage, setShowingStage] = useState<string | null>(null)
  const [showingLead, setShowingLead] = useState<Opportunity | null>(null)

  if (!currentPipeline || !currentPipeline.stages) {
    return <div>No pipeline data available.</div>
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="stages" direction="horizontal" type="STAGE">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="flex gap-4 overflow-x-auto pb-4 min-w-max max-w-full">
            {currentPipeline.stages.map((stage, stageIndex) => (
              <Draggable key={stage.id} draggableId={stage.id} index={stageIndex}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="bg-secondary p-4 rounded-lg w-full min-w-[250px] max-w-[350px] flex-1"
                  >
                    <div className="flex flex-wrap justify-between items-center mb-2 gap-2" {...provided.dragHandleProps}>
                      <h3 className="font-semibold truncate mr-2">{stage.name}</h3>
                      <div className="flex flex-wrap gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onMoveStage(stage.id, 'backward')} 
                          disabled={stageIndex === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onMoveStage(stage.id, 'forward')} 
                          disabled={stageIndex === currentPipeline.stages.length - 1}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setShowingStage(stage.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditingStage(stage.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteStage(stage.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {editingStage === stage.id && (
                      <div className="mb-2 flex items-center gap-2">
                        <Input
                          defaultValue={stage.name}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              onEditStage(stage.id, e.currentTarget.value)
                              setEditingStage(null)
                            }
                          }}
                        />
                        <Button size="icon" variant="ghost" onClick={() => setEditingStage(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <Droppable droppableId={stage.id} type="CARD">
                      {(provided, snapshot) => (
                        <div 
                          {...provided.droppableProps} 
                          ref={provided.innerRef}
                          className={`min-h-[50px] ${snapshot.isDraggingOver ? 'bg-secondary/50' : ''}`}
                        >
                          {opportunities
                            .filter((opp) => opp.stage_id === stage.id)
                            .sort((a, b) => a.position - b.position)
                            .map((opp, index) => (
                              <Draggable key={opp.id} draggableId={opp.id} index={index}>
                                {(provided, snapshot) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-2 overflow-hidden ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                  >
                                    <CardContent className="p-3 flex flex-col h-full">                        
                                      <div className="flex flex-wrap justify-between items-start gap-2 flex-grow">
                                        <h4 className="font-medium truncate mr-2">{opp.name}</h4>
                                        <div className="flex flex-wrap gap-1">
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => onMoveLead(opp, 'backward')} 
                                            disabled={index === 0 && stageIndex === 0}
                                          >
                                            <ChevronLeft className="h-4 w-4" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => onMoveLead(opp, 'forward')} 
                                            disabled={index === opportunities.filter((o) => o.stage_id === stage.id).length - 1 && stageIndex === currentPipeline.stages.length - 1}
                                          >
                                            <ChevronRight className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="icon" onClick={() => setShowingLead(opp)}>
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="icon" onClick={() => onEditLead(opp)}>
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="icon" onClick={() => onDeleteLead(opp.id)}>
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        ${opp.value.toLocaleString()}
                                      </p>
                                      <div className="flex justify-between items-center mt-2">
                                        <Badge>{opp.priority}</Badge>
                                        <span className="text-sm">{opp.probability}%</span>
                                      </div>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        Added: {opp.date_added}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Stage Information Dialog */}
      <Dialog open={!!showingStage} onOpenChange={() => setShowingStage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stage Information: {showingStage}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p><strong>Pipeline:</strong> {currentPipeline.name}</p>
            <p><strong>Position:</strong> {currentPipeline.stages.findIndex(stage => stage.id === showingStage) + 1} of {currentPipeline.stages.length}</p>
            <p><strong>Opportunities:</strong> {opportunities.filter(opp => opp.stage_id === showingStage).length}</p>
            <p><strong>Total Value:</strong> ${opportunities.filter(opp => opp.stage_id === showingStage).reduce((sum, opp) => sum + opp.value, 0).toLocaleString()}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead Information Dialog */}
      <Dialog open={!!showingLead} onOpenChange={() => setShowingLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lead Information: {showingLead?.name}</DialogTitle>
          </DialogHeader>
          {showingLead && (
            <div className="mt-4">
              <p><strong>Value:</strong> ${showingLead.value.toLocaleString()}</p>
              <p><strong>Stage:</strong> {currentPipeline.stages.find(stage => stage.id === showingLead.stage_id)?.name}</p>
              <p><strong>Probability:</strong> {showingLead.probability}%</p>
              <p><strong>Priority:</strong> {showingLead.priority}</p>
              <p><strong>Pipeline:</strong> {currentPipeline.name}</p>
              <p><strong>Date Added:</strong> {showingLead.date_added}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DragDropContext>
  )
}

