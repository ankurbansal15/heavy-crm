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

export default function SalesManagement() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [currentPipeline, setCurrentPipeline] = useState<Pipeline | null>(null)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof Opportunity | null, direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' })
  const [editingLead, setEditingLead] = useState<Opportunity | null>(null)
  const [editingStage, setEditingStage] = useState<Stage | null>(null)
  const [selectedDateRange, setSelectedDateRange] = useState({ from: new Date(), to: new Date() })
  const [isAddPipelineDialogOpen, setIsAddPipelineDialogOpen] = useState(false)
  const [newPipelineName, setNewPipelineName] = useState('')
  const [isAddLeadDialogOpen, setIsAddLeadDialogOpen] = useState(false)
  interface NewLeadForm {
    name: string
    company: string
    contact_name: string
    email: string
    phone: string
    value: string
    probability: string
    stage_id: string
    priority: string
    notes: string
  }
  const initialLeadState: NewLeadForm = {
    name: '',
    company: '',
    contact_name: '',
    email: '',
    phone: '',
    value: '',
    probability: '',
    stage_id: '',
    priority: '',
    notes: ''
  }
  const [newLead, setNewLead] = useState<NewLeadForm>(initialLeadState)
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
        const aValue = a[sortConfig.key!]
        const bValue = b[sortConfig.key!]
        if (aValue != null && bValue != null) {
          if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1
          }
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

  const handleDragEnd = async (result: { active: any; over: any }) => {
    const { active, over } = result
    
    if (!over || !currentPipeline) return

    const activeData = active.data?.current
    const overData = over.data?.current

    // Handle stage reordering
    if (activeData?.type === 'stage' && overData?.type === 'stage') {
      const activeStage = activeData.stage
      const overStage = overData.stage
      
      if (activeStage.id === overStage.id) return

      const newStages = Array.from(currentPipeline.stages)
      const activeIndex = newStages.findIndex(stage => stage.id === activeStage.id)
      const overIndex = newStages.findIndex(stage => stage.id === overStage.id)

      const [reorderedStage] = newStages.splice(activeIndex, 1)
      newStages.splice(overIndex, 0, reorderedStage)

      // Update positions
      const updatedStages = newStages.map((stage, index) => ({
        ...stage,
        position: index
      }))

      const updatedPipeline = { ...currentPipeline, stages: updatedStages }
      setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
      setCurrentPipeline(updatedPipeline)

      // Update stage positions in Supabase
      const updates = updatedStages.map((stage, index) => ({
        id: stage.id,
        name: stage.name,
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
    }
    // Handle opportunity movement between stages
    else if (activeData?.type === 'opportunity') {
      const opportunity = activeData.opportunity
      let targetStageId = over.id

      // If dropped over another opportunity, get the stage from that opportunity
      if (overData?.type === 'opportunity') {
        targetStageId = overData.opportunity.stage_id
      }
      // If dropped over a stage area, use that stage
      else if (overData?.type === 'stage') {
        targetStageId = overData.stage.id
      }

      if (opportunity.stage_id === targetStageId) return

      const updatedOpportunities = [...opportunities]
      const opportunityIndex = updatedOpportunities.findIndex(opp => opp.id === opportunity.id)
      
      if (opportunityIndex === -1) return

      // Update the opportunity's stage
      updatedOpportunities[opportunityIndex] = {
        ...updatedOpportunities[opportunityIndex],
        stage_id: targetStageId,
        position: 0 // Place at the beginning of the new stage
      }

      // Update positions of all opportunities in the target stage
      const targetStageOpportunities = updatedOpportunities
        .filter(opp => opp.stage_id === targetStageId)
        .map((opp, index) => ({ ...opp, position: index }))

      // Replace opportunities in the target stage with updated positions
      const finalOpportunities = updatedOpportunities.map(opp => {
        if (opp.stage_id === targetStageId) {
          const updatedOpp = targetStageOpportunities.find(target => target.id === opp.id)
          return updatedOpp || opp
        }
        return opp
      })

      setOpportunities(finalOpportunities)

      // Update opportunity in Supabase
      const { error } = await supabase
        .from('opportunities')
        .update({
          stage_id: targetStageId,
          position: 0
        })
        .eq('id', opportunity.id)

      if (error) {
        console.error('Error updating opportunity:', error)
      }
    }
  }

  const handleSort = (key: keyof Opportunity) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const handleAddLead = async (newLead: Partial<Opportunity>) => {
    console.log('handleAddLead called with:', newLead);
    
    if (!user || !currentPipeline || !newLead.stage_id) {
      console.error('Missing required data:', { 
        user: !!user, 
        currentPipeline: !!currentPipeline, 
        stage_id: newLead.stage_id 
      });
      return
    }
  
    // Use the selected stage from the form
    const targetStageId = newLead.stage_id
    console.log('Target stage ID:', targetStageId);
  
    // Get the highest position in the target stage
    const { data: existingLeads, error: fetchError } = await supabase
      .from('opportunities')
      .select('position')
      .eq('stage_id', targetStageId)
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

    console.log('Next position calculated:', nextPosition);

    const leadToInsert = { 
      ...newLead, 
      stage_id: targetStageId,
      user_id: user.id,
      position: nextPosition
    };

    console.log('Lead to insert:', leadToInsert);

    // Insert the new lead with the calculated position
    const { data, error } = await supabase
      .from('opportunities')
      .insert([leadToInsert])
      .select()

    if (error) {
      console.error('Error adding lead:', error)
      alert('Error adding lead: ' + error.message);
    } else if (data) {
      console.log('Lead added successfully:', data[0]);
      setOpportunities([...opportunities, data[0]])
      alert('Lead added successfully!');
    }
  }

  const handleEditLead = async (editedLead: Opportunity) => {
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

  const handleDeleteLead = async (id: string) => {
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

  const handleAddStage = async (newStageName: string) => {
    if (!currentPipeline || !user) return
    
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
    } else if (data && data[0]) {
      const updatedPipeline: Pipeline = { 
        ...currentPipeline, 
        stages: [...currentPipeline.stages, data[0]]
      }
      setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
      setCurrentPipeline(updatedPipeline)
    }
  }

  const handleEditStage = async (oldStage: Stage, newStageName: string) => {
    if (!currentPipeline) return
    
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
      const updatedPipeline: Pipeline = { ...currentPipeline, stages: updatedStages }
      setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
      setCurrentPipeline(updatedPipeline)
    }
    setEditingStage(null)
  }

  const handleDeleteStage = async (stageId: string) => {
    if (!currentPipeline) return
    
    const { error } = await supabase
      .from('stages')
      .delete()
      .eq('id', stageId)

    if (error) {
      console.error('Error deleting stage:', error)
    } else {
      const updatedStages = currentPipeline.stages.filter(s => s.id !== stageId)
      const updatedPipeline: Pipeline = { ...currentPipeline, stages: updatedStages }
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
                Sales Management
              </h1>
              <p className="text-body text-muted-foreground">
                Manage your sales pipeline and track opportunities
              </p>
              <div className="flex items-center gap-2 text-caption text-primary">
                <PlusCircle className="w-4 h-4" />
                {opportunities.length} OPPORTUNITIES
              </div>
            </div>
            <div className="flex items-center gap-3 animate-slide-in-right">
              <Select value={currentPipeline?.id} onValueChange={(value) => {
                const selectedPipeline = pipelines.find(p => p.id === value);
                setCurrentPipeline(selectedPipeline || null);
              }}>
                <SelectTrigger className="w-48 glass-effect border-0 shadow-lg">
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
                  <Button className="btn-secondary hover-lift glass-effect border-0 shadow-lg">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Pipeline
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-effect border-0 shadow-2xl">
                  <DialogHeader className="space-y-3">
                    <DialogTitle className="text-heading-4">Add New Pipeline</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-6">
                    <div className="space-y-2">
                      <Label htmlFor="pipeline-name" className="text-sm font-medium">Pipeline Name</Label>
                      <Input
                        id="pipeline-name"
                        placeholder="Enter pipeline name..."
                        value={newPipelineName}
                        onChange={(e) => setNewPipelineName(e.target.value)}
                        className="input-primary"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddPipeline} className="btn-primary">
                      Add Pipeline
                    </Button>
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
        <Tabs defaultValue="kanban" className="space-y-6">
          <TabsList className="glass-effect border-0 shadow-lg hover-lift">
            <TabsTrigger value="kanban" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">Kanban Board</TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">Tabular View</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">Calendar View</TabsTrigger>
            <TabsTrigger value="pipeline" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">Sales Pipeline</TabsTrigger>
            <TabsTrigger value="forecast" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">Sales Forecast</TabsTrigger>
          </TabsList>
        <TabsContent value="kanban" className="space-y-6 animate-fade-in">
          <Card className="card-elevated hover-lift glass-effect border-0 shadow-lg">
            <CardHeader className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-heading-4 flex items-center gap-2">
                    Sales Opportunities Kanban Board
                    <span className="text-sm font-normal text-muted-foreground">
                      ({filteredOpportunities.length} opportunities)
                    </span>
                  </CardTitle>
                  <CardDescription>Drag and drop opportunities to update their stage</CardDescription>
                </div>
                <Dialog>
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
                        <Input id="newStage" placeholder="Enter new stage name" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => {
                        const input = document.getElementById('newStage') as HTMLInputElement;
                        if (input?.value) {
                          handleAddStage(input.value);
                          input.value = '';
                        }
                      }} className="btn-primary">Add Stage</Button>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={() => handleSort('value')} 
                    variant="outline" 
                    size="sm"
                    className="glass-effect border-0 shadow-sm hover-lift"
                  >
                    Sort by Value
                  </Button>
                  <Button 
                    onClick={() => handleSort('probability')} 
                    variant="outline" 
                    size="sm"
                    className="glass-effect border-0 shadow-sm hover-lift"
                  >
                    Sort by Probability
                  </Button>
                  <Dialog open={isAddLeadDialogOpen} onOpenChange={(open) => { setIsAddLeadDialogOpen(open); if(!open) setNewLead(initialLeadState) }}>
                    <DialogTrigger asChild>
                      <Button className="btn-primary shadow-md hover-lift">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Lead
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-effect border-0 shadow-xl">
                      <DialogHeader>
                        <DialogTitle className="text-heading-4">Add New Lead</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="lead-name">Name</Label>
                          <Input id="lead-name" placeholder="Enter lead name" value={newLead.name} onChange={(e)=> setNewLead(l => ({...l, name: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-company">Company (Optional)</Label>
                          <Input id="lead-company" placeholder="Enter company name" value={newLead.company} onChange={(e)=> setNewLead(l => ({...l, company: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-contact">Contact Name (Optional)</Label>
                          <Input id="lead-contact" placeholder="Enter contact name" value={newLead.contact_name} onChange={(e)=> setNewLead(l => ({...l, contact_name: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-email">Email (Optional)</Label>
                          <Input id="lead-email" type="email" placeholder="Enter email address" value={newLead.email} onChange={(e)=> setNewLead(l => ({...l, email: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-phone">Phone (Optional)</Label>
                          <Input id="lead-phone" placeholder="Enter phone number" value={newLead.phone} onChange={(e)=> setNewLead(l => ({...l, phone: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-value">Value</Label>
                          <Input id="lead-value" type="number" placeholder="Enter value" value={newLead.value} onChange={(e)=> setNewLead(l => ({...l, value: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-probability">Probability (%)</Label>
                          <Input id="lead-probability" type="number" placeholder="Enter probability" min={0} max={100} value={newLead.probability} onChange={(e)=> setNewLead(l => ({...l, probability: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-stage">Stage</Label>
                          <Select value={newLead.stage_id || undefined} onValueChange={(value) => setNewLead(l => ({...l, stage_id: value}))}>
                            <SelectTrigger id="lead-stage">
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                              {currentPipeline?.stages.map((stage) => (
                                <SelectItem key={stage.id} value={stage.id}>
                                  {stage.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-priority">Priority</Label>
                          <Select value={newLead.priority || undefined} onValueChange={(value) => setNewLead(l => ({...l, priority: value}))}>
                            <SelectTrigger id="lead-priority">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-notes">Notes (Optional)</Label>
                          <Input id="lead-notes" placeholder="Enter any notes" value={newLead.notes} onChange={(e)=> setNewLead(l => ({...l, notes: e.target.value}))} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => {
                          const missing = {
                            name: !newLead.name.trim(),
                            value: newLead.value === '' || isNaN(Number(newLead.value)),
                            probability: newLead.probability === '' || isNaN(Number(newLead.probability)),
                            stage: !newLead.stage_id,
                            priority: !newLead.priority
                          }
                          const hasMissing = Object.values(missing).some(Boolean)
                          console.log('Attempt add lead - form state:', newLead, 'missing map:', missing)
                          if (hasMissing) {
                            alert('Please fill in all required fields: Name, Value, Probability, Stage, and Priority')
                            return
                          }
                          const probabilityNum = Math.min(100, Math.max(0, Number(newLead.probability)))
                          handleAddLead({
                            name: newLead.name.trim(),
                            company: newLead.company.trim() || undefined,
                            contact_name: newLead.contact_name.trim() || undefined,
                            email: newLead.email.trim() || undefined,
                            phone: newLead.phone.trim() || undefined,
                            value: Number(newLead.value),
                            probability: probabilityNum,
                            stage_id: newLead.stage_id,
                            priority: newLead.priority,
                            notes: newLead.notes.trim() || undefined,
                          })
                          setNewLead(initialLeadState)
                          setIsAddLeadDialogOpen(false)
                        }} className="btn-primary">Add Lead</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[calc(350px*3)] w-full">
                  {currentPipeline && (
                    <KanbanBoard
                      opportunities={filteredOpportunities as any}
                      currentPipeline={currentPipeline}
                      onDragEnd={handleDragEnd}
                      onMoveStage={handleMoveStage}
                      onEditStage={(stageId: string, newName: string) => {
                        const stage = currentPipeline.stages.find(s => s.id === stageId);
                        if (stage) handleEditStage(stage, newName);
                      }}
                      onDeleteStage={handleDeleteStage}
                      onMoveLead={handleMoveLead}
                      onEditLead={setEditingLead}
                      onDeleteLead={handleDeleteLead}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="table" className="animate-fade-in">
          <Card className="card-elevated hover-lift glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-heading-4">Sales Opportunities Table</CardTitle>
              <CardDescription>View all opportunities in a tabular format</CardDescription>
            </CardHeader>
            <CardContent>
              {currentPipeline && (
                <OpportunitiesTable
                  opportunities={filteredOpportunities as any}
                  onEditLead={(lead: any) => setEditingLead(lead)}
                  onDeleteLead={handleDeleteLead}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="animate-fade-in">
          <Card className="card-elevated hover-lift glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-heading-4">Sales Opportunities Calendar</CardTitle>
              <CardDescription>View opportunities based on their addition date</CardDescription>
            </CardHeader>
            <CardContent>
              {currentPipeline && (
                <SalesCalendar
                  opportunities={filteredOpportunities as any}
                  selectedDateRange={selectedDateRange}
                  onSelectDateRange={setSelectedDateRange}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pipeline" className="animate-fade-in">
          <Card className="card-elevated hover-lift glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-heading-4">Sales Pipeline</CardTitle>
              <CardDescription>Visualization of opportunities by stage</CardDescription>
            </CardHeader>
            <CardContent>
              {currentPipeline && (
                <SalesPipeline
                  opportunities={opportunities as any}
                  currentPipeline={currentPipeline}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecast" className="animate-fade-in">
          <Card className="card-elevated hover-lift glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-heading-4">Sales Forecast</CardTitle>
              <CardDescription>Projected sales based on opportunity probabilities</CardDescription>
            </CardHeader>
            <CardContent>
              {currentPipeline && (
                <SalesForecast
                  opportunities={opportunities as any}
                  currentPipeline={{
                    id: currentPipeline.id,
                    name: currentPipeline.name,
                    stages: currentPipeline.stages.map(s => s.name)
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  </div>

  {/* Edit Lead Dialog */}
  {editingLead && (
    <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
      <DialogContent className="glass-effect border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-heading-4">Edit Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" defaultValue={editingLead.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-company">Company</Label>
            <Input id="edit-company" defaultValue={editingLead.company || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-contact">Contact Name</Label>
            <Input id="edit-contact" defaultValue={editingLead.contact_name || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" type="email" defaultValue={editingLead.email || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input id="edit-phone" defaultValue={editingLead.phone || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-value">Value</Label>
            <Input id="edit-value" type="number" defaultValue={editingLead.value} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-probability">Probability (%)</Label>
            <Input id="edit-probability" type="number" defaultValue={editingLead.probability} min="0" max="100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-stage">Stage</Label>
            <Select defaultValue={editingLead.stage_id} onValueChange={(value) => {
              const stageInput = document.getElementById('edit-stage-hidden') as HTMLInputElement;
              if (stageInput) stageInput.value = value;
            }}>
              <SelectTrigger id="edit-stage">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {currentPipeline?.stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" id="edit-stage-hidden" defaultValue={editingLead.stage_id} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-priority">Priority</Label>
            <Select defaultValue={editingLead.priority} onValueChange={(value) => {
              const priorityInput = document.getElementById('edit-priority-hidden') as HTMLInputElement;
              if (priorityInput) priorityInput.value = value;
            }}>
              <SelectTrigger id="edit-priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" id="edit-priority-hidden" defaultValue={editingLead.priority} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Input id="edit-notes" defaultValue={editingLead.notes || ''} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => {
            const nameInput = document.getElementById('edit-name') as HTMLInputElement;
            const companyInput = document.getElementById('edit-company') as HTMLInputElement;
            const contactInput = document.getElementById('edit-contact') as HTMLInputElement;
            const emailInput = document.getElementById('edit-email') as HTMLInputElement;
            const phoneInput = document.getElementById('edit-phone') as HTMLInputElement;
            const valueInput = document.getElementById('edit-value') as HTMLInputElement;
            const probabilityInput = document.getElementById('edit-probability') as HTMLInputElement;
            const stageInput = document.getElementById('edit-stage-hidden') as HTMLInputElement;
            const priorityInput = document.getElementById('edit-priority-hidden') as HTMLInputElement;
            const notesInput = document.getElementById('edit-notes') as HTMLInputElement;
            
            if (nameInput?.value && valueInput?.value && probabilityInput?.value) {
              handleEditLead({
                ...editingLead,
                name: nameInput.value,
                company: companyInput.value || undefined,
                contact_name: contactInput.value || undefined,
                email: emailInput.value || undefined,
                phone: phoneInput.value || undefined,
                value: Number(valueInput.value),
                probability: Number(probabilityInput.value),
                stage_id: stageInput?.value || editingLead.stage_id,
                priority: priorityInput?.value || editingLead.priority,
                notes: notesInput.value || undefined,
              });
            }
          }} className="btn-primary">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )}
    </div>
  )
}
