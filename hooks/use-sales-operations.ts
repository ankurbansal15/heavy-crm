import { supabase } from '@/lib/supabase'
import type { Pipeline, Stage, Opportunity, NewLeadForm, DragResult } from '@/types/sales'

interface UseSalesOperationsProps {
  pipelines: Pipeline[]
  setPipelines: (pipelines: Pipeline[]) => void
  currentPipeline: Pipeline | null
  setCurrentPipeline: (pipeline: Pipeline | null) => void
  opportunities: Opportunity[]
  setOpportunities: (opportunities: Opportunity[]) => void
  user: any
}

export function useSalesOperations({
  pipelines,
  setPipelines,
  currentPipeline,
  setCurrentPipeline,
  opportunities,
  setOpportunities,
  user
}: UseSalesOperationsProps) {

  const handleAddPipeline = async (pipelineName: string) => {
    if (!user || !pipelineName.trim()) return

    const { data: newPipeline, error: pipelineError } = await supabase
      .from('pipelines')
      .insert([{ name: pipelineName, user_id: user.id }])
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
  }

  const handleAddLead = async (newLead: Partial<Opportunity>) => {
    if (!user || !currentPipeline || !newLead.stage_id) {
      console.error('Missing required data:', { 
        user: !!user, 
        currentPipeline: !!currentPipeline, 
        stage_id: newLead.stage_id 
      })
      return
    }

    const targetStageId = newLead.stage_id

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

    const nextPosition = existingLeads && existingLeads.length > 0 
      ? existingLeads[0].position + 1 
      : 0

    const leadToInsert = { 
      ...newLead, 
      stage_id: targetStageId,
      user_id: user.id,
      position: nextPosition
    }

    const { data, error } = await supabase
      .from('opportunities')
      .insert([leadToInsert])
      .select()

    if (error) {
      console.error('Error adding lead:', error)
      alert('Error adding lead: ' + error.message)
    } else if (data) {
      setOpportunities([...opportunities, data[0]])
      alert('Lead added successfully!')
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

  const handleDragEnd = async (result: DragResult) => {
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

      const updatedStages = newStages.map((stage, index) => ({
        ...stage,
        position: index
      }))

      const updatedPipeline = { ...currentPipeline, stages: updatedStages }
      setPipelines(pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p))
      setCurrentPipeline(updatedPipeline)

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

      if (overData?.type === 'opportunity') {
        targetStageId = overData.opportunity.stage_id
      } else if (overData?.type === 'stage') {
        targetStageId = overData.stage.id
      }

      if (opportunity.stage_id === targetStageId) return

      const updatedOpportunities = [...opportunities]
      const opportunityIndex = updatedOpportunities.findIndex(opp => opp.id === opportunity.id)
      
      if (opportunityIndex === -1) return

      updatedOpportunities[opportunityIndex] = {
        ...updatedOpportunities[opportunityIndex],
        stage_id: targetStageId,
        position: 0
      }

      const targetStageOpportunities = updatedOpportunities
        .filter(opp => opp.stage_id === targetStageId)
        .map((opp, index) => ({ ...opp, position: index }))

      const finalOpportunities = updatedOpportunities.map(opp => {
        if (opp.stage_id === targetStageId) {
          const updatedOpp = targetStageOpportunities.find(target => target.id === opp.id)
          return updatedOpp || opp
        }
        return opp
      })

      setOpportunities(finalOpportunities)

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

  return {
    handleAddPipeline,
    handleAddLead,
    handleEditLead,
    handleDeleteLead,
    handleAddStage,
    handleEditStage,
    handleDeleteStage,
    handleMoveStage,
    handleMoveLead,
    handleDragEnd
  }
}
