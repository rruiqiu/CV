import { createHash, randomUUID } from 'node:crypto'
import { open, readFile, rename, unlink } from 'node:fs/promises'

const projectKeys = new Set([
  'alt',
  'demo',
  'demoType',
  'description',
  'github',
  'id',
  'image',
  'mediaType',
  'name',
  'published',
  'section',
  'stack',
  'year',
])

const introductionKeys = new Set(['en', 'zh'])
const introductionLocaleKeys = new Set(['body', 'headline'])

export class ContentValidationError extends Error {
  constructor(issues) {
    super('Portfolio content is invalid.')
    this.name = 'ContentValidationError'
    this.issues = issues
  }
}

function addIssue(issues, path, message) {
  issues.push({ path, message })
}

function requiredString(value, path, issues, maxLength) {
  if (typeof value !== 'string') {
    addIssue(issues, path, 'Must be a string.')
    return ''
  }

  const normalized = value.trim()
  if (!normalized) addIssue(issues, path, 'Cannot be empty.')
  if (normalized.length > maxLength) {
    addIssue(issues, path, `Must be ${maxLength} characters or fewer.`)
  }
  return normalized
}

function optionalString(value, path, issues, maxLength) {
  if (value === undefined || value === null || value === '') return undefined
  return requiredString(value, path, issues, maxLength)
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function isLocalImagePath(value) {
  return /^\/images\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value)
}

function hasImageExtension(value) {
  return /\.(avif|gif|jpe?g|png|webp)$/i.test(value)
}

function hasVideoExtension(value) {
  return /\.(mov|mp4|webm)$/i.test(value)
}

function validateMediaReference(value, path, issues) {
  const normalized = requiredString(value, path, issues, 2048)
  if (normalized && !isHttpUrl(normalized) && !isLocalImagePath(normalized)) {
    addIssue(issues, path, 'Use an http(s) URL or /images/<filename>.')
  }
  return normalized
}

function validateExternalUrl(value, path, issues) {
  const normalized = optionalString(value, path, issues, 2048)
  if (normalized && !isHttpUrl(normalized)) {
    addIssue(issues, path, 'Must be an http(s) URL.')
  }
  return normalized
}

function validateIntroductionLocale(value, locale, issues) {
  const path = `introduction.${locale}`
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    addIssue(issues, path, 'Must be an object.')
    return { headline: '', body: '' }
  }

  for (const key of Object.keys(value)) {
    if (!introductionLocaleKeys.has(key)) addIssue(issues, `${path}.${key}`, 'Unknown field.')
  }

  return {
    headline: requiredString(value.headline, `${path}.headline`, issues, 240),
    body: requiredString(value.body, `${path}.body`, issues, 4000),
  }
}

function validateIntroduction(value, issues) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    addIssue(issues, 'introduction', 'Must be an object.')
    return {
      en: { headline: '', body: '' },
      zh: { headline: '', body: '' },
    }
  }

  for (const key of Object.keys(value)) {
    if (!introductionKeys.has(key)) addIssue(issues, `introduction.${key}`, 'Unknown field.')
  }

  return {
    en: validateIntroductionLocale(value.en, 'en', issues),
    zh: validateIntroductionLocale(value.zh, 'zh', issues),
  }
}

function validateProject(value, index, issues) {
  const path = `projects[${index}]`
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    addIssue(issues, path, 'Must be an object.')
    return null
  }

  for (const key of Object.keys(value)) {
    if (!projectKeys.has(key)) addIssue(issues, `${path}.${key}`, 'Unknown field.')
  }

  const id = requiredString(value.id, `${path}.id`, issues, 80)
  if (id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    addIssue(issues, `${path}.id`, 'Use lowercase letters, numbers, and single hyphens.')
  }

  const section = value.section
  if (section !== 'current' && section !== 'past') {
    addIssue(issues, `${path}.section`, 'Must be current or past.')
  }

  if (typeof value.published !== 'boolean') {
    addIssue(issues, `${path}.published`, 'Must be true or false.')
  }

  const year = value.year
  if (!Number.isInteger(year) || year < 1990 || year > 2100) {
    addIssue(issues, `${path}.year`, 'Must be an integer from 1990 through 2100.')
  }

  const name = requiredString(value.name, `${path}.name`, issues, 140)
  const description = requiredString(value.description, `${path}.description`, issues, 4000)
  const image = validateMediaReference(value.image, `${path}.image`, issues)
  const alt = requiredString(value.alt, `${path}.alt`, issues, 240)

  const mediaType = value.mediaType
  if (mediaType !== 'image' && mediaType !== 'video') {
    addIssue(issues, `${path}.mediaType`, 'Must be image or video.')
  }
  if (isLocalImagePath(image) && mediaType === 'image' && !hasImageExtension(image)) {
    addIssue(issues, `${path}.image`, 'The local file extension must match an image media type.')
  }
  if (isLocalImagePath(image) && mediaType === 'video' && !hasVideoExtension(image)) {
    addIssue(issues, `${path}.image`, 'The local file extension must match a video media type.')
  }

  const stack = []
  if (!Array.isArray(value.stack) || value.stack.length === 0 || value.stack.length > 20) {
    addIssue(issues, `${path}.stack`, 'Must contain 1 to 20 tags.')
  } else {
    for (let tagIndex = 0; tagIndex < value.stack.length; tagIndex += 1) {
      stack.push(requiredString(value.stack[tagIndex], `${path}.stack[${tagIndex}]`, issues, 50))
    }
  }

  const github = validateExternalUrl(value.github, `${path}.github`, issues)
  const demo = optionalString(value.demo, `${path}.demo`, issues, 2048)
  const demoType = value.demoType

  if (demo) {
    if (demoType !== 'external' && demoType !== 'video') {
      addIssue(issues, `${path}.demoType`, 'Choose external or video when a demo is set.')
    } else if (demoType === 'external' && !isHttpUrl(demo)) {
      addIssue(issues, `${path}.demo`, 'An external demo must use an http(s) URL.')
    } else if (demoType === 'video' && !isHttpUrl(demo) && !isLocalImagePath(demo)) {
      addIssue(issues, `${path}.demo`, 'A video demo must use an http(s) URL or /images/<filename>.')
    } else if (demoType === 'video' && isLocalImagePath(demo) && !hasVideoExtension(demo)) {
      addIssue(issues, `${path}.demo`, 'A local video demo must use an MP4, WebM, or MOV file.')
    }
  } else if (demoType !== undefined && demoType !== null && demoType !== '') {
    addIssue(issues, `${path}.demoType`, 'Remove the demo type when no demo is set.')
  }

  const project = {
    id,
    section,
    published: value.published,
    image,
    mediaType,
    alt,
    name,
    year,
    description,
    stack,
  }
  if (github) project.github = github
  if (demo) {
    project.demo = demo
    project.demoType = demoType
  }
  return project
}

