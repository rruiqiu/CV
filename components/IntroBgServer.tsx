//this is the example of the server fetching which will handle the cache and validation better, but in order to host my CV into github pages, the site has to be static. (I will consider use this after I migrate this site to the server)
import styles from '@/styles/IntroBg.module.css'
import Link from 'next/link'

async function getBG() {
  const url =
    'https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-CA'

  console.log(`Fetching data from: ${url}`)
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }
  const json = await response.json()
  console.log('Fetched data:', json)
  return json
}

//also add another function to allow user auto pick a random wallpaper from 0-7
const Bg = async () => {
  const BGData = await getBG()
  console.log(BGData)

  if (!BGData) {
    console.error('Failed to fetch background data')
    return
  }
  // const url = await Promise.all([BGData])
  const url = [BGData]
  const ImageLink = url[0]?.url
  if (!ImageLink) {
    console.error('Image URL not found in the fetched data')
    return
  }
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
            <Link
              className={styles.linkspace}
              href={'https://rruiqiu.github.io/Blog/'}>
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
