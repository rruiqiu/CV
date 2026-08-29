import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  ContentValidationError,
  contentEtag,
  detectUploadedMedia,
  readContentSnapshot,
  serializeContent,
  validateContent,
  writeContentAtomically,
} from './admin-core.mjs'

const validContent = {
  version: 1,
  projects: [
    {
      id: 'sample-project-2026',
      section: 'past',
      published: true,
      image: '/images/sample.png',
      mediaType: 'image',
      alt: 'Sample project preview',
      name: 'Sample Project',
      year: 2026,
      description: 'A project used to verify the local content schema.',
      stack: ['Next.js'],
      github: 'https://github.com/example/sample',
    },
  ],
}

test('validates and normalizes portfolio content', () => {
  assert.deepEqual(validateContent(validContent), validContent)
})

test('repository project content matches the local admin schema', async () => {
  const source = await readFile(new URL('../content/projects.json', import.meta.url), 'utf8')
  const content = validateContent(JSON.parse(source))
  assert.equal(content.version, 1)
})

test('rejects duplicate ids', () => {
  const invalid = structuredClone(validContent)
  invalid.projects.push({ ...invalid.projects[0] })
  assert.throws(() => validateContent(invalid), ContentValidationError)
})

test('rejects unsafe local paths', () => {
  const invalid = structuredClone(validContent)
  invalid.projects[0].image = '/images/../secret.png'
  assert.throws(() => validateContent(invalid), ContentValidationError)
})

test('rejects non-http external URLs', () => {
  const invalid = structuredClone(validContent)
  invalid.projects[0].github = 'javascript:alert(1)'
  assert.throws(() => validateContent(invalid), ContentValidationError)
})

test('rejects local media whose extension does not match its declared type', () => {
  const invalid = structuredClone(validContent)
  invalid.projects[0].image = '/images/sample.mp4'
  assert.throws(() => validateContent(invalid), ContentValidationError)
})

test('creates stable content etags', () => {
  const serialized = serializeContent(validContent)
  assert.equal(contentEtag(serialized), contentEtag(serialized))
  assert.notEqual(contentEtag(serialized), contentEtag(`${serialized} `))
})

test('detects supported upload signatures', () => {
  assert.equal(detectUploadedMedia(Buffer.from([0xff, 0xd8, 0xff, 0xe0])).extension, '.jpg')
  assert.equal(
    detectUploadedMedia(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])).mimeType,
    'image/png',
  )
  assert.equal(detectUploadedMedia(Buffer.from('0000ftypqt  ')).extension, '.mov')
  assert.equal(detectUploadedMedia(Buffer.from('0000ftypavif')).extension, '.avif')
  assert.equal(detectUploadedMedia(Buffer.from('0000ftypM4A ')), null)
  assert.equal(detectUploadedMedia(Buffer.from('<svg></svg>')), null)
})

test('writes content atomically and reads it back', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'portfolio-admin-test-'))
  const filePath = join(directory, 'projects.json')

  try {
    const written = await writeContentAtomically(filePath, validContent)
    const diskContent = await readFile(filePath, 'utf8')
    const snapshot = await readContentSnapshot(filePath)
    assert.equal(diskContent, serializeContent(validContent))
    assert.equal(snapshot.etag, written.etag)
    assert.deepEqual(snapshot.content, validContent)

    const replacement = structuredClone(validContent)
    replacement.projects[0].name = 'Updated Sample Project'
    const replaced = await writeContentAtomically(filePath, replacement)
    const replacementSnapshot = await readContentSnapshot(filePath)
    assert.equal(replacementSnapshot.etag, replaced.etag)
    assert.deepEqual(replacementSnapshot.content, replacement)
  } finally {
    await rm(directory, { force: true, recursive: true })
  }
})
