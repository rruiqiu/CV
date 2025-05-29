import projectlisting from '@/app/data/projectlisting'
import style from '@/styles/project.module.css'
import { useState } from 'react'
interface navbarprops {
  theme: string
  language: string
}
const project: React.FC<navbarprops> = (props) => {
  const [showVideo, setShowVideo] = useState(false)
  const [currentVideo, setCurrentVideo] = useState('')
  return (
    <>
      {props.language === 'En' ? (
        <h1
          className={
            props.theme === 'Light' ? style.projectname : style.projectnameDark
          }>
          My past projects
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
        {[...projectlisting]
          .sort((a, b) => b.year - a.year)
          .map((projectlisting) => (
            <div key={projectlisting.id} className={style.project}>
              <div className={style.projectImage}>
                {projectlisting.name === 'Lunar Lander Agent Landing' ||
                projectlisting.name ===
                  'Autonomous Driving Bike - ECE Capstone Winner' ? (
                  <video
                    className={style.projectImageSize}
                    src={projectlisting.img}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    className={style.projectImageSize}
                    src={projectlisting.img}
                  />
                )}
              </div>

              <div
                className={
                  props.theme === 'Light'
                    ? style.projectContent
                    : style.projectContentDark
                }>
                <div className={style.projectHeader}>
                  <h3>{projectlisting.name}</h3>
                  <span className={style.projectTime}>
                    {projectlisting.year}
                  </span>
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
                    projectlisting.name ===
                    'MAC AEV(Autonomous Electric Vehicle)' ? (
                      <button
                        className={style.projectButton}
                        onClick={() => {
                          console.log(projectlisting.demo)
                          setCurrentVideo(projectlisting.demo)
                          setShowVideo(true)
                        }}>
                        Demo
                      </button>
                    ) : (
                      <a
                        className={style.projectButton}
                        href={projectlisting.demo}
                        target="_blank"
                        rel="noopener noreferrer">
                        Demo
                      </a>
                    )
                  ) : null}
                </div>
              </div>
            </div>
          ))}
      </div>

      {showVideo && (
        <div className={style.modalOverlay} onClick={() => setShowVideo(false)}>
          <div
            className={style.modalContent}
            onClick={(e) => e.stopPropagation()}>
            <button
              className={style.closeButton}
              onClick={() => setShowVideo(false)}>
              ×
            </button>
            <video controls autoPlay muted className={style.videoPlayer}>
              <source src={currentVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  )
}

export default project
