import projectlisting from '@/app/data/projectlisting'
import ProjectCards from '@/app/components/projectCards'
import style from '@/styles/project.module.css'

interface ProjectProps {
  theme: string
  language: string
}

const Project = ({ theme, language }: ProjectProps) => {
  if (projectlisting.length === 0) return null

  const headingId = 'past-projects-heading'

  return (
    <>
      <h1
        id={headingId}
        className={theme === 'Light' ? style.projectname : style.projectnameDark}>
        {language === 'En' ? 'My past projects' : '项目经历'}
      </h1>
      <ProjectCards
        projects={projectlisting}
        theme={theme}
        language={language}
        displayMode="scroll"
        labelledBy={headingId}
      />
    </>
  )
}

export default Project
