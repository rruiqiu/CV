import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { execFile } from 'node:child_process'
import { createReadStream } from 'node:fs'
import { lstat, open, readFile, readdir, realpath, rename, unlink } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, sep } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import {
  ContentValidationError,
  detectUploadedMedia,
  isLocalImagePath,
  readContentSnapshot,
  serializeContent,
  validateContent,
  validateProfile,
  writeContentAtomically,
} from './admin-core.mjs'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const adminRoot = join(projectRoot, 'admin')
const imagesRoot = await realpath(join(projectRoot, 'public', 'images'))
const imagesRootPrefix = `${imagesRoot.toLowerCase().replace(/[\\/]$/, '')}${sep}`
const projectsFile = join(projectRoot, 'content', 'projects.json')
const host = '127.0.0.1'
const port = Number.parseInt(process.env.PORT ?? '4173', 10)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer from 1 through 65535.')
}

const origin = `http://${host}:${port}`
const expectedHost = `${host}:${port}`
const sessionToken = randomBytes(32).toString('base64url')
const maxJsonBytes = 600 * 1024
const maxImageBytes = 10 * 1024 * 1024
const maxVideoBytes = 100 * 1024 * 1024
let mutationActive = false
const generatedProfileFilename = /^profile-[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}-\d+\.webp$/i
const legacyMediaExtensions = new Map([
  ['/images/ekanban.jpg', '.png'],
  ['/images/4dm4.jpg', '.webp'],
])

const staticFiles = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/admin.css', ['admin.css', 'text/css; charset=utf-8']],
  ['/admin.js', ['admin.js', 'text/javascript; charset=utf-8']],
])

const imageContentTypes = new Map([
  ['.avif', 'image/avif'],
  ['.gif', 'image/gif'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.mov', 'video/quicktime'],
  ['.mp4', 'video/mp4'],
  ['.png', 'image/png'],
  ['.webm', 'video/webm'],
  ['.webp', 'image/webp'],
])

const securityHeaders = {
  'Cache-Control': 'no-store',
  'Content-Security-Policy': [
    "default-src 'self'",
    "connect-src 'self'",
    "img-src 'self' data: blob: http: https:",
    "media-src 'self' blob: http: https:",
    "style-src 'self'",
    "script-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self'",
  ].join('; '),
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
}

class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.details = details
  }
}

function send(res, statusCode, body, contentType = 'text/plain; charset=utf-8', headers = {}) {
  const length = typeof body === 'string' ? Buffer.byteLength(body) : body.length
  res.writeHead(statusCode, {
    ...securityHeaders,
    'Content-Length': length,
    'Content-Type': contentType,
    ...headers,
  })
  res.end(body)
}

function sendJson(res, statusCode, value, headers = {}) {
  send(res, statusCode, JSON.stringify(value), 'application/json; charset=utf-8', headers)
}

function ensureTrustedHost(req) {
  if (req.headers.host !== expectedHost) {
    throw new HttpError(421, `Open the admin at ${origin}.`)
  }
}

function ensureAuthorized(req, { requireOrigin = false } = {}) {
  if (req.headers['x-admin-token'] !== sessionToken) {
    throw new HttpError(401, 'The local admin session has expired. Reload the page.')
  }

  const fetchSite = req.headers['sec-fetch-site']
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') {
    throw new HttpError(403, 'Cross-site requests are not allowed.')
  }

  if (requireOrigin && req.headers.origin !== origin) {
    throw new HttpError(403, 'The request origin is not allowed.')
  }
}

