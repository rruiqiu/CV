'use client'
import styles from '@/styles/IntroBg.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'

//add random function that will allow the user to choose a random image.
//also exploring the cache ability that can reduce the refetching request

interface data {
  ImageLink: string | null
  copyright: string | null
}

interface BingWallpaperData {
  url: string
  copyright: string
}

const Bg = () => {
  const [data, setData] = useState<data>({
    ImageLink: '',
    copyright: '',
  })

  useEffect(() => {
    const getData = async () => {
      const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow',
      }
      try {
        const response = await fetch(
          'https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-CA',
          requestOptions
        )
        if (response.ok) {
          const jsonData = (await response.json()) as BingWallpaperData
          const { url, copyright } = jsonData

          setData({
            ImageLink: url,
            copyright,
          })
          localStorage.setItem('ImageLink', url)
          localStorage.setItem('copyright', copyright)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    void getData()
  }, [])

  return (
    <>
      <div
        className={styles.BG}
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${data.ImageLink})`,
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        }}>
        <div className={styles.content}>
          <h1 className={styles.name}>Richard Qiu</h1>
          <nav className={styles.navbar}>
            <Link
              className={styles.linkspace}
              href={'https://rruiqiu.github.io/Blog/'}
              prefetch={false}>
              BLOG
            </Link>

            <Link className={styles.linkspace} href={'/about'}>
              HOME
            </Link>

            <Link
              className={styles.linkspace}
              href={'https://github.com/rruiqiu'}>
              GITHUB
            </Link>
          </nav>
        </div>
        <div className={styles.footer}>
          <div>
            <p className={styles.HeaderFooter}>{data.copyright}</p>
          </div>
          <div>
            <p className={styles.Description}>
              This is a daily generated background image fetched from
              BingWallpaper
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
export default Bg
