import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddPipelineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPipeline: (pipelineName: string) => void
}

export function AddPipelineDialog({
  open,
  onOpenChange,
  onAddPipeline
}: AddPipelineDialogProps) {
  const [pipelineName, setPipelineName] = useState('')

  const handleSubmit = () => {
    if (pipelineName.trim()) {
      onAddPipeline(pipelineName)
      setPipelineName('')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              className="input-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="btn-primary">
            Add Pipeline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
