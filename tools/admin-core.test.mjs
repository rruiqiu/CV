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
  version: 2,
  introduction: {
    en: {
      headline: "Hi, I'm Richard — a software engineer based in Toronto.",
      body: 'I build infrastructure and applications that make software delivery more reliable.',
    },
    zh: {
      headline: '你好，我是邱瑞，一名在多伦多工作的软件工程师。',
      body: '我专注于构建让软件交付和实际运营更加可靠的基础设施与应用。',
    },
  },
  education: {
    en: [
      {
        id: 'mcmaster-university',
        school: 'McMaster University',
        degree: 'Bachelor of Engineering in Electrical Engineering',
        period: '2020–2025',
        focus: 'Embedded Systems and Software Development',
        bullets: ['Bachelor of Engineering · Completed'],
      },
      {
        id: 'georgia-institute-of-technology',
        school: 'Georgia Institute of Technology',
        degree: 'Online Master of Science in Computer Science (OMSCS)',
        period: 'Starting 2027',
        focus: 'Computing Systems and Machine Learning',
        bullets: ['Online graduate program · Incoming'],
      },
    ],
    zh: [
      {
        id: 'mcmaster-university',
        school: '麦克马斯特大学',
        degree: '电气工程工程学学士',
        period: '2020–2025',
        focus: '嵌入式系统与软件开发',
        bullets: ['工程学学士 · 已完成'],
      },
      {
        id: 'georgia-institute-of-technology',
        school: '佐治亚理工学院',
        degree: '计算机科学在线理学硕士（OMSCS）',
        period: '2027 年开始',
        focus: '计算系统与机器学习',
        bullets: ['在线研究生项目 · 即将开始'],
      },
    ],
  },
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
  assert.equal(content.version, 2)
  assert.match(content.introduction.en.headline, /Richard/)
})

test('requires complete bilingual introduction content', () => {
  const missingLocale = structuredClone(validContent)
  delete missingLocale.introduction.zh
  assert.throws(() => validateContent(missingLocale), ContentValidationError)

  const emptyHeadline = structuredClone(validContent)
  emptyHeadline.introduction.en.headline = '   '
  assert.throws(() => validateContent(emptyHeadline), ContentValidationError)
})

test('rejects unknown introduction fields', () => {
  const invalid = structuredClone(validContent)
  invalid.introduction.en.subtitle = 'Unexpected'
  assert.throws(() => validateContent(invalid), ContentValidationError)
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
