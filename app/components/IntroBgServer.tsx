import IntroBg, { type BingWallpaper } from '@/app/components/IntroBg'

interface BingWallpaperResponse {
  images: Array<{
    url: string
    copyright: string
  }>
}

const BING_ORIGIN = 'https://www.bing.com'
const BING_ARCHIVE_URL =
  `${BING_ORIGIN}/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=en-CA`
const BING_REQUEST_TIMEOUT_MS = 8000

const fallbackWallpaper: BingWallpaper = {
  url: '',
  copyright: 'Bing wallpaper is temporarily unavailable',
}

const getWallpapers = async (): Promise<BingWallpaper[]> => {
  try {
    const response = await fetch(BING_ARCHIVE_URL, {
      redirect: 'follow',
      signal: AbortSignal.timeout(BING_REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      throw new Error(`Bing wallpaper request failed with ${response.status}`)
    }

    const data = (await response.json()) as BingWallpaperResponse
    const wallpapers = data.images
      .filter((image) => image.url && image.copyright)
      .map((image) => ({
        url: new URL(image.url, BING_ORIGIN).toString(),
        copyright: image.copyright,
      }))

    return wallpapers.length > 0 ? wallpapers : [fallbackWallpaper]
  } catch (error) {
    console.error('Unable to prepare Bing wallpapers:', error)
    return [fallbackWallpaper]
  }
}

const IntroBgServer = async () => {
  const wallpapers = await getWallpapers()

  return <IntroBg wallpapers={wallpapers} />
}

export default IntroBgServer
