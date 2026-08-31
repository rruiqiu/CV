import { useEffect, useId, useRef, useState } from 'react'
import { getImageSrc } from '@/app/data/imageImports'
import type { PortfolioProject } from '@/app/data/projects'
import style from '@/styles/project.module.css'

interface ProjectCardsProps {
  projects: PortfolioProject[]
  theme: string
  language?: string
  displayMode?: 'list' | 'scroll'
  labelledBy?: string
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

interface ProjectPreviewVideoProps {
  src: string
  alt: string
  autoplay: boolean
}

const ProjectPreviewVideo = ({ src, alt, autoplay }: ProjectPreviewVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const manuallyPausedRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!autoplay) {
      video.pause()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.35 &&
          !manuallyPausedRef.current
        ) {
          void video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { threshold: [0, 0.35] },
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [autoplay])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      manuallyPausedRef.current = false
      void video.play().catch(() => undefined)
    } else {
      manuallyPausedRef.current = true
      video.pause()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLVideoElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    togglePlayback()
  }

  return (
    <video
      ref={videoRef}
      className={`${style.projectImageSize} ${style.projectMotionPreview}`}
      src={getImageSrc(src)}
      role="button"
      aria-label={`${alt}. ${isPlaying ? 'Pause' : 'Play'} animation`}
      title={isPlaying ? 'Pause animation' : 'Play animation'}
      tabIndex={0}
      loop
      muted
      playsInline
      preload="metadata"
      width={300}
      height={200}
      onClick={togglePlayback}
      onKeyDown={handleKeyDown}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
    />
  )
}

const ProjectCards = ({
  projects,
  theme,
  language = 'En',
  displayMode = 'list',
  labelledBy,
}: ProjectCardsProps) => {
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null)
  const [autoplayPreviews, setAutoplayPreviews] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const videoOpenerRef = useRef<HTMLButtonElement | null>(null)
  const instructionsId = useId()
  const isScrollable = displayMode === 'scroll' && projects.length > 0
  const isEnglish = language === 'En'

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncAutoplay = () => setAutoplayPreviews(!reduceMotionQuery.matches)

    syncAutoplay()
    reduceMotionQuery.addEventListener('change', syncAutoplay)

    return () => reduceMotionQuery.removeEventListener('change', syncAutoplay)
  }, [])

  useEffect(() => {
    if (!activeVideo) return
    const previousOverflow = document.body.style.overflow
    const opener = videoOpenerRef.current
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveVideo(null)
        return
      }

      if (event.key !== 'Tab') return

      const modal = modalContentRef.current
      if (!modal) return

      const focusableElements = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], video[controls], [tabindex]:not([tabindex="-1"])',
        ),
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (!firstElement || !lastElement) {
        event.preventDefault()
        closeButtonRef.current?.focus()
        return
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      } else if (!modal.contains(document.activeElement)) {
        event.preventDefault()
        firstElement.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (opener?.isConnected) opener.focus()
    }
  }, [activeVideo])

  const renderProject = (project: PortfolioProject) => (
    <article key={project.id} className={style.project}>
      <div className={style.projectImage}>
        {project.mediaType === 'video' ? (
          <ProjectPreviewVideo
            src={project.image}
            alt={project.alt}
            autoplay={autoplayPreviews}
          />
        ) : (
          // Project media can be either a local file or an external URL.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={style.projectImageSize}
            src={getImageSrc(project.image)}
            alt={project.alt}
            loading="lazy"
            decoding="async"
            width={300}
            height={200}
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
          className={theme === 'Light' ? style.projectStack : style.projectStackDark}>
          {project.stack.map((tag, index) => (
            <li key={`${tag}-${index}`}>{tag}</li>
          ))}
        </ul>
        <div
          className={theme === 'Light' ? style.projectLink : style.projectLinkDark}>
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
                onClick={(event) => {
                  videoOpenerRef.current = event.currentTarget
                  setActiveVideo({ src: project.demo as string, title: project.name })
                }}>
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
    </article>
  )

  return (
    <>
      {isScrollable ? (
        <div className={style.projectBrowser}>
          <p id={instructionsId} className={style.visuallyHidden}>
            {isEnglish
              ? 'Scroll this region to browse the project list.'
              : '滚动此区域浏览项目列表。'}
          </p>

          <div
            className={
              theme === 'Light' ? style.projectViewport : style.projectViewportDark
            }
            role="region"
            aria-labelledby={labelledBy}
            aria-describedby={instructionsId}
            tabIndex={0}>
            <div className={style.projectScrollList}>
              {projects.map(renderProject)}
            </div>
          </div>
        </div>
      ) : (
        <div className={style.projectList}>{projects.map(renderProject)}</div>
      )}

      {activeVideo ? (
        <div
          className={style.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeVideo.title} demo video`}
          onClick={() => setActiveVideo(null)}>
          <div
            ref={modalContentRef}
            className={style.modalContent}
            onClick={(event) => event.stopPropagation()}>
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
