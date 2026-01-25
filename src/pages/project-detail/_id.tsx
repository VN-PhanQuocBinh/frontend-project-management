import { useEffect, useState } from 'react'
import ProjectBar from './project-bar'
import ProjectContent from './project-content/project-content'
import { mockData } from '@/api/mock-data'
import { type Project } from '@/types/project'

function ProjectDetail() {
  const [project, setProject] = useState<Project | null>(mockData.project as Project)

  useEffect(() => {
    console.log('Project Detail Page Loaded', project)
  }, [])

  return (
    <div className='h-full'>
      <ProjectBar />
      <ProjectContent project={project} />
    </div>
  )
}

export default ProjectDetail