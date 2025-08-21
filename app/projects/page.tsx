'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProjectBoard } from "@/components/projects/ProjectBoard"
import { Project, ProjectPipeline } from "@/types/project"
import { supabase } from '@/lib/supabase'

export default function ProjectsPage() {
  const [pipelines, setPipelines] = useState<ProjectPipeline[]>([])
  const [currentPipeline, setCurrentPipeline] = useState<ProjectPipeline | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isAddPipelineDialogOpen, setIsAddPipelineDialogOpen] = useState(false)
  const [newPipelineName, setNewPipelineName] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchPipelines()
      fetchProjects()
    }
  }, [user])

  useEffect(() => {
    if (pipelines.length > 0 && !currentPipeline) {
      setCurrentPipeline(pipelines[0])
    }
  }, [pipelines, currentPipeline])

  useEffect(() => {
    let result = projects
    
    if (currentPipeline) {
      result = result.filter(project => currentPipeline.stages.some(stage => stage.id === project.stage_id))
    }
    
    if (searchTerm) {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.priority.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    
    setFilteredProjects(result)
  }, [projects, searchTerm, sortConfig, currentPipeline])

  const fetchPipelines = async () => {
    const { data: pipelinesData, error: pipelinesError } = await supabase
      .from('project_pipelines')
      .select('*')
    
    if (pipelinesError) {
      console.error('Error fetching pipelines:', pipelinesError)
      return
    }

    const { data: stagesData, error: stagesError } = await supabase
      .from('project_stages')
      .select('*')
      .order('position')

    if (stagesError) {
      console.error('Error fetching stages:', stagesError)
      return
    }

    const pipelinesWithStages = pipelinesData.map(pipeline => ({
      ...pipeline,
      stages: stagesData.filter(stage => stage.pipeline_id === pipeline.id)
    }))

    setPipelines(pipelinesWithStages)
  }

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('position')
    
    if (error) {
      console.error('Error fetching projects:', error)
      return
    }

    setProjects(data)
  }

  const handleAddPipeline = async () => {
    if (!user || !newPipelineName.trim()) return

    const { data: newPipeline, error: pipelineError } = await supabase
      .from('project_pipelines')
      .insert([{ name: newPipelineName, user_id: user.id }])
      .select()

    if (pipelineError) {
      console.error('Error adding pipeline:', pipelineError)
      return
    }

    // Add default stages
    const defaultStages = ['Planning', 'In Progress', 'Review', 'Completed']
    const stageInserts = defaultStages.map((stageName, index) => ({
      name: stageName,
      pipeline_id: newPipeline[0].id,
      position: index,
      user_id: user.id
    }))

    const { data: newStages, error: stagesError } = await supabase
      .from('project_stages')
      .insert(stageInserts)
      .select()

    if (stagesError) {
      console.error('Error adding default stages:', stagesError)
      return
    }

    const newPipelineWithStages = {
      ...newPipeline[0],
      stages: newStages
    }

    setPipelines([...pipelines, newPipelineWithStages])
    setCurrentPipeline(newPipelineWithStages)
    setNewPipelineName('')
    setIsAddPipelineDialogOpen(false)
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !currentPipeline) return

    const { source, destination, draggableId, type } = result

    if (type === 'STAGE') {
      const newStages = Array.from(currentPipeline.stages)
      const [reorderedStage] = newStages.splice(source.index, 1)
      newStages.splice(destination.index, 0, reorderedStage)

      const updatedPipeline = { ...currentPipeline, stages: newStages }
      setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
      setCurrentPipeline(updatedPipeline)

      const updates = newStages.map((stage, index) => ({
        id: stage.id,
        name: stage.name,
        position: index,
        user_id: user?.id,
        pipeline_id: currentPipeline.id
      }))

      const { error } = await supabase
        .from('project_stages')
        .upsert(updates, { onConflict: 'id' })

      if (error) {
        console.error('Error updating stage positions:', error)
      }
    } else {
      const sourceStage = currentPipeline.stages.find(stage => stage.id === source.droppableId)
      const destinationStage = currentPipeline.stages.find(stage => stage.id === destination.droppableId)

      if (sourceStage && destinationStage) {
        const updatedProjects = [...projects]
        const [movedProject] = updatedProjects.splice(
          updatedProjects.findIndex(project => project.id === draggableId),
          1
        )

        movedProject.stage_id = destinationStage.id
        movedProject.position = destination.index

        updatedProjects.splice(
          updatedProjects.findIndex(project => project.stage_id === destinationStage.id) + destination.index,
          0,
          movedProject
        )

        const finalProjects = updatedProjects.map(project => {
          if (project.stage_id === sourceStage.id || project.stage_id === destinationStage.id) {
            const stageProjects = updatedProjects.filter(p => p.stage_id === project.stage_id)
            const position = stageProjects.findIndex(p => p.id === project.id)
            return { ...project, position }
          }
          return project
        })

        setProjects(finalProjects)

        const { error } = await supabase
          .from('projects')
          .upsert(
            finalProjects
              .filter(project => project.stage_id === sourceStage.id || project.stage_id === destinationStage.id)
              .map(project => ({
                id: project.id,
                stage_id: project.stage_id,
                position: project.position
              })),
            { onConflict: 'id' }
          )

        if (error) {
          console.error('Error updating projects:', error)
        }
      }
    }
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const handleAddProject = async (newProject) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ 
        ...newProject, 
        stage_id: currentPipeline.stages[0].id,
        user_id: user.id,
        position: projects.filter(project => project.stage_id === currentPipeline.stages[0].id).length
      }])
      .select()

    if (error) {
      console.error('Error adding project:', error)
    } else if (data) {
      setProjects([...projects, data[0]])
    }
  }

  const handleEditProject = async (editedProject) => {
    const { error } = await supabase
      .from('projects')
      .update(editedProject)
      .eq('id', editedProject.id)

    if (error) {
      console.error('Error updating project:', error)
    } else {
      setProjects(projects.map(project => project.id === editedProject.id ? editedProject : project))
    }
    setEditingProject(null)
  }

  const handleDeleteProject = async (id) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
    } else {
      setProjects(projects.filter(project => project.id !== id))
    }
  }

  const handleAddStage = async (newStageName) => {
    const { data, error } = await supabase
      .from('project_stages')
      .insert([{ 
        name: newStageName, 
        pipeline_id: currentPipeline.id,
        position: currentPipeline.stages.length,
        user_id: user.id
      }])
      .select()

    if (error) {
      console.error('Error adding stage:', error)
    } else if (data) {
      const updatedPipeline = { 
        ...currentPipeline, 
        stages: [...currentPipeline.stages, data[0]]
      }
      setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
      setCurrentPipeline(updatedPipeline)
    }
  }

  const handleEditStage = async (oldStageId, newStageName) => {
    const { error } = await supabase
      .from('project_stages')
      .update({ name: newStageName })
      .eq('id', oldStageId)

    if (error) {
      console.error('Error updating stage:', error)
    } else {
      const updatedStages = currentPipeline.stages.map(stage => 
        stage.id === oldStageId ? { ...stage, name: newStageName } : stage
      )
      const updatedPipeline = { ...currentPipeline, stages: updatedStages }
      setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
      setCurrentPipeline(updatedPipeline)
    }
  }

  const handleDeleteStage = async (stageId) => {
    const { error } = await supabase
      .from('project_stages')
      .delete()
      .eq('id', stageId)

    if (error) {
      console.error('Error deleting stage:', error)
    } else {
      const updatedStages = currentPipeline.stages.filter(s => s.id !== stageId)
      const updatedPipeline = { ...currentPipeline, stages: updatedStages }
      setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
      setCurrentPipeline(updatedPipeline)
      setProjects(projects.filter(project => project.stage_id !== stageId))
    }
  }

  const handleMoveStage = async (stageId: string, direction: 'forward' | 'backward') => {
    if (!currentPipeline) return

    const stage = currentPipeline.stages.find(s => s.id === stageId)
    if (!stage) return

    const currentIndex = currentPipeline.stages.findIndex(s => s.id === stageId)
    const newIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1

    if (newIndex >= 0 && newIndex < currentPipeline.stages.length) {
      const newStages = [...currentPipeline.stages]
      newStages.splice(currentIndex, 1)
      newStages.splice(newIndex, 0, stage)

      // Update all stage positions based on their new order
      const updatedStages = newStages.map((s, index) => ({
        ...s,
        position: index
      }))

      const updates = updatedStages.map(s => ({
        id: s.id,
        name: s.name,
        position: s.position,
        user_id: user?.id,
        pipeline_id: currentPipeline.id
      }))

      const { error } = await supabase
        .from('project_stages')
        .upsert(updates, { onConflict: 'id' })

      if (error) {
        console.error('Error updating stage positions:', error)
      } else {
        const updatedPipeline = { ...currentPipeline, stages: updatedStages }
        setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
        setCurrentPipeline(updatedPipeline)
      }
    }
  }

  const handleMoveProject = async (project: Project, direction: 'forward' | 'backward') => {
    if (!currentPipeline) return

    const currentStageIndex = currentPipeline.stages.findIndex(stage => stage.id === project.stage_id)
    const newStageIndex = direction === 'forward' ? currentStageIndex + 1 : currentStageIndex - 1

    if (newStageIndex >= 0 && newStageIndex < currentPipeline.stages.length) {
      const newStage = currentPipeline.stages[newStageIndex]
      const updatedProjects = projects.map(p => {
        if (p.id === project.id) {
          return { ...p, stage_id: newStage.id, position: projects.filter(o => o.stage_id === newStage.id).length }
        }
        return p
      })

      setProjects(updatedProjects)

      const { error } = await supabase
        .from('projects')
        .update({ stage_id: newStage.id, position: updatedProjects.find(p => p.id === project.id)?.position })
        .eq('id', project.id)

      if (error) {
        console.error('Error moving project:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-bounce-gentle"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between animate-fade-in">
            <div className="space-y-3">
              <h1 className="text-heading-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                Project Management
              </h1>
              <p className="text-body text-muted-foreground">
                Organize and track your projects with customizable pipelines
              </p>
              <div className="flex items-center gap-2 text-caption text-primary">
                <PlusCircle className="w-4 h-4" />
                {filteredProjects.length} PROJECTS
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={currentPipeline?.id} onValueChange={(value) => setCurrentPipeline(pipelines.find(p => p.id === value))}>
                <SelectTrigger className="glass-effect border-0 shadow-lg hover-lift min-w-[200px]">
                  <SelectValue placeholder="Select pipeline" />
                </SelectTrigger>
                <SelectContent>
                  {pipelines.map((pipeline) => (
                    <SelectItem key={pipeline.id} value={pipeline.id}>{pipeline.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isAddPipelineDialogOpen} onOpenChange={setIsAddPipelineDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="glass-effect border-0 shadow-lg hover-lift">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Pipeline
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-effect border-0 shadow-xl">
                  <DialogHeader>
                    <DialogTitle className="text-heading-4">Add New Pipeline</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Pipeline Name</Label>
                      <Input
                        id="name"
                        value={newPipelineName}
                        onChange={(e) => setNewPipelineName(e.target.value)}
                        placeholder="Enter pipeline name"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddPipeline} className="btn-primary">Add Pipeline</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8">
        <Card className="card-elevated glass-effect border-0 shadow-xl animate-fade-in">
          <CardHeader className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-heading-4 flex items-center gap-2">
                Project Board
                <span className="text-sm font-normal text-muted-foreground">
                  ({filteredProjects.length} projects)
                </span>
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="glass-effect border-0 shadow-md hover-lift">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Stage
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-effect border-0 shadow-xl">{" "}
              <DialogHeader>
                <DialogTitle>Add New Stage</DialogTitle>
              </DialogHeader>
              <Input id="newStage" placeholder="Enter new stage name" />
              <DialogFooter>
                <Button onClick={() => handleAddStage(document.getElementById('newStage').value)}>Add Stage</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardDescription className="px-6">Drag and drop projects to update their stage</CardDescription>
        <div className="px-6 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleSort('deadline')}>Sort by Deadline</Button>
            <Button onClick={() => handleSort('priority')}>Sort by Priority</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input id="deadline" type="date" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="budget">Budget</Label>
                      <Input id="budget" type="number" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="assigned">Assigned To</Label>
                      <Input id="assigned" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => handleAddProject({
                    name: document.getElementById('name').value,
                    description: document.getElementById('description').value,
                    deadline: document.getElementById('deadline').value,
                    priority: document.getElementById('priority').value,
                    budget: Number(document.getElementById('budget').value),
                    spent: 0,
                    assigned_to: document.getElementById('assigned').value,
                    status: 'Not Started'
                  })}>Add Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[calc(400px*3)] w-full">
            <ProjectBoard
              projects={filteredProjects}
              currentPipeline={currentPipeline}
              onDragEnd={handleDragEnd}
              onMoveStage={handleMoveStage}
              onEditStage={handleEditStage}
              onDeleteStage={handleDeleteStage}
              onMoveProject={handleMoveProject}
              onEditProject={setEditingProject}
              onDeleteProject={handleDeleteProject}
            />
          </div>
        </CardContent>
      </Card>

      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" defaultValue={editingProject.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" defaultValue={editingProject.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-deadline">Deadline</Label>
                  <Input id="edit-deadline" type="date" defaultValue={editingProject.deadline} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select defaultValue={editingProject.priority}>
                    <SelectTrigger id="edit-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-budget">Budget</Label>
                  <Input id="edit-budget" type="number" defaultValue={editingProject.budget} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-spent">Spent</Label>
                  <Input id="edit-spent" type="number" defaultValue={editingProject.spent} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-assigned">Assigned To</Label>
                <Input id="edit-assigned" defaultValue={editingProject.assigned_to} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleEditProject({
                ...editingProject,
                name: document.getElementById('edit-name').value,
                description: document.getElementById('edit-description').value,
                deadline: document.getElementById('edit-deadline').value,
                priority: document.getElementById('edit-priority').value,
                budget: Number(document.getElementById('edit-budget').value),
                spent: Number(document.getElementById('edit-spent').value),
                assigned_to: document.getElementById('edit-assigned').value,
              })}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

