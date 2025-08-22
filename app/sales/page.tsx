'use client'

import { useState } from 'react'
import { useSalesData } from '@/hooks/use-sales-data'
import { useSalesOperations } from '@/hooks/use-sales-operations'
import { SalesHeader } from '@/components/sales/SalesHeader'
import { AddPipelineDialog } from '@/components/sales/AddPipelineDialog'
import { AddLeadDialog } from '@/components/sales/AddLeadDialog'
import { EditLeadDialog } from '@/components/sales/EditLeadDialog'
import { SalesTabs } from '@/components/sales/SalesTabs'
import type { Opportunity } from '@/types/sales'

export default function SalesManagement() {
  // State for dialog visibility
  const [isAddPipelineDialogOpen, setIsAddPipelineDialogOpen] = useState(false)
  const [isAddLeadDialogOpen, setIsAddLeadDialogOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Opportunity | null>(null)

  // Custom hooks for data and operations
  const salesData = useSalesData()
  const salesOperations = useSalesOperations({
    pipelines: salesData.pipelines,
    setPipelines: salesData.setPipelines,
    currentPipeline: salesData.currentPipeline,
    setCurrentPipeline: salesData.setCurrentPipeline,
    opportunities: salesData.opportunities,
    setOpportunities: salesData.setOpportunities,
    user: salesData.user
  })

  // Handler functions
  const handlePipelineChange = (pipelineId: string) => {
    const selectedPipeline = salesData.pipelines.find(p => p.id === pipelineId)
    salesData.setCurrentPipeline(selectedPipeline || null)
  }

  const handleAddPipeline = (pipelineName: string) => {
    salesOperations.handleAddPipeline(pipelineName)
  }

  const handleEditLead = (editedLead: Opportunity) => {
    salesOperations.handleEditLead(editedLead)
    setEditingLead(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Header Section */}
      <SalesHeader
        currentPipeline={salesData.currentPipeline}
        pipelines={salesData.pipelines}
        opportunities={salesData.opportunities}
        onPipelineChange={handlePipelineChange}
        onAddPipelineClick={() => setIsAddPipelineDialogOpen(true)}
      />

      {/* Main Content */}
      <div className="px-8 pb-8">
        <SalesTabs
          currentPipeline={salesData.currentPipeline}
          opportunities={salesData.opportunities}
          filteredOpportunities={salesData.filteredOpportunities}
          searchTerm={salesData.searchTerm}
          onSearchChange={salesData.setSearchTerm}
          onSort={salesData.handleSort}
          onDragEnd={salesOperations.handleDragEnd}
          onMoveStage={salesOperations.handleMoveStage}
          onEditStage={(stageId: string, newName: string) => {
            const stage = salesData.currentPipeline?.stages.find(s => s.id === stageId)
            if (stage) salesOperations.handleEditStage(stage, newName)
          }}
          onDeleteStage={salesOperations.handleDeleteStage}
          onMoveLead={salesOperations.handleMoveLead}
          onEditLead={setEditingLead}
          onDeleteLead={salesOperations.handleDeleteLead}
          onAddStage={salesOperations.handleAddStage}
          onAddLeadClick={() => setIsAddLeadDialogOpen(true)}
        />
      </div>

      {/* Dialogs */}
      <AddPipelineDialog
        open={isAddPipelineDialogOpen}
        onOpenChange={setIsAddPipelineDialogOpen}
        onAddPipeline={handleAddPipeline}
      />

      <AddLeadDialog
        open={isAddLeadDialogOpen}
        onOpenChange={setIsAddLeadDialogOpen}
        onAddLead={salesOperations.handleAddLead}
        currentPipeline={salesData.currentPipeline}
      />

      <EditLeadDialog
        open={!!editingLead}
        onOpenChange={() => setEditingLead(null)}
        onEditLead={handleEditLead}
        editingLead={editingLead}
        currentPipeline={salesData.currentPipeline}
      />
    </div>
  )
}
