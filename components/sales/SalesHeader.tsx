import { PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Pipeline } from '@/types/sales'

interface SalesHeaderProps {
  currentPipeline: Pipeline | null
  pipelines: Pipeline[]
  opportunities: any[]
  onPipelineChange: (pipelineId: string) => void
  onAddPipelineClick: () => void
}

export function SalesHeader({
  currentPipeline,
  pipelines,
  opportunities,
  onPipelineChange,
  onAddPipelineClick
}: SalesHeaderProps) {
  return (
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
            <Select value={currentPipeline?.id} onValueChange={onPipelineChange}>
              <SelectTrigger className="w-48 glass-effect border-0 shadow-lg">
                <SelectValue placeholder="Select pipeline" />
              </SelectTrigger>
              <SelectContent>
                {pipelines.map((pipeline) => (
                  <SelectItem key={pipeline.id} value={pipeline.id}>{pipeline.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={onAddPipelineClick}
              className="btn-secondary hover-lift glass-effect border-0 shadow-lg"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Pipeline
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
