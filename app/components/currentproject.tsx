import projectlisting from '@/app/data/currentprojectlisting'
import ProjectCards from '@/app/components/projectCards'
import style from '@/styles/project.module.css'

interface CurrentProjectProps {
  theme: string
  language: string
}

const CurrentProject = ({ theme, language }: CurrentProjectProps) => {
  if (projectlisting.length === 0) return null

  return (
    <>
      <h1 className={theme === 'Light' ? style.projectname : style.projectnameDark}>
        {language === 'En' ? 'I am currently working on' : '目前项目'}
      </h1>
      <ProjectCards projects={projectlisting} theme={theme} />
    </>
  )
}

export default CurrentProject
