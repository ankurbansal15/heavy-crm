import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KanbanBoard } from "@/components/sales/KanbanBoard"
import { OpportunitiesTable } from "@/components/sales/OpportunitiesTable"
import { SalesCalendar } from "@/components/sales/SalesCalendar"
import { SalesPipeline } from "@/components/sales/SalesPipeline"
import { SalesForecast } from "@/components/sales/SalesForecast"
import { KanbanControls } from "@/components/sales/KanbanControls"
import type { Pipeline, Opportunity, DateRange } from '@/types/sales'

interface SalesTabsProps {
  currentPipeline: Pipeline | null
  opportunities: Opportunity[]
  filteredOpportunities: Opportunity[]
  searchTerm: string
  onSearchChange: (term: string) => void
  onSort: (key: keyof Opportunity) => void
  onDragEnd: (result: any) => void
  onMoveStage: (stageId: string, direction: 'forward' | 'backward') => void
  onEditStage: (stageId: string, newName: string) => void
  onDeleteStage: (stageId: string) => void
  onMoveLead: (lead: Opportunity, direction: 'forward' | 'backward') => void
  onEditLead: (lead: Opportunity | null) => void
  onDeleteLead: (id: string) => void
  onAddStage: (stageName: string) => void
  onAddLeadClick: () => void
}

export function SalesTabs({
  currentPipeline,
  opportunities,
  filteredOpportunities,
  searchTerm,
  onSearchChange,
  onSort,
  onDragEnd,
  onMoveStage,
  onEditStage,
  onDeleteStage,
  onMoveLead,
  onEditLead,
  onDeleteLead,
  onAddStage,
  onAddLeadClick
}: SalesTabsProps) {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({ 
    from: new Date(), 
    to: new Date() 
  })

  return (
    <Card className="card-elevated glass-effect border-0 shadow-xl animate-fade-in">
      <Tabs defaultValue="kanban" className="space-y-6">
        <TabsList className="glass-effect border-0 shadow-lg hover-lift">
          <TabsTrigger value="kanban" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
            Kanban Board
          </TabsTrigger>
          <TabsTrigger value="table" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
            Tabular View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
            Sales Pipeline
          </TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
            Sales Forecast
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-6 animate-fade-in">
          <Card className="card-elevated hover-lift glass-effect border-0 shadow-lg">
            <CardHeader className="space-y-4">
              <KanbanControls
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                filteredOpportunities={filteredOpportunities}
                onSort={onSort}
                onAddStage={onAddStage}
                onAddLeadClick={onAddLeadClick}
              />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[calc(350px*3)] w-full">
                  {currentPipeline && (
                    <KanbanBoard
                      opportunities={filteredOpportunities as any}
                      currentPipeline={currentPipeline}
                      onDragEnd={onDragEnd}
                      onMoveStage={onMoveStage}
                      onEditStage={onEditStage}
                      onDeleteStage={onDeleteStage}
                      onMoveLead={onMoveLead}
                      onEditLead={onEditLead}
                      onDeleteLead={onDeleteLead}
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
                  onEditLead={(lead: any) => onEditLead(lead)}
                  onDeleteLead={onDeleteLead}
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
  )
}
