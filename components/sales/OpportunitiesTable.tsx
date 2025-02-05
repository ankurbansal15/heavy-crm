import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from 'lucide-react'

interface Opportunity {
  id: string
  name: string
  value: number
  stage: string
  probability: number
  priority: string
  dateAdded: string
}

interface OpportunitiesTableProps {
  opportunities: Opportunity[]
  onEditLead: (lead: Opportunity) => void
  onDeleteLead: (id: string) => void
}

export function OpportunitiesTable({ opportunities, onEditLead, onDeleteLead }: OpportunitiesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Probability</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Date Added</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {opportunities.map((opp) => (
          <TableRow key={opp.id}>
            <TableCell>{opp.name}</TableCell>
            <TableCell>${opp.value.toLocaleString()}</TableCell>
            <TableCell>{opp.stage}</TableCell>
            <TableCell>{opp.probability}%</TableCell>
            <TableCell>
              <Badge>{opp.priority}</Badge>
            </TableCell>
            <TableCell>{opp.dateAdded}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEditLead(opp)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDeleteLead(opp.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