async function readRequestBuffer(req, maxBytes) {
  const declaredLength = Number.parseInt(req.headers['content-length'] ?? '0', 10)
  if (declaredLength > maxBytes) throw new HttpError(413, 'The request is too large.')

  const chunks = []
  let totalBytes = 0
  for await (const chunk of req) {
    totalBytes += chunk.length
    if (totalBytes > maxBytes) throw new HttpError(413, 'The request is too large.')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

async function readJsonBody(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) {
    throw new HttpError(415, 'Expected an application/json request.')
  }

  const body = await readRequestBuffer(req, maxJsonBytes)
  try {
    return JSON.parse(body.toString('utf8'))
  } catch {
    throw new HttpError(400, 'The JSON request body is invalid.')
  }
}

async function withMutation(req, task) {
  if (mutationActive) {
    req.resume()
    throw new HttpError(423, 'Another save, upload, or publish operation is still running.', {
      code: 'operation_busy',
    })
  }

  mutationActive = true
  try {
    return await task()
  } finally {
    mutationActive = false
  }
}

function localMediaReferences(content) {
  const references = new Map()
  const addReference = (src, expectedType, label) => {
    if (!src?.startsWith('/images/')) return
    const existing = references.get(src)
    if (existing && existing.expectedType !== expectedType) {
      throw new HttpError(422, `${src} is used as both image and video media.`)
    }
    references.set(src, { src, expectedType, label })
  }

  addReference(content.profile.image, 'image', 'Profile photo')
  addReference(content.profile.sourceImage, 'image', 'Original profile photo')
  for (const project of content.projects) {
    addReference(project.image, project.mediaType, `${project.name} media`)
    if (project.demo && project.demoType === 'video') {
      addReference(project.demo, 'video', `${project.name} demo`)
    }
  }
  return [...references.values()]
}

function isInsideImagesRoot(resolvedPath) {
  return resolvedPath.toLowerCase().startsWith(imagesRootPrefix)
}

async function readMediaSignature(filePath) {
  const handle = await open(filePath, 'r')
  try {
    const header = Buffer.alloc(32)
    const { bytesRead } = await handle.read(header, 0, header.length, 0)
    return detectUploadedMedia(header.subarray(0, bytesRead))
  } finally {
    await handle.close()
  }
}

async function hashFile(filePath) {
  const hash = createHash('sha256')
  for await (const chunk of createReadStream(filePath)) hash.update(chunk)
  return hash.digest('base64url')
}

function extensionMatchesDetectedMedia(reference, detected) {
  const extension = extname(reference.src).toLowerCase()
  const detectedExtension = detected.extension
  if (detectedExtension === '.jpg' && (extension === '.jpg' || extension === '.jpeg')) return true
  if (extension === detectedExtension) return true
  return legacyMediaExtensions.get(reference.src) === detectedExtension
}

async function validateLocalMedia(content, { includeHashes = false } = {}) {
  const manifest = new Map()

  for (const reference of localMediaReferences(content)) {
    const filename = reference.src.slice('/images/'.length)
    const candidatePath = join(imagesRoot, filename)
    let fileInfo

    try {
      fileInfo = await lstat(candidatePath)
    } catch (error) {
      if (error?.code === 'ENOENT') {
        throw new HttpError(422, `${reference.label} does not exist: ${reference.src}`)
      }
      throw error
    }

    if (!fileInfo.isFile() || fileInfo.isSymbolicLink()) {
      throw new HttpError(422, `${reference.label} must be a regular local file.`)
    }
    const sizeLimit = reference.expectedType === 'image' ? maxImageBytes : maxVideoBytes
    if (fileInfo.size > sizeLimit) {
      const limitLabel = reference.expectedType === 'image' ? '10 MB' : '100 MB'
      throw new HttpError(422, `${reference.label} must be ${limitLabel} or smaller.`)
    }

    const resolvedPath = await realpath(candidatePath)
    if (!isInsideImagesRoot(resolvedPath)) {
      throw new HttpError(422, `${reference.label} resolves outside public/images.`)
    }

    const detected = await readMediaSignature(resolvedPath)
    if (!detected || detected.mediaType !== reference.expectedType) {
      throw new HttpError(422, `${reference.label} does not match its declared media type.`)
    }
    if (!extensionMatchesDetectedMedia(reference, detected)) {
      throw new HttpError(422, `${reference.label} has an extension that does not match its contents.`)
    }

    const repoPath = `public${reference.src}`.replaceAll('\\', '/')
    manifest.set(repoPath, includeHashes ? await hashFile(resolvedPath) : null)
  }

  return manifest
}

async function saveProjects(req) {
  const ifMatch = req.headers['if-match']
  if (!ifMatch) throw new HttpError(428, 'Reload the page before saving content.')
  const content = validateContent(await readJsonBody(req))

  const current = await readContentSnapshot(projectsFile)
  if (ifMatch !== current.etag) {
    throw new HttpError(409, 'Portfolio content changed on disk. Reload before saving again.', {
      code: 'etag_conflict',
      currentEtag: current.etag,
    })
  }
  return writeProfileContent(content, current)
}

async function writeProfileContent(content, current) {
  const profile = content.profile
  let generatedPath
  try {
    // Validate the original before opening it with the image decoder.
    await validateLocalMedia({ profile, projects: [] })
    if (profile.resolution === 0) {
      profile.image = profile.sourceImage
    } else if (profile.sourceImage === current.content.profile.sourceImage && profile.resolution === current.content.profile.resolution) {
      profile.image = current.content.profile.image
    } else {
      const { bytes: resized } = await renderProfileResolution(profile)
      const filename = `profile-${randomUUID()}-${profile.resolution}.webp`
      generatedPath = join(imagesRoot, filename)
      const handle = await open(generatedPath, 'wx')
      try {
        await handle.writeFile(resized)
        await handle.sync()
      } finally {
        await handle.close()
      }
      profile.image = `/images/${filename}`
    }
    await validateLocalMedia(content)
    if ((await readContentSnapshot(projectsFile)).etag !== current.etag) {
      throw new HttpError(409, 'Portfolio content changed on disk. Reload before saving again.', { code: 'etag_conflict' })
    }
    return await writeContentAtomically(projectsFile, content)
  } catch (error) {
    if (generatedPath) await unlink(generatedPath).catch(() => {})
    throw error
  }
}

async function renderProfileResolution(profile) {
  await validateLocalMedia({ profile, projects: [] })
  const sourceBytes = await readFile(join(imagesRoot, profile.sourceImage.slice('/images/'.length)))
  if (profile.resolution === 0) {
    return { bytes: sourceBytes, mimeType: detectUploadedMedia(sourceBytes.subarray(0, 32)).mimeType }
  }
  try {
    const bytes = await sharp(sourceBytes, { limitInputPixels: 40_000_000 })
      .rotate()
      .resize(profile.resolution, profile.resolution, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()
    return { bytes, mimeType: 'image/webp' }
  } catch {
    throw new HttpError(422, 'This photo could not be resized. Choose another JPEG, PNG, WebP, GIF or AVIF image.')
  }
}

async function cleanupProfileVersions(req) {
  const snapshot = await readContentSnapshot(projectsFile)
  if (req.headers['if-match'] !== snapshot.etag) {
    throw new HttpError(409, 'Portfolio content changed on disk. Reload before cleaning up.', { code: 'etag_conflict' })
  }
  const body = await readJsonBody(req)
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(422, 'Expected cleanup options.')
  const { retainImages = [] } = body
  if (!Array.isArray(retainImages) || retainImages.length > 300 || retainImages.some((path) => typeof path !== 'string' || !isLocalImagePath(path))) {
    throw new HttpError(422, 'Retained images must be local /images/<filename> paths.')
  }
  const keep = new Set([...localMediaReferences(snapshot.content).map(({ src }) => src.toLowerCase()), ...retainImages.map((path) => path.toLowerCase())])
  const removed = []
  let bytesRemoved = 0
  for (const entry of await readdir(imagesRoot, { withFileTypes: true })) {
    // Only files generated by this photo editor qualify; originals and project uploads are never removed.
    if (!entry.isFile() || !generatedProfileFilename.test(entry.name)) continue
    const src = `/images/${entry.name}`
    if (keep.has(src.toLowerCase())) continue
    const candidate = join(imagesRoot, entry.name)
    const info = await lstat(candidate)
    if (!info.isFile() || info.isSymbolicLink() || !isInsideImagesRoot(await realpath(candidate))) continue
    await unlink(candidate)
    removed.push(src)
    bytesRemoved += info.size
  }
  return { removed, bytesRemoved }
}

async function saveUpload(req, { imageOnly = false } = {}) {
  const declaredLength = Number.parseInt(req.headers['content-length'] ?? '0', 10)
  if (declaredLength > (imageOnly ? maxImageBytes : maxVideoBytes)) {
    throw new HttpError(413, imageOnly ? 'Images must be 10 MB or smaller.' : 'Videos must be 100 MB or smaller.')
  }

  const temporaryPath = join(imagesRoot, `.portfolio-upload-${randomUUID()}.tmp`)
  let handle
  let totalBytes = 0
  let header = Buffer.alloc(0)
  let detected = null

  try {
    handle = await open(temporaryPath, 'wx')
    for await (const chunk of req) {
      totalBytes += chunk.length
      if (totalBytes > maxVideoBytes) throw new HttpError(413, 'Videos must be 100 MB or smaller.')
      if (header.length < 32) {
        const missingHeaderBytes = 32 - header.length
        header = Buffer.concat([header, chunk.subarray(0, missingHeaderBytes)])
      }
      if (!detected && header.length >= 12) detected = detectUploadedMedia(header)
      if (imageOnly && totalBytes > maxImageBytes) throw new HttpError(413, 'Images must be 10 MB or smaller.')
      if (imageOnly && detected?.mediaType === 'video') throw new HttpError(415, 'Choose an image for your profile photo.')
      if (detected?.mediaType === 'image' && totalBytes > maxImageBytes) {
        throw new HttpError(413, 'Images must be 10 MB or smaller.')
      }
      await handle.write(chunk)
    }

    if (totalBytes === 0) throw new HttpError(400, 'Choose a file to upload.')
    detected ??= detectUploadedMedia(header)
    if (!detected) {
      throw new HttpError(415, 'Use AVIF, JPEG, PNG, GIF, WebP, MP4, WebM, or MOV media.')
    }
    if (imageOnly && detected.mediaType !== 'image') throw new HttpError(415, 'Choose an image for your profile photo.')
    if (detected.mediaType === 'image' && totalBytes > maxImageBytes) {
      throw new HttpError(413, 'Images must be 10 MB or smaller.')
    }

    await handle.sync()
    await handle.close()
    handle = undefined

    const filename = `${randomUUID()}${detected.extension}`
    const finalPath = join(imagesRoot, filename)
    await rename(temporaryPath, finalPath)
    return {
      path: `/images/${filename}`,
      mediaType: detected.mediaType,
      mimeType: detected.mimeType,
      size: totalBytes,
    }
  } catch (error) {
    if (handle) await handle.close().catch(() => {})
    await unlink(temporaryPath).catch(() => {})
    throw error
  }
}

async function saveProfile(req) {
  const current = await readContentSnapshot(projectsFile)
  if (!req.headers['if-match']) throw new HttpError(428, 'Reload the page before saving your photo.')
  if (req.headers['if-match'] !== current.etag) {
    throw new HttpError(409, 'Portfolio content changed on disk. Reload before saving again.', {
      code: 'etag_conflict', currentEtag: current.etag,
    })
  }
  let uploaded
  try {
    const profile = validateProfile(req.method === 'POST'
      ? { image: (uploaded = await saveUpload(req, { imageOnly: true })).path, resolution: current.content.profile.resolution, zoom: 1, x: 50, y: 50 }
      : await readJsonBody(req))
    const content = { ...current.content, profile }
    return await writeProfileContent(content, current)
  } catch (error) {
    if (uploaded) await unlink(join(imagesRoot, uploaded.path.slice('/images/'.length))).catch(() => {})
    throw error
  }
}

function runGit(args) {
  return new Promise((resolve, reject) => {
    execFile(
      'git',
      args,
      {
        cwd: projectRoot,
        encoding: 'utf8',
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        maxBuffer: 4 * 1024 * 1024,
        timeout: 120_000,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        if (error) {
          error.stdout = stdout
          error.stderr = stderr
          reject(error)
          return
        }
        resolve({ stderr, stdout })
      },
    )
  })
}

function normalizeGitPath(pathname) {
  return pathname.replaceAll('\\', '/').replace(/^"|"$/g, '')
}

function pathsFromStatusLine(line) {
  const pathname = line.slice(3)
  return (pathname.includes(' -> ') ? pathname.split(' -> ') : [pathname]).map(normalizeGitPath)
}

async function optionalGit(args) {
  try {
    return (await runGit(args)).stdout.trim()
  } catch {
    return ''
  }
}

async function getPublishPlan() {
  const snapshot = await readContentSnapshot(projectsFile)
  const mediaManifest = await validateLocalMedia(snapshot.content, { includeHashes: true })
  const sortedMediaEntries = [...mediaManifest.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  )
  const publishPaths = ['content/projects.json', ...sortedMediaEntries.map(([pathname]) => pathname)]
  const mediaHashes = Object.fromEntries(sortedMediaEntries)
  const publishPathSet = new Set(publishPaths)
  const branch = (await runGit(['branch', '--show-current'])).stdout.trim()
  const head = (await runGit(['rev-parse', 'HEAD'])).stdout.trim()
  const statusText = (await runGit(['status', '--porcelain=v1', '--untracked-files=all'])).stdout
  const statusLines = statusText.split(/\r?\n/).filter(Boolean)
  // Include cleanup deletions in the reviewed publish plan so old versions also leave the deployed project.
  for (const line of statusLines) {
    const paths = pathsFromStatusLine(line)
    const pathname = paths[0]
    if (paths.length !== 1 || ![' D', 'D '].includes(line.slice(0, 2)) || !pathname.startsWith('public/images/')) continue
    if (!generatedProfileFilename.test(pathname.slice('public/images/'.length)) || publishPathSet.has(pathname)) continue
    const stillExists = await lstat(join(projectRoot, pathname)).then(() => true, (error) => {
      if (error.code === 'ENOENT') return false
      throw error
    })
    if (!stillExists) {
      publishPaths.push(pathname)
      publishPathSet.add(pathname)
    }
  }
  const allowedChanges = []
  const ignoredMedia = []
  const blockers = []

  for (const line of statusLines) {
    const paths = pathsFromStatusLine(line)
    if (paths.every((pathname) => publishPathSet.has(pathname))) {
      allowedChanges.push(line)
    } else if (
      (line[0] === ' ' || line[0] === '?') &&
      paths.every((pathname) => pathname.startsWith('public/images/'))
    ) {
      ignoredMedia.push(line)
    } else {
      blockers.push(line)
    }
  }

  const upstream = await optionalGit(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'])
  const upstreamValid = upstream === 'origin/main'
  const originMainOid = upstreamValid ? await optionalGit(['rev-parse', 'origin/main']) : ''
  const ahead = upstreamValid
    ? Number.parseInt(await optionalGit(['rev-list', '--count', 'origin/main..HEAD']), 10) || 0
    : 0
  const behind = upstreamValid
    ? Number.parseInt(await optionalGit(['rev-list', '--count', 'HEAD..origin/main']), 10) || 0
    : 0
  const aheadCommits = upstreamValid
    ? (await optionalGit(['log', '--format=%h %s', 'origin/main..HEAD'])).split(/\r?\n/).filter(Boolean)
    : []
  const aheadCommitIds = upstreamValid
    ? (await optionalGit(['rev-list', 'origin/main..HEAD'])).split(/\r?\n/).filter(Boolean)
    : []
  const outgoingFiles = upstreamValid
    ? [...new Set(
        (await optionalGit(['log', '--format=', '--name-only', 'origin/main..HEAD']))
          .split(/\r?\n/)
          .filter(Boolean),
      )].sort()
    : []
  const indexState = await optionalGit(['diff', '--cached', '--raw'])
  const planId = createHash('sha256')
    .update(
      JSON.stringify({
        aheadCommitIds,
        branch,
        head,
        indexState,
        mediaHashes,
        originMainOid,
        outgoingFiles,
        publishPaths,
        statusText,
        upstream,
        etag: snapshot.etag,
      }),
    )
    .digest('base64url')

  return {
    planId,
    branch,
    head,
    upstream: upstream || null,
    upstreamValid,
    originMainOid: originMainOid || null,
    ahead,
    behind,
    aheadCommits,
    aheadCommitIds,
    outgoingFiles,
    publishPaths,
    allowedChanges,
    ignoredMedia,
    blockers,
  }
}

async function publishProjects(expectedPlanId) {
  try {
    const initialPlan = await getPublishPlan()
    if (!expectedPlanId || expectedPlanId !== initialPlan.planId) {
      throw new HttpError(409, 'The repository changed after the publish plan was shown. Review it again.')
    }
    if (initialPlan.branch !== 'main') {
      throw new HttpError(409, 'Publishing is only enabled from the main branch.')
    }
    if (!initialPlan.upstreamValid) {
      throw new HttpError(409, 'The main branch must track origin/main before publishing.')
    }
    if (initialPlan.behind > 0) {
      throw new HttpError(409, 'The local branch is behind origin/main. Pull the latest changes first.')
    }
    if (initialPlan.blockers.length) {
      throw new HttpError(409, 'Commit or stash non-content changes before publishing.', {
        blockers: initialPlan.blockers,
      })
    }

    const publishPathSet = new Set(initialPlan.publishPaths)
    let expectedHead = initialPlan.head
    const stagedBefore = (await runGit(['diff', '--cached', '--name-only'])).stdout
      .split(/\r?\n/)
      .filter(Boolean)
    if (stagedBefore.some((pathname) => !publishPathSet.has(normalizeGitPath(pathname)))) {
      throw new HttpError(409, 'The Git index contains files outside the reviewed publish plan.')
    }

    await runGit(['add', '-A', '--', ...initialPlan.publishPaths])
    const stagedAfter = (await runGit(['diff', '--cached', '--name-only'])).stdout
      .split(/\r?\n/)
      .filter(Boolean)
    if (stagedAfter.some((pathname) => !publishPathSet.has(normalizeGitPath(pathname)))) {
      throw new HttpError(409, 'Publishing stopped because an unexpected file was staged.')
    }

    let commit = null
    if (stagedAfter.length) {
      await runGit([
        'commit',
        '--only',
        '-m',
        'content: update portfolio',
        '--',
        ...initialPlan.publishPaths,
      ])
      commit = (await runGit(['rev-parse', '--short', 'HEAD'])).stdout.trim()
      expectedHead = (await runGit(['rev-parse', 'HEAD'])).stdout.trim()
      const committedFiles = (await runGit(['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'])).stdout
        .split(/\r?\n/)
        .filter(Boolean)
      if (committedFiles.some((pathname) => !publishPathSet.has(normalizeGitPath(pathname)))) {
        throw new HttpError(409, 'The new commit contains a file outside the reviewed publish plan. It was not pushed.')
      }
    }

    const planBeforePush = await getPublishPlan()
    if (
      !planBeforePush.upstreamValid ||
      planBeforePush.originMainOid !== initialPlan.originMainOid ||
      planBeforePush.branch !== 'main' ||
      planBeforePush.head !== expectedHead ||
      planBeforePush.behind > 0 ||
      planBeforePush.blockers.length ||
      planBeforePush.allowedChanges.length
    ) {
      throw new HttpError(409, 'The repository changed during publish. The local commit was not pushed.')
    }
    if (planBeforePush.ahead === 0) {
      return { status: 'up-to-date', commit, pushedCommits: 0 }
    }

    const push = await runGit(['push', 'origin', 'HEAD:main'])
    return {
      status: 'published',
      commit,
      pushedCommits: planBeforePush.ahead,
      output: (push.stderr || push.stdout).trim(),
    }
  } catch (error) {
    if (error instanceof HttpError) throw error
    const detail = String(error.stderr || error.message || error).slice(-3000)
    throw new HttpError(502, `Git publish failed. ${detail}`)
  }
}

async function serveImage(pathname, res) {
  const relativePath = pathname.slice('/images/'.length)
  if (!relativePath || relativePath.includes('/') || relativePath.includes('\\')) {
    throw new HttpError(404, 'Not found')
  }

  const candidatePath = join(imagesRoot, relativePath)
  const fileInfo = await lstat(candidatePath)
  if (!fileInfo.isFile() || fileInfo.isSymbolicLink()) throw new HttpError(404, 'Not found')
  const resolvedPath = await realpath(candidatePath)
  if (!isInsideImagesRoot(resolvedPath)) throw new HttpError(404, 'Not found')
  const detected = await readMediaSignature(resolvedPath)

  res.writeHead(200, {
    ...securityHeaders,
    'Content-Length': fileInfo.size,
    'Content-Type': detected?.mimeType ?? imageContentTypes.get(extname(resolvedPath).toLowerCase()) ?? 'application/octet-stream',
  })
  await pipeline(createReadStream(resolvedPath), res)
}

const server = createServer(async (req, res) => {
  try {
    ensureTrustedHost(req)
    const url = new URL(req.url ?? '/', origin)

    if (req.method === 'GET' && url.pathname === '/api/session') {
      sendJson(res, 200, { token: sessionToken })
      return
    }

    if (req.method === 'GET' && url.pathname === '/api/projects') {
      const snapshot = await readContentSnapshot(projectsFile)
      send(res, 200, serializeContent(snapshot.content), 'application/json; charset=utf-8', {
        ETag: snapshot.etag,
      })
      return
    }

    if (req.method === 'PUT' && url.pathname === '/api/projects') {
      ensureAuthorized(req, { requireOrigin: true })
      const saved = await withMutation(req, () => saveProjects(req))
      sendJson(res, 200, { content: saved.content, etag: saved.etag }, { ETag: saved.etag })
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/assets') {
      ensureAuthorized(req, { requireOrigin: true })
      sendJson(res, 201, await withMutation(req, () => saveUpload(req)))
      return
    }

    if ((req.method === 'POST' || req.method === 'PUT') && url.pathname === '/api/profile') {
      ensureAuthorized(req, { requireOrigin: true })
      const saved = await withMutation(req, () => saveProfile(req))
      sendJson(res, 200, { profile: saved.content.profile, etag: saved.etag }, { ETag: saved.etag })
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/profile-preview') {
      ensureAuthorized(req, { requireOrigin: true })
      const profile = validateProfile(await readJsonBody(req))
      const preview = await renderProfileResolution(profile)
      send(res, 200, preview.bytes, preview.mimeType)
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/profile-cleanup') {
      ensureAuthorized(req, { requireOrigin: true })
      sendJson(res, 200, await withMutation(req, () => cleanupProfileVersions(req)))
      return
    }

    if (req.method === 'GET' && url.pathname === '/api/publish-plan') {
      ensureAuthorized(req)
      if (mutationActive) throw new HttpError(409, 'Wait for the current local operation to finish.')
      sendJson(res, 200, await getPublishPlan())
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/publish') {
      ensureAuthorized(req, { requireOrigin: true })
      const result = await withMutation(req, async () => {
        const body = await readJsonBody(req)
        return publishProjects(body.planId)
      })
      sendJson(res, 200, result)
      return
    }

    if (req.method === 'GET' && url.pathname.startsWith('/images/')) {
      await serveImage(url.pathname, res)
      return
    }

    if (req.method === 'GET' && staticFiles.has(url.pathname)) {
      const [filename, contentType] = staticFiles.get(url.pathname)
      send(res, 200, await readFile(join(adminRoot, filename)), contentType)
      return
    }

    throw new HttpError(404, 'Not found')
  } catch (error) {
    if (res.headersSent) {
      res.destroy(error)
      return
    }
    if (error instanceof ContentValidationError) {
      sendJson(res, 422, { error: error.message, issues: error.issues })
      return
    }
    if (error instanceof HttpError) {
      sendJson(res, error.statusCode, { error: error.message, details: error.details })
      return
    }
    if (error?.code === 'ENOENT') {
      sendJson(res, 404, { error: 'Not found' })
      return
    }

    console.error(error)
    sendJson(res, 500, { error: 'The local admin server encountered an error.' })
  }
})

server.listen(port, host, () => {
  console.log(`Portfolio Studio is ready at ${origin}`)
  console.log('Press Ctrl+C to stop the local-only admin server.')
})
