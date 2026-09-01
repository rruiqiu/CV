'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import styles from '@/styles/IntroBg.module.css'

export interface BingWallpaper {
  url: string
  copyright: string
}

interface IntroBgProps {
  wallpapers: BingWallpaper[]
}

const IntroBg = ({ wallpapers }: IntroBgProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeWallpaper = wallpapers[activeIndex] ?? wallpapers[0]
  const canSwitchWallpaper = wallpapers.length > 1

  useEffect(() => {
    if (!canSwitchWallpaper) return

    const nextIndex = (activeIndex + 1) % wallpapers.length
    const preloadTimer = window.setTimeout(() => {
      const nextWallpaper = new Image()
      const nextWallpaperUrl = wallpapers[nextIndex].url
      if (nextWallpaperUrl) nextWallpaper.src = nextWallpaperUrl
    }, 1200)

    return () => window.clearTimeout(preloadTimer)
  }, [activeIndex, canSwitchWallpaper, wallpapers])

  if (!activeWallpaper) return null

  const switchWallpaper = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % wallpapers.length)
  }

  const backgroundImage = activeWallpaper.url
    ? `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${activeWallpaper.url})`
    : 'linear-gradient(135deg, #182231, #0d1118)'
  const footerDescription = activeWallpaper.url
    ? `Selected from Bing's latest daily wallpapers`
    : 'A fallback background is being shown'

  return (
    <div
      className={styles.BG}
      style={{
        backgroundImage,
      }}>
      <div className={styles.content}>
        <h1 className={styles.name}>Richard Qiu</h1>
        <nav className={styles.navbar}>
          <Link
            className={styles.linkspace}
            href="https://rruiqiu.github.io/Blog/"
            prefetch={false}>
            BLOG
          </Link>

          <Link className={styles.linkspace} href="/about">
            HOME
          </Link>

          <Link className={styles.linkspace} href="https://github.com/rruiqiu">
            GITHUB
          </Link>
        </nav>
      </div>

      <footer className={styles.footer}>
        <p className={styles.HeaderFooter} aria-live="polite">
          {activeWallpaper.copyright}
        </p>
        <div className={styles.footerActions}>
          <p className={styles.Description}>{footerDescription}</p>
          {canSwitchWallpaper ? (
            <button
              type="button"
              className={styles.wallpaperButton}
              onClick={switchWallpaper}>
              <FiRefreshCw aria-hidden="true" />
              Get a new one
            </button>
          ) : null}
        </div>
      </footer>
    </div>
  )
}

export default IntroBg
