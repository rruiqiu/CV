// Image imports for static export compatibility
import ekanban from '@/public/images/ekanban.jpg'
import SRD from '@/public/images/SRD.jpg'
import HPC from '@/public/images/HPC.png'
import fourdm4 from '@/public/images/4dm4.jpg'
import xv6 from '@/public/images/xv6.png'
import AEV from '@/public/images/AEV.png'
import NNS from '@/public/images/NNS.png'
import tofsensor from '@/public/images/tofsensor.png'
import plant from '@/public/images/plant.png'
import comingsoon from '@/public/images/comingsoon.jpg'

// Export image mappings for static images only
export const imageImports = {
  '/images/ekanban.jpg': ekanban,
  '/images/SRD.jpg': SRD,
  '/images/HPC.png': HPC,
  '/images/4dm4.jpg': fourdm4,
  '/images/xv6.png': xv6,
  '/images/AEV.png': AEV,
  '/images/NNS.png': NNS,
  '/images/tofsensor.png': tofsensor,
  '/images/plant.png': plant,
  '/images/comingsoon.jpg': comingsoon,
}

// Helper function to get the correct image import
export const getImageSrc = (imagePath: string): string => {
  // If it's an external URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath
  }

  // For video files, they need to be served from the public directory
  // Since basePath is set to '/CV', videos need the basePath prefix
  if (imagePath.endsWith('.mp4') || imagePath.endsWith('.mov')) {
    // Videos are served from the public directory with basePath
    // Both development and production: /CV/images/video.mp4
    return `/CV${imagePath}`
  }

  // If it's a local static image path, return the imported image src
  if (imageImports[imagePath as keyof typeof imageImports]) {
    const importedImage = imageImports[imagePath as keyof typeof imageImports]
    return importedImage.src
  }

  // Fallback to the original path with base path
  return `/CV${imagePath}`
}
