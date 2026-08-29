import { useEffect, useRef, useState } from 'react'
import { getImageSrc } from '@/app/data/imageImports'
import type { PortfolioProject } from '@/app/data/projects'
import style from '@/styles/project.module.css'

interface ProjectCardsProps {
  projects: PortfolioProject[]
  theme: string
}

interface ActiveVideo {
  src: string
  title: string
}

const getVideoMimeType = (src: string) => {
  if (/\.mov(?:[?#].*)?$/i.test(src)) return 'video/quicktime'
  if (/\.webm(?:[?#].*)?$/i.test(src)) return 'video/webm'
  return 'video/mp4'
}

const ProjectCards = ({ projects, theme }: ProjectCardsProps) => {
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!activeVideo) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveVideo(null)
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeVideo])

  return (
    <>
      <div>
        {projects.map((project) => (
          <div key={project.id} className={style.project}>
            <div className={style.projectImage}>
              {project.mediaType === 'video' ? (
                <video
                  className={style.projectImageSize}
                  src={getImageSrc(project.image)}
                  aria-label={project.alt}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                // Project media can be either a local file or an external URL.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={style.projectImageSize}
                  src={getImageSrc(project.image)}
                  alt={project.alt}
                />
              )}
            </div>

            <div
              className={
                theme === 'Light' ? style.projectContent : style.projectContentDark
              }>
              <div className={style.projectHeader}>
                <h3>{project.name}</h3>
                <span className={style.projectTime}>{project.year}</span>
              </div>
              <p>{project.description}</p>
              <ul
                className={
                  theme === 'Light' ? style.projectStack : style.projectStackDark
                }>
                {project.stack.map((tag, index) => (
                  <li key={`${tag}-${index}`}>{tag}</li>
                ))}
              </ul>
              <div
                className={
                  theme === 'Light' ? style.projectLink : style.projectLinkDark
                }>
                {project.github ? (
                  <a
                    className={style.projectButton}
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer">
                    Github
                  </a>
                ) : null}
                {project.demo ? (
                  project.demoType === 'video' ? (
                    <button
                      type="button"
                      className={style.projectButton}
                      onClick={() =>
                        setActiveVideo({ src: project.demo as string, title: project.name })
                      }>
                      Demo
                    </button>
                  ) : (
                    <a
                      className={style.projectButton}
                      href={project.demo}
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

      {activeVideo ? (
        <div
          className={style.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeVideo.title} demo video`}
          onClick={() => setActiveVideo(null)}>
          <div className={style.modalContent} onClick={(event) => event.stopPropagation()}>
            <button
              ref={closeButtonRef}
              type="button"
              className={style.closeButton}
              aria-label="Close demo video"
              onClick={() => setActiveVideo(null)}>
              ×
            </button>
            <video controls autoPlay className={style.videoPlayer}>
              <source
                src={getImageSrc(activeVideo.src)}
                type={getVideoMimeType(activeVideo.src)}
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ProjectCards