export function validateContent(value) {
  const issues = []
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ContentValidationError([{ path: 'content', message: 'Must be an object.' }])
  }

  for (const key of Object.keys(value)) {
    if (key !== 'version' && key !== 'introduction' && key !== 'projects') {
      addIssue(issues, key, 'Unknown field.')
    }
  }

  if (value.version !== 2) addIssue(issues, 'version', 'Must be 2.')
  const introduction = validateIntroduction(value.introduction, issues)
  if (!Array.isArray(value.projects) || value.projects.length > 100) {
    addIssue(issues, 'projects', 'Must be an array with no more than 100 projects.')
  }

  const projects = Array.isArray(value.projects)
    ? value.projects.map((project, index) => validateProject(project, index, issues)).filter(Boolean)
    : []
  const seenIds = new Set()
  for (const project of projects) {
    if (seenIds.has(project.id)) addIssue(issues, 'projects', `Duplicate id: ${project.id}`)
    seenIds.add(project.id)
  }

  if (issues.length) throw new ContentValidationError(issues)
  return { version: 2, introduction, projects }
}

export function serializeContent(content) {
  return `${JSON.stringify(content, null, 2)}\n`
}

export function contentEtag(serialized) {
  const digest = createHash('sha256').update(serialized).digest('base64url')
  return `"sha256-${digest}"`
}

export async function readContentSnapshot(filePath) {
  const serialized = await readFile(filePath, 'utf8')
  const content = validateContent(JSON.parse(serialized))
  return { content, etag: contentEtag(serialized), serialized }
}

export async function writeContentAtomically(filePath, content) {
  const serialized = serializeContent(validateContent(content))
  const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`
  let handle

  try {
    handle = await open(temporaryPath, 'wx')
    await handle.writeFile(serialized, 'utf8')
    await handle.sync()
    await handle.close()
    handle = undefined
    await rename(temporaryPath, filePath)
  } catch (error) {
    if (handle) await handle.close().catch(() => {})
    await unlink(temporaryPath).catch(() => {})
    throw error
  }

  return { content: validateContent(content), etag: contentEtag(serialized), serialized }
}

export function detectUploadedMedia(bytes) {
  const header = Buffer.from(bytes)
  const startsWith = (...values) => values.every((value, index) => header[index] === value)
  const text = (start, end) => header.subarray(start, end).toString('ascii')

  if (startsWith(0xff, 0xd8, 0xff)) {
    return { extension: '.jpg', mediaType: 'image', mimeType: 'image/jpeg' }
  }
  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) {
    return { extension: '.png', mediaType: 'image', mimeType: 'image/png' }
  }
  if (text(0, 6) === 'GIF87a' || text(0, 6) === 'GIF89a') {
    return { extension: '.gif', mediaType: 'image', mimeType: 'image/gif' }
  }
  if (text(0, 4) === 'RIFF' && text(8, 12) === 'WEBP') {
    return { extension: '.webp', mediaType: 'image', mimeType: 'image/webp' }
  }
  if (startsWith(0x1a, 0x45, 0xdf, 0xa3)) {
    return { extension: '.webm', mediaType: 'video', mimeType: 'video/webm' }
  }
  if (text(4, 8) === 'ftyp') {
    const brands = []
    for (let offset = 8; offset + 4 <= header.length; offset += 4) {
      brands.push(text(offset, offset + 4))
    }
    if (brands.some((brand) => brand === 'avif' || brand === 'avis')) {
      return { extension: '.avif', mediaType: 'image', mimeType: 'image/avif' }
    }
    if (brands.includes('qt  ')) {
      return { extension: '.mov', mediaType: 'video', mimeType: 'video/quicktime' }
    }
    const mp4Brands = new Set([
      '3g2a',
      '3gp4',
      '3gp5',
      'M4V ',
      'MSNV',
      'avc1',
      'dash',
      'iso2',
      'iso3',
      'iso4',
      'iso5',
      'iso6',
      'isom',
      'mp41',
      'mp42',
    ])
    if (brands.some((brand) => mp4Brands.has(brand))) {
      return { extension: '.mp4', mediaType: 'video', mimeType: 'video/mp4' }
    }
  }
  return null
}
