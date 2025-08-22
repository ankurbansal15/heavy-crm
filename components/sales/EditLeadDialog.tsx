import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Opportunity, Pipeline } from '@/types/sales'

interface EditLeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditLead: (lead: Opportunity) => void
  editingLead: Opportunity | null
  currentPipeline: Pipeline | null
}

export function EditLeadDialog({
  open,
  onOpenChange,
  onEditLead,
  editingLead,
  currentPipeline
}: EditLeadDialogProps) {
  const [formData, setFormData] = useState<Partial<Opportunity>>({})

  useEffect(() => {
    if (editingLead) {
      setFormData(editingLead)
    }
  }, [editingLead])

  const handleSubmit = () => {
    if (!editingLead || !formData.name || !formData.value || !formData.probability) return

    onEditLead({
      ...editingLead,
      ...formData,
      value: Number(formData.value),
      probability: Number(formData.probability),
    } as Opportunity)
  }

  const updateField = (field: keyof Opportunity, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!editingLead) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-heading-4">Edit Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input 
              id="edit-name" 
              value={formData.name || ''} 
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-company">Company</Label>
            <Input 
              id="edit-company" 
              value={formData.company || ''} 
              onChange={(e) => updateField('company', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-contact">Contact Name</Label>
            <Input 
              id="edit-contact" 
              value={formData.contact_name || ''} 
              onChange={(e) => updateField('contact_name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input 
              id="edit-email" 
              type="email" 
              value={formData.email || ''} 
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input 
              id="edit-phone" 
              value={formData.phone || ''} 
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-value">Value</Label>
            <Input 
              id="edit-value" 
              type="number" 
              value={formData.value || ''} 
              onChange={(e) => updateField('value', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-probability">Probability (%)</Label>
            <Input 
              id="edit-probability" 
              type="number" 
              value={formData.probability || ''} 
              min="0" 
              max="100" 
              onChange={(e) => updateField('probability', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-stage">Stage</Label>
            <Select 
              value={formData.stage_id || ''} 
              onValueChange={(value) => updateField('stage_id', value)}
            >
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-priority">Priority</Label>
            <Select 
              value={formData.priority || ''} 
              onValueChange={(value) => updateField('priority', value)}
            >
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
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Input 
              id="edit-notes" 
              value={formData.notes || ''} 
              onChange={(e) => updateField('notes', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="btn-primary">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
