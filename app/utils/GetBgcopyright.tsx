'use client'
import styles from '@/styles/IntroBg.module.css'
import { useEffect, useState } from 'react'

const getCopyRight = () => {
  const [data, setData] = useState('')

  useEffect(() => {
    fetch(
      'https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-CA'
    )
      .then((resp) => resp.json())
      .then((apiData) => {
        setData(apiData.copyright)
      })
  }, [])

  return (
    <>
      <div className={styles.footer}>
        <div>
          <p className={styles.HeaderFooter}>{data}</p>
        </div>
        <div>
          <p className={styles.Description}>
            This is a daily generated background image fetched from
            BingWallpaper
          </p>
        </div>
      </div>
    </>
  )
}
export default getCopyRight
