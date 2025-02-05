'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { KanbanBoard } from "@/components/sales/KanbanBoard"
import { OpportunitiesTable } from "@/components/sales/OpportunitiesTable"
import { SalesCalendar } from "@/components/sales/SalesCalendar"
import { SalesPipeline } from "@/components/sales/SalesPipeline"
import { SalesForecast } from "@/components/sales/SalesForecast"
import { supabase } from '@/lib/supabase'

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

interface Opportunity {
  id: string
  name: string
  value: number
  stage_id: string
  probability: number
  priority: string
  position: number
}

export default function SalesManagement() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [currentPipeline, setCurrentPipeline] = useState<Pipeline | null>(null)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [editingLead, setEditingLead] = useState<Opportunity | null>(null)
  const [editingStage, setEditingStage] = useState<Stage | null>(null)
  const [selectedDateRange, setSelectedDateRange] = useState({ from: new Date(), to: new Date() })
  const [isAddPipelineDialogOpen, setIsAddPipelineDialogOpen] = useState(false)
  const [newPipelineName, setNewPipelineName] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchPipelines()
      fetchOpportunities()
    }
  }, [user])

  useEffect(() => {
    if (pipelines.length > 0 && !currentPipeline) {
      setCurrentPipeline(pipelines[0])
    }
  }, [pipelines, currentPipeline])

  useEffect(() => {
    let result = opportunities
    
    if (currentPipeline) {
      result = result.filter(opp => currentPipeline.stages.some(stage => stage.id === opp.stage_id))
    }
    
    if (searchTerm) {
      result = result.filter(opp => 
        opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.priority.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    setFilteredOpportunities(result)
  }, [opportunities, searchTerm, sortConfig, currentPipeline])

  const fetchPipelines = async () => {
    const { data: pipelinesData, error: pipelinesError } = await supabase
      .from('pipelines')
      .select('*')
    
    if (pipelinesError) {
      console.error('Error fetching pipelines:', pipelinesError)
      return
    }

    const { data: stagesData, error: stagesError } = await supabase
      .from('stages')
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

  const fetchOpportunities = async () => {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('position')
    
    if (error) {
      console.error('Error fetching opportunities:', error)
      return
    }

    setOpportunities(data)
  }

  const handleAddPipeline = async () => {
    if (!user || !newPipelineName.trim()) return

    const { data: newPipeline, error: pipelineError } = await supabase
      .from('pipelines')
      .insert([{ name: newPipelineName, user_id: user.id }])
      .select()

    if (pipelineError) {
      console.error('Error adding pipeline:', pipelineError)
      return
    }

    // Add default stages to the new pipeline
    const defaultStages = ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Closed']
    const stageInserts = defaultStages.map((stageName, index) => ({
      name: stageName,
      pipeline_id: newPipeline[0].id,
      position: index,
      user_id: user.id
    }))

    const { data: newStages, error: stagesError } = await supabase
      .from('stages')
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

      // Update stage positions in Supabase
      const updates = newStages.map((stage, index) => ({
        id: stage.id,
        name: stage.name, // Add this line to include the required name field
        position: index,
        user_id: user?.id,
        pipeline_id: currentPipeline.id
      }))

      const { error } = await supabase
        .from('stages')
        .upsert(updates, { onConflict: 'id' })

      if (error) {
        console.error('Error updating stage positions:', error)
      }
    } else {
      const sourceStage = currentPipeline.stages.find(stage => stage.id === source.droppableId)
      const destinationStage = currentPipeline.stages.find(stage => stage.id === destination.droppableId)

      if (sourceStage && destinationStage) {
        const updatedOpportunities = [...opportunities]
        const [movedOpportunity] = updatedOpportunities.splice(
          updatedOpportunities.findIndex(opp => opp.id === draggableId),
          1
        )

        const destinationOpportunities = updatedOpportunities.filter(opp => opp.stage_id === destinationStage.id)
    
        movedOpportunity.stage_id = destinationStage.id
        movedOpportunity.position = destination.index

        // Insert the moved opportunity at the correct position
        updatedOpportunities.splice(
          updatedOpportunities.findIndex(opp => opp.stage_id === destinationStage.id) + destination.index,
          0,
          movedOpportunity
        )

        // Update positions of all opportunities in the affected stages
        const finalOpportunities = updatedOpportunities.map(opp => {
          if (opp.stage_id === sourceStage.id || opp.stage_id === destinationStage.id) {
            const stageOpportunities = updatedOpportunities.filter(o => o.stage_id === opp.stage_id)
            const position = stageOpportunities.findIndex(o => o.id === opp.id)
            return { ...opp, position }
          }
          return opp
        })

        setOpportunities(finalOpportunities)

        // Update opportunities in Supabase
        const { error } = await supabase
          .from('opportunities')
          .upsert(
            finalOpportunities
              .filter(opp => opp.stage_id === sourceStage.id || opp.stage_id === destinationStage.id)
              .map(opp => ({
                id: opp.id,
                stage_id: opp.stage_id,
                position: opp.position
              })),
            { onConflict: 'id' }
          )

        if (error) {
          console.error('Error updating opportunities:', error)
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

  const handleAddLead = async (newLead) => {
    if (!user || !currentPipeline) return
  
    // Get the first stage of the pipeline
    const firstStage = currentPipeline.stages[0]
  
    // Get the highest position in the target stage
    const { data: existingLeads, error: fetchError } = await supabase
      .from('opportunities')
      .select('position')
      .eq('stage_id', firstStage.id)
      .order('position', { ascending: false })
      .limit(1)
    
    if (fetchError) {
      console.error('Error fetching existing leads:', fetchError)
      return
    }
  
    // Calculate the next position (either highest + 1 or 0 if no existing leads)
    const nextPosition = existingLeads && existingLeads.length > 0 
      ? existingLeads[0].position + 1 
      : 0

    // Insert the new lead with the calculated position
    const { data, error } = await supabase
      .from('opportunities')
      .insert([{ 
        ...newLead, 
        stage_id: firstStage.id,
        user_id: user.id,
        position: nextPosition
      }])
      .select()

    if (error) {
      console.error('Error adding lead:', error)
    } else if (data) {
      setOpportunities([...opportunities, data[0]])
    }
  }

  const handleEditLead = async (editedLead) => {
    const { error } = await supabase
      .from('opportunities')
      .update(editedLead)
      .eq('id', editedLead.id)

    if (error) {
      console.error('Error updating lead:', error)
    } else {
      setOpportunities(opportunities.map(opp => opp.id === editedLead.id ? editedLead : opp))
    }
    setEditingLead(null)
  }

  const handleDeleteLead = async (id) => {
    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting lead:', error)
    } else {
      setOpportunities(opportunities.filter(opp => opp.id !== id))
    }
  }

  const handleAddStage = async (newStageName) => {
    const { data, error } = await supabase
      .from('stages')
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

  const handleEditStage = async (oldStage, newStageName) => {
    const { error } = await supabase
      .from('stages')
      .update({ name: newStageName })
      .eq('id', oldStage.id)

    if (error) {
      console.error('Error updating stage:', error)
    } else {
      const updatedStages = currentPipeline.stages.map(stage => 
        stage.id === oldStage.id ? { ...stage, name: newStageName } : stage
      )
      const updatedPipeline = { ...currentPipeline, stages: updatedStages }
      setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
      setCurrentPipeline(updatedPipeline)
    }
    setEditingStage(null)
  }

  const handleDeleteStage = async (stageId) => {
    const { error } = await supabase
      .from('stages')
      .delete()
      .eq('id', stageId)

    if (error) {
      console.error('Error deleting stage:', error)
    } else {
      const updatedStages = currentPipeline.stages.filter(s => s.id !== stageId)
      const updatedPipeline = { ...currentPipeline, stages: updatedStages }
      setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
      setCurrentPipeline(updatedPipeline)
      setOpportunities(opportunities.filter(opp => opp.stage_id !== stageId))
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
        .from('stages')
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

  const handleMoveLead = async (lead: Opportunity, direction: 'forward' | 'backward') => {
    if (!currentPipeline) return

    const currentStageIndex = currentPipeline.stages.findIndex(stage => stage.id === lead.stage_id)
    const newStageIndex = direction === 'forward' ? currentStageIndex + 1 : currentStageIndex - 1

    if (newStageIndex >= 0 && newStageIndex < currentPipeline.stages.length) {
      const newStage = currentPipeline.stages[newStageIndex]
      const updatedOpportunities = opportunities.map(opp => {
        if (opp.id === lead.id) {
          return { ...opp, stage_id: newStage.id, position: opportunities.filter(o => o.stage_id === newStage.id).length }
        }
        return opp
      })

      setOpportunities(updatedOpportunities)

      const { error } = await supabase
        .from('opportunities')
        .update({ stage_id: newStage.id, position: updatedOpportunities.find(opp => opp.id === lead.id)?.position })
        .eq('id', lead.id)

      if (error) {
        console.error('Error moving lead:', error)
      }
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-full overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">Sales Management</h1>
      <div className="flex justify-between items-center mb-4">
        <Select value={currentPipeline?.id} onValueChange={(value) => setCurrentPipeline(pipelines.find(p => p.id === value))}>
          <SelectTrigger className="w-[200px]">
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
            <Button variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Pipeline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Pipeline</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newPipelineName}
                  onChange={(e) => setNewPipelineName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddPipeline}>Add Pipeline</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="table">Tabular View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="forecast">Sales Forecast</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban" className="overflow-x-auto">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                Sales Opportunities Kanban Board
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Stage
                  </Button>
                </DialogTrigger>
                <DialogContent>
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
            <CardDescription className="px-6">Drag and drop opportunities to update their stage</CardDescription>
            <div className="px-6 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search opportunities..."
                      className="pl-8 w-full sm:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => handleSort('value')}>Sort by Value</Button>
                    <Button onClick={() => handleSort('probability')}>Sort by Probability</Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Lead
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Lead</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="value" className="text-right">Value</Label>
                            <Input id="value" type="number" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="probability" className="text-right">Probability</Label>
                            <Input id="probability" type="number" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right">Priority</Label>
                            <Select>
                              <SelectTrigger id="priority" className="col-span-3">
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
                        <DialogFooter>
                          <Button onClick={() => handleAddLead({
                            name: document.getElementById('name').value,
                            value: Number(document.getElementById('value').value),
                            probability: Number(document.getElementById('probability').value),
                            priority: document.getElementById('priority').value,
                          })}>Add Lead</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
           <CardContent className="overflow-x-auto">
              <div className="min-w-[calc(350px*3)] w-full">
               
                <KanbanBoard
                  opportunities={filteredOpportunities}
                  currentPipeline={currentPipeline}
                  onDragEnd={handleDragEnd}
                  onMoveStage={handleMoveStage}
                  onEditStage={handleEditStage}
                  onDeleteStage={handleDeleteStage}
                  onMoveLead={handleMoveLead}
                  onEditLead={setEditingLead}
                  onDeleteLead={handleDeleteLead}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Sales Opportunities Table</CardTitle>
              <CardDescription>View all opportunities in a tabular format</CardDescription>
            </CardHeader>
            <CardContent>
              <OpportunitiesTable
                opportunities={filteredOpportunities}
                onEditLead={setEditingLead}
                onDeleteLead={handleDeleteLead}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Sales Opportunities Calendar</CardTitle>
              <CardDescription>View opportunities based on their addition date</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesCalendar
                opportunities={filteredOpportunities}
                selectedDateRange={selectedDateRange}
                onSelectDateRange={setSelectedDateRange}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
              <CardDescription>Visualization of opportunities by stage</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesPipeline
                opportunities={opportunities}
                currentPipeline={currentPipeline}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <CardTitle>Sales Forecast</CardTitle>
              <CardDescription>Projected sales based on opportunity probabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesForecast
                opportunities={opportunities}
                currentPipeline={currentPipeline}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {editingLead && (
        <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Lead</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input id="edit-name" defaultValue={editingLead.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-value" className="text-right">Value</Label>
                <Input id="edit-value" type="number" defaultValue={editingLead.value} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-probability" className="text-right">Probability</Label>
                <Input id="edit-probability" type="number" defaultValue={editingLead.probability} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-priority" className="text-right">Priority</Label>
                <Select defaultValue={editingLead.priority}>
                  <SelectTrigger id="edit-priority" className="col-span-3">
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
            <DialogFooter>
              <Button onClick={() => handleEditLead({
                ...editingLead,
                name: document.getElementById('edit-name').value,
                value: Number(document.getElementById('edit-value').value),
                probability: Number(document.getElementById('edit-probability').value),
                priority: document.getElementById('edit-priority').value
              })}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

