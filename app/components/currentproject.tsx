import projectlisting from '@/app/data/currentprojectlisting'
import style from '@/styles/project.module.css'
interface navbarprops {
  theme: string
  language: string
}
const currentProject: React.FC<navbarprops> = (props) => {
  if (!projectlisting || projectlisting.length === 0) {
    return null
  }

  return (
    <>
      {props.language === 'En' ? (
        <h1
          className={
            props.theme === 'Light' ? style.projectname : style.projectnameDark
          }>
          I am currently working on
        </h1>
      ) : (
        <h1
          className={
            props.theme === 'Light' ? style.projectname : style.projectnameDark
          }>
          目前项目
        </h1>
      )}
      <div>
        {projectlisting.map((projectlisting) => (
          <div key={projectlisting.id} className={style.project}>
            <div className={style.projectImage}>
              <img
                className={style.projectImageSize}
                src={projectlisting.img}
              />
            </div>

            <div
              className={
                props.theme === 'Light'
                  ? style.projectContent
                  : style.projectContentDark
              }>
              <div className={style.projectHeader}>
                <h3>{projectlisting.name}</h3>
                <span className={style.projectTime}>{projectlisting.year}</span>
              </div>
              <p>{projectlisting.description}</p>
              <ul
                className={
                  props.theme === 'Light'
                    ? style.projectStack
                    : style.projectStackDark
                }>
                {projectlisting.stack.map((x, index) => (
                  <li key={index}>{x}</li>
                ))}
              </ul>
              <div
                className={
                  props.theme === 'Light'
                    ? style.projectLink
                    : style.projectLinkDark
                }>
                {projectlisting.github ? (
                  <a
                    className={style.projectButton}
                    href={projectlisting.github}
                    target="_blank"
                    rel="noopener noreferrer">
                    Github
                  </a>
                ) : null}
                {projectlisting.demo ? (
                  <a
                    className={style.projectButton}
                    href={projectlisting.demo}
                    target="_blank"
                    rel="noopener noreferrer">
                    Demo
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
export default currentProject
