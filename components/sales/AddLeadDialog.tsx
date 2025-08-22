import { useState } from 'react'
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
import type { NewLeadForm, Pipeline, Opportunity } from '@/types/sales'

interface AddLeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddLead: (lead: Partial<Opportunity>) => void
  currentPipeline: Pipeline | null
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

export function AddLeadDialog({
  open,
  onOpenChange,
  onAddLead,
  currentPipeline
}: AddLeadDialogProps) {
  const [newLead, setNewLead] = useState<NewLeadForm>(initialLeadState)

  const handleSubmit = () => {
    const missing = {
      name: !newLead.name.trim(),
      value: newLead.value === '' || isNaN(Number(newLead.value)),
      probability: newLead.probability === '' || isNaN(Number(newLead.probability)),
      stage: !newLead.stage_id,
      priority: !newLead.priority
    }
    
    const hasMissing = Object.values(missing).some(Boolean)
    
    if (hasMissing) {
      alert('Please fill in all required fields: Name, Value, Probability, Stage, and Priority')
      return
    }

    const probabilityNum = Math.min(100, Math.max(0, Number(newLead.probability)))
    
    onAddLead({
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
    onOpenChange(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setNewLead(initialLeadState)
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-effect border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-heading-4">Add New Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Name *</Label>
            <Input 
              id="lead-name" 
              placeholder="Enter lead name" 
              value={newLead.name} 
              onChange={(e) => setNewLead(l => ({...l, name: e.target.value}))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-company">Company (Optional)</Label>
            <Input 
              id="lead-company" 
              placeholder="Enter company name" 
              value={newLead.company} 
              onChange={(e) => setNewLead(l => ({...l, company: e.target.value}))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-contact">Contact Name (Optional)</Label>
            <Input 
              id="lead-contact" 
              placeholder="Enter contact name" 
              value={newLead.contact_name} 
              onChange={(e) => setNewLead(l => ({...l, contact_name: e.target.value}))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-email">Email (Optional)</Label>
            <Input 
              id="lead-email" 
              type="email" 
              placeholder="Enter email address" 
              value={newLead.email} 
              onChange={(e) => setNewLead(l => ({...l, email: e.target.value}))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-phone">Phone (Optional)</Label>
            <Input 
              id="lead-phone" 
              placeholder="Enter phone number" 
              value={newLead.phone} 
              onChange={(e) => setNewLead(l => ({...l, phone: e.target.value}))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-value">Value *</Label>
            <Input 
              id="lead-value" 
              type="number" 
              placeholder="Enter value" 
              value={newLead.value} 
              onChange={(e) => setNewLead(l => ({...l, value: e.target.value}))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-probability">Probability (%) *</Label>
            <Input 
              id="lead-probability" 
              type="number" 
              placeholder="Enter probability" 
              min={0} 
              max={100} 
              value={newLead.probability} 
              onChange={(e) => setNewLead(l => ({...l, probability: e.target.value}))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-stage">Stage *</Label>
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
            <Label htmlFor="lead-priority">Priority *</Label>
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
            <Input 
              id="lead-notes" 
              placeholder="Enter any notes" 
              value={newLead.notes} 
              onChange={(e) => setNewLead(l => ({...l, notes: e.target.value}))} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="btn-primary">
            Add Lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
