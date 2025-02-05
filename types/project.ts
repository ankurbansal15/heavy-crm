export interface Project {
  id: string
  name: string
  description: string
  status: string
  stage_id: string
  deadline: string
  budget: number
  spent: number
  priority: 'Low' | 'Medium' | 'High'
  assigned_to: string
  position: number
}

export interface ProjectPipeline {
  id: string
  name: string
  stages: ProjectStage[]
}

export interface ProjectStage {
  id: string
  name: string
  position: number
}

