import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface Opportunity {
  id: string
  name: string
  value: number
  stage_id: string
  probability: number
  priority: string
  pipeline: string
}

interface Pipeline {
  id: string;
  name: string;
  stages: { id: string; name: string }[];
}

interface SalesPipelineProps {
  opportunities: Opportunity[]
  currentPipeline: Pipeline | null
}

export function SalesPipeline({ opportunities, currentPipeline }: SalesPipelineProps) {
  if (!currentPipeline || !currentPipeline.stages) {
    return <div>No pipeline data available.</div>
  }

  const data = currentPipeline.stages.map(stage => ({
    name: stage.name,
    value: opportunities.filter(opp => opp.stage_id === stage.id && opp.pipeline === currentPipeline.id).reduce((sum, opp) => sum + opp.value, 0)
  })) ?? []

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

