import { useEffect, useId, useRef, useState } from 'react'
import { FiMaximize2 } from 'react-icons/fi'
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

type ActiveMedia =
  | { type: 'image'; src: string; title: string; alt: string }
  | { type: 'video'; src: string; title: string; loop?: boolean }

const getVideoMimeType = (src: string) => {
  if (/\.mov(?:[?#].*)?$/i.test(src)) return 'video/quicktime'
  if (/\.webm(?:[?#].*)?$/i.test(src)) return 'video/webm'
  return 'video/mp4'
}

interface ProjectPreviewVideoProps {
  src: string
  title: string
  autoplay: boolean
  isEnglish: boolean
  onOpen: (opener: HTMLButtonElement) => void
}

const ProjectPreviewVideo = ({
  src,
  title,
  autoplay,
  isEnglish,
  onOpen,
}: ProjectPreviewVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

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
          entry.intersectionRatio >= 0.35
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

  return (
    <button
      type="button"
      className={style.projectImageButton}
      aria-haspopup="dialog"
      aria-label={
        isEnglish ? `View ${title} video larger` : `放大查看 ${title} 视频`
      }
      title={isEnglish ? 'View larger' : '放大查看'}
      onClick={(event) => onOpen(event.currentTarget)}>
      <video
        ref={videoRef}
        className={`${style.projectImageSize} ${style.projectMotionPreview}`}
        src={getImageSrc(src)}
        aria-hidden="true"
        loop
        muted
        playsInline
        preload="metadata"
        width={300}
        height={200}
      />
      <span className={style.imageZoomHint} aria-hidden="true">
        <FiMaximize2 />
      </span>
    </button>
  )
}

const ProjectCards = ({
  projects,
  theme,
  language = 'En',
  displayMode = 'list',
  labelledBy,
}: ProjectCardsProps) => {
  const [activeMedia, setActiveMedia] = useState<ActiveMedia | null>(null)
  const [autoplayPreviews, setAutoplayPreviews] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const mediaOpenerRef = useRef<HTMLButtonElement | null>(null)
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
    if (!activeMedia) return
    const previousOverflow = document.body.style.overflow
    const opener = mediaOpenerRef.current
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMedia(null)
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
  }, [activeMedia])

  const renderProject = (project: PortfolioProject) => (
    <article key={project.id} className={style.project}>
      <div className={style.projectImage}>
        {project.mediaType === 'video' ? (
          <ProjectPreviewVideo
            src={project.image}
            title={project.name}
            autoplay={autoplayPreviews && !activeMedia}
            isEnglish={isEnglish}
            onOpen={(opener) => {
              mediaOpenerRef.current = opener
              setActiveMedia({
                type: 'video',
                src: project.image,
                title: project.name,
                loop: true,
              })
            }}
          />
        ) : (
          <button
            type="button"
            className={style.projectImageButton}
            aria-haspopup="dialog"
            aria-label={
              isEnglish
                ? `View ${project.name} image larger`
                : `放大查看 ${project.name} 图片`
            }
            title={isEnglish ? 'View larger' : '放大查看'}
            onClick={(event) => {
              mediaOpenerRef.current = event.currentTarget
              setActiveMedia({
                type: 'image',
                src: project.image,
                title: project.name,
                alt: project.alt,
              })
            }}>
            {/* Project media can be either a local file or an external URL. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={style.projectImageSize}
              src={getImageSrc(project.image)}
              alt={project.alt}
              loading="lazy"
              decoding="async"
              width={300}
              height={200}
            />
            <span className={style.imageZoomHint} aria-hidden="true">
              <FiMaximize2 />
            </span>
          </button>
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
                aria-haspopup="dialog"
                onClick={(event) => {
                  mediaOpenerRef.current = event.currentTarget
                  setActiveMedia({
                    type: 'video',
                    src: project.demo as string,
                    title: project.name,
                  })
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

      {activeMedia ? (
        <div
          className={style.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={
            activeMedia.type === 'image'
              ? isEnglish
                ? `${activeMedia.title} enlarged image`
                : `${activeMedia.title} 放大图片`
              : `${activeMedia.title} demo video`
          }
          onClick={() => setActiveMedia(null)}>
          <div
            ref={modalContentRef}
            className={style.modalContent}
            onClick={(event) => event.stopPropagation()}>
            <button
              ref={closeButtonRef}
              type="button"
              className={style.closeButton}
              aria-label={
                activeMedia.type === 'image'
                  ? isEnglish
                    ? 'Close enlarged image'
                    : '关闭放大图片'
                  : 'Close demo video'
              }
              onClick={() => setActiveMedia(null)}>
              ×
            </button>
            {activeMedia.type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={style.imageViewer}
                src={getImageSrc(activeMedia.src)}
                alt={activeMedia.alt}
                decoding="async"
              />
            ) : (
              <video
                controls
                autoPlay
                loop={activeMedia.loop}
                playsInline
                className={style.videoPlayer}>
                <source
                  src={getImageSrc(activeMedia.src)}
                  type={getVideoMimeType(activeMedia.src)}
                />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ProjectCards
