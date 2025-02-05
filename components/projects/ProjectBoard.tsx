import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2, ChevronLeft, ChevronRight, X, Eye, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Project, ProjectPipeline } from "@/types/project"
import { format } from "date-fns"

interface ProjectBoardProps {
  projects: Project[]
  currentPipeline: ProjectPipeline | null
  onDragEnd: (result: DropResult) => void
  onMoveStage: (stageId: string, direction: 'forward' | 'backward') => void
  onEditStage: (oldStageId: string, newStageName: string) => void
  onDeleteStage: (stageId: string) => void
  onMoveProject: (project: Project, direction: 'forward' | 'backward') => void
  onEditProject: (project: Project) => void
  onDeleteProject: (id: string) => void
}

export function ProjectBoard({
  projects,
  currentPipeline,
  onDragEnd,
  onMoveStage,
  onEditStage,
  onDeleteStage,
  onMoveProject,
  onEditProject,
  onDeleteProject
}: ProjectBoardProps) {
  const [editingStage, setEditingStage] = useState<string | null>(null)
  const [showingStage, setShowingStage] = useState<string | null>(null)
  const [showingProject, setShowingProject] = useState<Project | null>(null)

  if (!currentPipeline || !currentPipeline.stages) {
    return <div>No pipeline data available.</div>
  }

  const getBudgetStatus = (project: Project) => {
    const percentage = (project.spent / project.budget) * 100
    if (percentage > 100) return 'text-red-500'
    if (percentage > 75) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getDeadlineStatus = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysLeft < 0) return 'text-red-500'
    if (daysLeft <= 7) return 'text-yellow-500'
    return 'text-green-500'
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
                    className="bg-secondary p-4 rounded-lg w-full min-w-[300px] max-w-[400px] flex-1"
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
                          {projects
                            .filter((project) => project.stage_id === stage.id)
                            .sort((a, b) => a.position - b.position)
                            .map((project, index) => (
                              <Draggable key={project.id} draggableId={project.id} index={index}>
                                {(provided, snapshot) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-2 overflow-hidden ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                  >
                                    <CardContent className="p-3 flex flex-col h-full">                        
                                      <div className="flex flex-wrap justify-between items-start gap-2 flex-grow">
                                        <h4 className="font-medium truncate mr-2">{project.name}</h4>
                                        <div className="flex flex-wrap gap-1">
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => onMoveProject(project, 'backward')} 
                                            disabled={index === 0 && stageIndex === 0}
                                          >
                                            <ChevronLeft className="h-4 w-4" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => onMoveProject(project, 'forward')} 
                                            disabled={index === projects.filter((p) => p.stage_id === stage.id).length - 1 && stageIndex === currentPipeline.stages.length - 1}
                                          >
                                            <ChevronRight className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="icon" onClick={() => setShowingProject(project)}>
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="icon" onClick={() => onEditProject(project)}>
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="icon" onClick={() => onDeleteProject(project.id)}>
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {project.description}
                                      </p>
                                      <div className="flex justify-between items-center mt-2">
                                        <Badge variant={project.priority === 'High' ? 'destructive' : project.priority === 'Medium' ? 'default' : 'secondary'}>
                                          {project.priority}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                          <span className={`text-sm ${getBudgetStatus(project)}`}>
                                            ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span className={getDeadlineStatus(project.deadline)}>
                                          {format(new Date(project.deadline), 'MMM dd, yyyy')}
                                        </span>
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
            <DialogTitle>Stage Information: {currentPipeline.stages.find(s => s.id === showingStage)?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p><strong>Pipeline:</strong> {currentPipeline.name}</p>
            <p><strong>Position:</strong> {currentPipeline.stages.findIndex(stage => stage.id === showingStage) + 1} of {currentPipeline.stages.length}</p>
            <p><strong>Projects:</strong> {projects.filter(project => project.stage_id === showingStage).length}</p>
            <p><strong>Total Budget:</strong> ${projects.filter(project => project.stage_id === showingStage).reduce((sum, project) => sum + project.budget, 0).toLocaleString()}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Information Dialog */}
      <Dialog open={!!showingProject} onOpenChange={() => setShowingProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Project Information: {showingProject?.name}</DialogTitle>
          </DialogHeader>
          {showingProject && (
            <div className="mt-4 space-y-2">
              <p><strong>Description:</strong> {showingProject.description}</p>
              <p><strong>Stage:</strong> {currentPipeline.stages.find(stage => stage.id === showingProject.stage_id)?.name}</p>
              <p><strong>Status:</strong> {showingProject.status}</p>
              <p><strong>Priority:</strong> {showingProject.priority}</p>
              <p><strong>Budget:</strong> ${showingProject.budget.toLocaleString()}</p>
              <p><strong>Spent:</strong> ${showingProject.spent.toLocaleString()}</p>
              <p><strong>Deadline:</strong> {format(new Date(showingProject.deadline), 'MMMM dd, yyyy')}</p>
              <p><strong>Assigned To:</strong> {showingProject.assigned_to}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DragDropContext>
  )
}

