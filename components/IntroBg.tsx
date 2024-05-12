import styles from '@/styles/IntroBg.module.css'
import Link from 'next/link'

async function getBG() {
  const res = await fetch(
    'https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-CA'
  )
  return res.json()
}

const Bg = async () => {
  // console.log(getBG())

  const BGData = getBG()
  const url = await Promise.all([BGData])
  console.log(url[0])

  const ImageLink = url[0].url
  return (
    <>
      <div
        className={styles.BG}
        style={{
          background: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${ImageLink})`,
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        }}>
        <div className={styles.content}>
          <h1 className={styles.name}>Richard Qiu</h1>
          <nav className={styles.navbar}>
            <Link className={styles.linkspace} href={'/About'}>
              BLOG
            </Link>

            <Link className={styles.linkspace} href={'/About'}>
              HOME
            </Link>

            <Link className={styles.linkspace} href={'/About'}>
              GITHUB
            </Link>
          </nav>
        </div>
        <div className={styles.footer}>
          <div>
            <p className={styles.HeaderFooter}>{url[0].copyright}</p>
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
