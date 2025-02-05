import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface Opportunity {
  id: string
  name: string
  value: number
  stage: string
  probability: number
  priority: string
  pipeline: string
}

interface SalesForecastProps {
  opportunities: Opportunity[]
  currentPipeline: { id: string; name: string; stages: string[] }
}

export function SalesForecast({ opportunities, currentPipeline }: SalesForecastProps) {
  const data = [
    { 
      name: 'Projected', 
      value: opportunities
        .filter(opp => opp.pipeline === currentPipeline.id)
        .reduce((sum, opp) => sum + opp.value * (opp.probability / 100), 0) 
    },
    { 
      name: 'Total Potential', 
      value: opportunities
        .filter(opp => opp.pipeline === currentPipeline.id)
        .reduce((sum, opp) => sum + opp.value, 0) 
    }
  ]

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

