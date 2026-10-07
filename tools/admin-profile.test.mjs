import assert from 'node:assert/strict'
import { execFile, spawn } from 'node:child_process'
import { once } from 'node:events'
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import sharp from 'sharp'
import { defaultProfile } from './admin-core.mjs'

const execFileAsync = promisify(execFile)

test('profile upload and framing save to disk with conflict checks and publish references', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'portfolio-profile-test-'))
  let server
  try {
    for (const subdirectory of ['tools', 'public/images', 'content']) {
      await mkdir(join(directory, subdirectory), { recursive: true })
    }
    for (const name of ['admin-core.mjs', 'admin-server.mjs']) {
      await copyFile(new URL(name, import.meta.url), join(directory, 'tools', name))
    }
    const image = await readFile(new URL('../public/images/profile.jpg', import.meta.url))
    await writeFile(join(directory, 'public/images/profile.jpg'), image)
    const content = JSON.parse(await readFile(new URL('../content/projects.json', import.meta.url), 'utf8'))
    content.profile = { ...defaultProfile }
    content.projects = []
    const contentPath = join(directory, 'content/projects.json')
    await writeFile(contentPath, JSON.stringify(content))
    await symlink(fileURLToPath(new URL('../node_modules', import.meta.url)), join(directory, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir')
    await writeFile(join(directory, '.gitignore'), 'node_modules/\n')
    await execFileAsync('git', ['init', '-b', 'main'], { cwd: directory, windowsHide: true })
    await execFileAsync('git', ['add', '.'], { cwd: directory, windowsHide: true })
    await execFileAsync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'fixture'], { cwd: directory, windowsHide: true })

    const portProbe = createServer()
    portProbe.listen(0, '127.0.0.1')
    await once(portProbe, 'listening')
    const port = portProbe.address().port
    await new Promise((resolve) => portProbe.close(resolve))
    const origin = `http://127.0.0.1:${port}`
    server = spawn(process.execPath, ['tools/admin-server.mjs'], {
      cwd: directory, env: { ...process.env, PORT: String(port) }, windowsHide: true,
    })
    await Promise.race([
      once(server.stdout, 'data'),
      once(server, 'exit').then(() => { throw new Error('Admin server exited before startup.') }),
    ])
    const { token } = await (await fetch(`${origin}/api/session`)).json()
    const initial = await fetch(`${origin}/api/projects`)
    const etag = initial.headers.get('etag')
    const headers = { Origin: origin, 'X-Admin-Token': token, 'If-Match': etag }
    const upload = (body, extraHeaders = {}) => fetch(`${origin}/api/profile`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/octet-stream', ...extraHeaders }, body,
    })
    assert.equal((await upload(image, { 'X-Admin-Token': 'wrong' })).status, 401)
    assert.equal((await upload(image, { 'If-Match': 'stale' })).status, 409)
    assert.equal((await upload(Buffer.from('0000ftypisom'))).status, 415)
    assert.equal((await upload(Buffer.from('not an image'))).status, 415)
    assert.equal((await upload(Buffer.alloc(10 * 1024 * 1024 + 1))).status, 413)
    assert.deepEqual(await readdir(join(directory, 'public/images')), ['profile.jpg'])

    const response = await upload(image)
    assert.equal(response.status, 200)
    const uploaded = await response.json()
    assert.match(uploaded.profile.image, /^\/images\/[a-f0-9-]+\.jpg$/)
    assert.equal(uploaded.profile.zoom, 1)
    assert.deepEqual(await readFile(join(directory, `public${uploaded.profile.image}`)), image)
    assert.deepEqual(JSON.parse(await readFile(contentPath, 'utf8')).profile, uploaded.profile)

    const framing = { ...uploaded.profile, zoom: 2.25, x: 35, y: 70 }
    const savedResponse = await fetch(`${origin}/api/profile`, {
      method: 'PUT', headers: { ...headers, 'If-Match': uploaded.etag, 'Content-Type': 'application/json' },
      body: JSON.stringify(framing),
    })
    assert.equal(savedResponse.status, 200)
    const saved = await savedResponse.json()
    const disk = JSON.parse(await readFile(contentPath, 'utf8'))
    assert.deepEqual(disk.profile, framing)
    assert.deepEqual(disk.introduction, content.introduction)
    assert.deepEqual(disk.projects, content.projects)
    assert.notEqual(saved.etag, uploaded.etag)
    const staleResponse = await fetch(`${origin}/api/profile`, {
      method: 'PUT', headers: { ...headers, 'If-Match': uploaded.etag, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...framing, zoom: 1 }),
    })
    assert.equal(staleResponse.status, 409)
    assert.deepEqual(JSON.parse(await readFile(contentPath, 'utf8')).profile, framing)

    const updateProfile = (profile, etag) => fetch(`${origin}/api/profile`, {
      method: 'PUT', headers: { ...headers, 'If-Match': etag, 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    const filesBeforePreview = await readdir(join(directory, 'public/images'))
    const contentBeforePreview = await readFile(contentPath, 'utf8')
    for (const resolution of [600, 700, 800]) {
      const preview = await fetch(`${origin}/api/profile-preview`, {
        method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...framing, resolution }),
      })
      assert.equal(preview.status, 200)
      assert.equal(preview.headers.get('content-type'), 'image/webp')
      const size = await sharp(Buffer.from(await preview.arrayBuffer())).metadata()
      assert.equal(Math.max(size.width, size.height), resolution)
    }
    assert.deepEqual(await readdir(join(directory, 'public/images')), filesBeforePreview, 'Previewing never writes image files')
    assert.equal(await readFile(contentPath, 'utf8'), contentBeforePreview, 'Previewing never changes saved settings')
    const originalBytes = await readFile(join(directory, `public${uploaded.profile.sourceImage}`))
    const resizedResponse = await updateProfile({ ...framing, resolution: 512 }, saved.etag)
    assert.equal(resizedResponse.status, 200)
    const resized = await resizedResponse.json()
    const resizedBytes = await readFile(join(directory, `public${resized.profile.image}`))
    const dimensions = await sharp(resizedBytes).metadata()
    assert.equal(Math.max(dimensions.width, dimensions.height), 512)
    assert.ok(resizedBytes.length < originalBytes.length)
    assert.equal(resized.profile.sourceImage, uploaded.profile.image)
    assert.equal(resized.profile.x, framing.x)
    assert.equal(resized.profile.zoom, framing.zoom)
    assert.deepEqual(await readFile(join(directory, `public${uploaded.profile.sourceImage}`)), originalBytes)

    const reframed = await (await updateProfile({ ...resized.profile, x: 65 }, resized.etag)).json()
    assert.equal(reframed.profile.image, resized.profile.image, 'Changing framing reuses the reduced image')

    const planResponse = await fetch(`${origin}/api/publish-plan`, { headers: { 'X-Admin-Token': token } })
    assert.equal(planResponse.status, 200)
    const plan = await planResponse.json()
    assert.ok(plan.publishPaths.includes(`public${uploaded.profile.image}`))
    assert.ok(plan.publishPaths.includes(`public${resized.profile.image}`))
    assert.ok(plan.allowedChanges.some((change) => change.includes(uploaded.profile.image.slice('/images/'.length))))
    assert.equal(plan.blockers.length, 0)

    const restored = await (await updateProfile({ ...reframed.profile, resolution: 0 }, reframed.etag)).json()
    assert.equal(restored.profile.image, uploaded.profile.sourceImage)
    assert.equal(restored.profile.x, 65)

    // Save locally can race the auto-save timer; the full-content route also materializes resolution changes.
    const nextContent = JSON.parse(await readFile(contentPath, 'utf8'))
    nextContent.profile.resolution = 736
    const fullSave = await fetch(`${origin}/api/projects`, {
      method: 'PUT', headers: { ...headers, 'If-Match': restored.etag, 'Content-Type': 'application/json' },
      body: JSON.stringify(nextContent),
    })
    assert.equal(fullSave.status, 200)
    const fullSaved = await fullSave.json()
    const smaller = await sharp(await readFile(join(directory, `public${fullSaved.content.profile.image}`))).metadata()
    assert.equal(Math.max(smaller.width, smaller.height), 736)
    const customResponse = await updateProfile({ ...fullSaved.content.profile, resolution: 700 }, fullSaved.etag)
    assert.equal(customResponse.status, 200)
    const custom = await customResponse.json()
    const customSize = await sharp(await readFile(join(directory, `public${custom.profile.image}`))).metadata()
    assert.equal(Math.max(customSize.width, customSize.height), 700)
    assert.equal((await (await fetch(`${origin}/api/projects`)).json()).profile.resolution, 700)

    // Keep one old generated image used by a project, plus another used in an unsaved draft.
    const withProject = JSON.parse(await readFile(contentPath, 'utf8'))
    withProject.projects = [{ id: 'photo-project', section: 'past', published: true, image: fullSaved.content.profile.image,
      mediaType: 'image', alt: 'Photo project', name: 'Photo project', year: 2026, description: 'Uses a generated image.', stack: ['Photo'] }]
    const withProjectResponse = await fetch(`${origin}/api/projects`, {
      method: 'PUT', headers: { ...headers, 'If-Match': custom.etag, 'Content-Type': 'application/json' },
      body: JSON.stringify(withProject),
    })
    assert.equal(withProjectResponse.status, 200)
    const projectSaved = await withProjectResponse.json()
    const oldVersion = '/images/profile-11111111-1111-4111-8111-111111111111-900.webp'
    await writeFile(join(directory, `public${oldVersion}`), resizedBytes)
    await execFileAsync('git', ['add', '--', `public${oldVersion}`], { cwd: directory, windowsHide: true })
    await execFileAsync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '--only', '-m', 'old photo fixture', '--', `public${oldVersion}`], { cwd: directory, windowsHide: true })
    await writeFile(join(directory, 'public/images/unrelated.webp'), resizedBytes)
    await writeFile(join(directory, 'public/images/profile-manual-900.webp'), resizedBytes)
    const cleanup = (retainImages, etag = projectSaved.etag) => fetch(`${origin}/api/profile-cleanup`, {
      method: 'POST', headers: { ...headers, 'If-Match': etag, 'Content-Type': 'application/json' },
      body: JSON.stringify({ retainImages }),
    })
    assert.equal((await cleanup([], custom.etag)).status, 409)
    assert.equal((await cleanup(['/images/../secret.webp'])).status, 422)
    const cleanedResponse = await cleanup([resized.profile.image])
    assert.equal(cleanedResponse.status, 200)
    const cleaned = await cleanedResponse.json()
    assert.ok(cleaned.removed.includes(oldVersion))
    assert.ok(!cleaned.removed.includes(custom.profile.image))
    assert.ok(!cleaned.removed.includes(fullSaved.content.profile.image))
    assert.ok(!cleaned.removed.includes(resized.profile.image))
    assert.deepEqual(await readFile(join(directory, `public${uploaded.profile.sourceImage}`)), originalBytes)
    const remaining = await readdir(join(directory, 'public/images'))
    assert.ok(remaining.includes('profile.jpg'))
    assert.ok(remaining.includes('unrelated.webp'))
    assert.ok(remaining.includes('profile-manual-900.webp'))
    assert.ok(!remaining.includes(oldVersion.slice('/images/'.length)))
    const cleanupPlan = await (await fetch(`${origin}/api/publish-plan`, { headers: { 'X-Admin-Token': token } })).json()
    assert.ok(cleanupPlan.publishPaths.includes(`public${oldVersion}`), 'The publish plan includes removal of tracked old versions')
    assert.ok(cleanupPlan.allowedChanges.some((change) => change.includes(oldVersion.slice('/images/'.length))))
    assert.equal(cleanupPlan.blockers.length, 0)
    const finalCleanup = await (await cleanup([])).json()
    assert.ok(finalCleanup.removed.includes(resized.profile.image))
    assert.equal((await (await cleanup([])).json()).removed.length, 0)
  } finally {
    if (server && server.exitCode === null) {
      server.kill()
      await once(server, 'exit')
    }
    await rm(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 })
  }
})
