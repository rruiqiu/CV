import projectlisting from '@/app/data/projectlisting'
import style from '@/styles/project.module.css'
interface navbarprops {
  theme: string
  language: string
}
const project: React.FC<navbarprops> = (props) => {
  return (
    <>
      {props.language === 'En' ? (
        <h1
          className={
            props.theme === 'Light' ? style.projectname : style.projectnameDark
          }>
          My project portfolio
        </h1>
      ) : (
        <h1
          className={
            props.theme === 'Light' ? style.projectname : style.projectnameDark
          }>
          项目经历
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
              <h3>{projectlisting.name}</h3>
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
                    href={projectlisting.github}>
                    Github
                  </a>
                ) : null}
                {projectlisting.demo ? (
                  <a className={style.projectButton} href={projectlisting.demo}>
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

export default project
