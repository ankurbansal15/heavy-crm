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
  interface SortConfig { key: keyof Project | null; direction: 'ascending' | 'descending' }
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ascending' })
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editFields, setEditFields] = useState({
    name: '',
    description: '',
    deadline: '',
    priority: '' as Project['priority'] | '',
    budget: '',
    spent: '',
    assigned_to: ''
  })
  const [isAddPipelineDialogOpen, setIsAddPipelineDialogOpen] = useState(false)
  const [newPipelineName, setNewPipelineName] = useState('')
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false)
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    deadline: '',
    priority: '' as Project['priority'] | '',
    budget: '',
    assigned_to: ''
  })
  const [isAddStageDialogOpen, setIsAddStageDialogOpen] = useState(false)
  const [newStageNameInput, setNewStageNameInput] = useState('')
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
  let result = [...projects]
    
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
        const aVal = a[sortConfig.key!]
        const bVal = b[sortConfig.key!]
        if (aVal == null && bVal == null) return 0
        if (aVal == null) return 1
        if (bVal == null) return -1
        if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1
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

  const handleSort = (key: keyof Project) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const handleAddProject = async (newProject: Partial<Project>) => {
    if (!currentPipeline || !user) return
    if (!newProject.name || !newProject.priority) return
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

  const handleEditProject = async (editedProject: Project) => {
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

  const handleDeleteProject = async (id: string) => {
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

  const handleAddStage = async (newStageName: string) => {
    if (!currentPipeline || !user || !newStageName.trim()) return
    const { data, error } = await supabase
      .from('project_stages')
      .insert([{ 
        name: newStageName, 
        pipeline_id: currentPipeline!.id,
        position: currentPipeline!.stages.length,
        user_id: user!.id
      }])
      .select()

    if (error) {
      console.error('Error adding stage:', error)
    } else if (data) {
      const updatedPipeline: ProjectPipeline = { 
        ...currentPipeline!, 
        stages: [...currentPipeline!.stages, data[0]]
      }
      setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
      setCurrentPipeline(updatedPipeline)
    }
  }

  const handleEditStage = async (oldStageId: string, newStageName: string) => {
    if (!currentPipeline) return
    const { error } = await supabase
      .from('project_stages')
      .update({ name: newStageName })
      .eq('id', oldStageId)

    if (error) {
      console.error('Error updating stage:', error)
    } else {
      const updatedStages = currentPipeline!.stages.map(stage => 
        stage.id === oldStageId ? { ...stage, name: newStageName } : stage
      )
      const updatedPipeline: ProjectPipeline = { ...currentPipeline!, stages: updatedStages }
      setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
      setCurrentPipeline(updatedPipeline)
    }
  }

  const handleDeleteStage = async (stageId: string) => {
    if (!currentPipeline) return
    const { error } = await supabase
      .from('project_stages')
      .delete()
      .eq('id', stageId)

    if (error) {
      console.error('Error deleting stage:', error)
    } else {
      const updatedStages = currentPipeline!.stages.filter(s => s.id !== stageId)
      const updatedPipeline: ProjectPipeline = { ...currentPipeline!, stages: updatedStages }
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

  const handleStartEditProject = (project: Project) => {
    setEditingProject(project)
    setEditFields({
      name: project.name,
      description: project.description,
      deadline: project.deadline,
      priority: project.priority,
      budget: String(project.budget),
      spent: String(project.spent),
      assigned_to: project.assigned_to
    })
  }

  const resetNewProjectForm = () => {
    setNewProjectData({ name: '', description: '', deadline: '', priority: '', budget: '', assigned_to: '' })
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
              <h1 className="text-heading-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">Project Management</h1>
              <p className="text-body text-muted-foreground">
                Organize and track your projects with customizable pipelines
              </p>
              <div className="flex items-center gap-2 text-caption text-primary">
                <PlusCircle className="w-4 h-4" />
                {filteredProjects.length} PROJECTS
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={currentPipeline?.id} onValueChange={(value) => setCurrentPipeline(pipelines.find(p => p.id === value) || null)}>
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
                <span className="text-sm font-normal text-muted-foreground">({filteredProjects.length} projects)</span>
              </CardTitle>
              <Button variant="outline" size="sm" className="glass-effect border-0 shadow-md hover-lift" onClick={() => setIsAddStageDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Stage
              </Button>
            </div>
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
            <Dialog open={isAddProjectDialogOpen} onOpenChange={(o) => { setIsAddProjectDialogOpen(o); if(!o) resetNewProjectForm() }}>
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
                    <Label>Name</Label>
                    <Input
                      value={newProjectData.name}
                      onChange={(e) => setNewProjectData(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newProjectData.description}
                      onChange={(e) => setNewProjectData(p => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Deadline</Label>
                      <Input
                        type="date"
                        value={newProjectData.deadline}
                        onChange={(e) => setNewProjectData(p => ({ ...p, deadline: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Priority</Label>
                      <Select
                        value={newProjectData.priority}
                        onValueChange={(v: Project['priority']) => setNewProjectData(p => ({ ...p, priority: v }))}
                      >
                        <SelectTrigger>
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
                      <Label>Budget</Label>
                      <Input
                        type="number"
                        value={newProjectData.budget}
                        onChange={(e) => setNewProjectData(p => ({ ...p, budget: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Assigned To</Label>
                      <Input
                        value={newProjectData.assigned_to}
                        onChange={(e) => setNewProjectData(p => ({ ...p, assigned_to: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    disabled={!newProjectData.name.trim() || !newProjectData.priority}
                    onClick={async () => {
                      await handleAddProject({
                        name: newProjectData.name.trim(),
                        description: newProjectData.description.trim(),
                        deadline: newProjectData.deadline,
                        priority: newProjectData.priority as Project['priority'],
                        budget: Number(newProjectData.budget) || 0,
                        spent: 0,
                        assigned_to: newProjectData.assigned_to.trim(),
                        status: 'Not Started'
                      })
                      resetNewProjectForm()
                      setIsAddProjectDialogOpen(false)
                    }}
                  >Add Project</Button>
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
              onEditProject={handleStartEditProject}
              onDeleteProject={handleDeleteProject}
            />
          </div>
        </CardContent>
      </Card>

      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={(o) => { if(!o) setEditingProject(null) }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={editFields.name}
                  onChange={(e) => setEditFields(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={editFields.description}
                  onChange={(e) => setEditFields(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={editFields.deadline}
                    onChange={(e) => setEditFields(f => ({ ...f, deadline: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select
                    value={editFields.priority}
                    onValueChange={(v: Project['priority']) => setEditFields(f => ({ ...f, priority: v }))}
                  >
                    <SelectTrigger>
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
                  <Label>Budget</Label>
                  <Input
                    type="number"
                    value={editFields.budget}
                    onChange={(e) => setEditFields(f => ({ ...f, budget: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Spent</Label>
                  <Input
                    type="number"
                    value={editFields.spent}
                    onChange={(e) => setEditFields(f => ({ ...f, spent: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Assigned To</Label>
                <Input
                  value={editFields.assigned_to}
                  onChange={(e) => setEditFields(f => ({ ...f, assigned_to: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={!editFields.name.trim() || !editFields.priority}
                onClick={async () => {
                  if(!editingProject) return
                  await handleEditProject({
                    ...editingProject,
                    name: editFields.name.trim(),
                    description: editFields.description.trim(),
                    deadline: editFields.deadline,
                    priority: editFields.priority as Project['priority'],
                    budget: Number(editFields.budget) || 0,
                    spent: Number(editFields.spent) || 0,
                    assigned_to: editFields.assigned_to.trim(),
                  })
                  setEditingProject(null)
                }}
              >Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={isAddStageDialogOpen} onOpenChange={(o) => { setIsAddStageDialogOpen(o); if(!o) setNewStageNameInput('') }}>
        <DialogContent className="glass-effect border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle>Add New Stage</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter new stage name"
            value={newStageNameInput}
            onChange={(e) => setNewStageNameInput(e.target.value)}
          />
          <DialogFooter>
            <Button
              disabled={!newStageNameInput.trim()}
              onClick={async () => {
                await handleAddStage(newStageNameInput.trim())
                setNewStageNameInput('')
                setIsAddStageDialogOpen(false)
              }}
            >Add Stage</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  {/* Close Main Content wrapper */}
  </div>
    </div>
  )
}

