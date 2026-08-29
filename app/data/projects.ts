import portfolioContent from '@/content/projects.json'

export type ProjectSection = 'current' | 'past'
export type ProjectMediaType = 'image' | 'video'
export type ProjectDemoType = 'external' | 'video'

export interface PortfolioProject {
  id: string
  section: ProjectSection
  published: boolean
  image: string
  mediaType: ProjectMediaType
  alt: string
  name: string
  year: number
  description: string
  stack: string[]
  github?: string
  demo?: string
  demoType?: ProjectDemoType
}

const projects = portfolioContent.projects as PortfolioProject[]

export const pastProjects = projects.filter(
  (project) => project.published && project.section === 'past',
)

export const currentProjects = projects.filter(
  (project) => project.published && project.section === 'current',
)

export default projects
