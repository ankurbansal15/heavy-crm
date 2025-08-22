import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { supabase } from '@/lib/supabase'
import type { Pipeline, Stage, Opportunity, SortConfig, NewLeadForm } from '@/types/sales'

export function useSalesData() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [currentPipeline, setCurrentPipeline] = useState<Pipeline | null>(null)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ascending' })
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

  const handleSort = (key: keyof Opportunity) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  return {
    // State
    pipelines,
    currentPipeline,
    opportunities,
    filteredOpportunities,
    searchTerm,
    sortConfig,
    user,
    
    // Setters
    setPipelines,
    setCurrentPipeline,
    setOpportunities,
    setSearchTerm,
    setSortConfig,
    
    // Actions
    fetchPipelines,
    fetchOpportunities,
    handleSort
  }
}
