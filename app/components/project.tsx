import projectlisting from '@/app/data/projectlisting'
import style from '@/styles/project.module.css'
interface navbarprops {
  theme: string
  language: string
}
const project: React.FC<navbarprops> = (props) => {
  return (
    <>
      <h1 className={style.projectname}>My project portfolio</h1>
      <div>
        {projectlisting.map((projectlisting) => (
          <div key={projectlisting.id} className={style.project}>
            <div className={style.projectImage}>
              <img
                className={style.projectImageSize}
                src={projectlisting.img}
              />
            </div>

            <div className={style.projectContent}>
              <h3>{projectlisting.name}</h3>
              <p>{projectlisting.description}</p>
              <ul className={style.projectStack}>
                {projectlisting.stack.map((x, index) => (
                  <li key={index}>{x}</li>
                ))}
              </ul>
              <div className={style.projectLink}>
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
