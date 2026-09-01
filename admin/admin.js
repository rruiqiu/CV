const state = {
  content: {
    version: 2,
    introduction: {
      en: { headline: '', body: '' },
      zh: { headline: '', body: '' },
    },
    projects: [],
  },
  activeView: 'introduction',
  previewLanguage: 'en',
  selectedId: null,
  filter: 'all',
  etag: null,
  token: null,
  dirty: false,
  busy: false,
  conflicted: false,
  publishPlanId: null,
  loaded: false,
}

const elements = {
  add: document.querySelector('#add-project'),
  alt: document.querySelector('#alt'),
  cancelDelete: document.querySelector('#cancel-delete'),
  cancelPublish: document.querySelector('#cancel-publish'),
  confirmDelete: document.querySelector('#confirm-delete'),
  confirmPublish: document.querySelector('#confirm-publish'),
  count: document.querySelector('#project-count'),
  delete: document.querySelector('#delete-project'),
  deleteCopy: document.querySelector('#delete-copy'),
  deleteDialog: document.querySelector('#delete-dialog'),
  demo: document.querySelector('#demo'),
  demoType: document.querySelector('#demo-type'),
  description: document.querySelector('#description'),
  descriptionCount: document.querySelector('#description-count'),
  draftState: document.querySelector('#draft-state'),
  editorEyebrow: document.querySelector('#editor-eyebrow'),
  editorHeading: document.querySelector('#editor-heading'),
  fileInput: document.querySelector('#file-input'),
  filterButtons: [...document.querySelectorAll('[data-filter]')],
  introductionEnBody: document.querySelector('#introduction-en-body'),
  introductionEnBodyCount: document.querySelector('#introduction-en-body-count'),
  introductionEnHeadline: document.querySelector('#introduction-en-headline'),
  introductionEnHeadlineCount: document.querySelector('#introduction-en-headline-count'),
  introductionEntry: document.querySelector('#introduction-entry'),
  introductionForm: document.querySelector('#introduction-form'),
  introductionPreviewBody: document.querySelector('#introduction-preview-body'),
  introductionPreviewCard: document.querySelector('#introduction-preview-card'),
  introductionPreviewHeadline: document.querySelector('#introduction-preview-headline'),
  introductionZhBody: document.querySelector('#introduction-zh-body'),
  introductionZhBodyCount: document.querySelector('#introduction-zh-body-count'),
  introductionZhHeadline: document.querySelector('#introduction-zh-headline'),
  introductionZhHeadlineCount: document.querySelector('#introduction-zh-headline-count'),
  github: document.querySelector('#github'),
  image: document.querySelector('#image'),
  list: document.querySelector('#project-list'),
  mediaType: document.querySelector('#media-type'),
  moveDown: document.querySelector('#move-down'),
  moveUp: document.querySelector('#move-up'),
  name: document.querySelector('#name'),
  previewDescription: document.querySelector('#preview-description'),
  previewEyebrow: document.querySelector('#preview-eyebrow'),
  previewLanguage: document.querySelector('#preview-language'),
  previewLanguageButtons: [...document.querySelectorAll('[data-preview-language]')],
  previewLinks: document.querySelector('#preview-links'),
  previewMedia: document.querySelector('#preview-media'),
  previewName: document.querySelector('#preview-name'),
  previewStack: document.querySelector('#preview-stack'),
  previewYear: document.querySelector('#preview-year'),
  publish: document.querySelector('#publish-button'),
  publishDetails: document.querySelector('#publish-details'),
  publishDialog: document.querySelector('#publish-dialog'),
  publishSummary: document.querySelector('#publish-summary'),
  publishWarning: document.querySelector('#publish-warning'),
  published: document.querySelector('#published'),
  projectActions: document.querySelector('#project-actions'),
  projectForm: document.querySelector('#project-form'),
  projectPreviewCard: document.querySelector('#preview-card'),
  reload: document.querySelector('#reload-button'),
  save: document.querySelector('#save-button'),
  search: document.querySelector('#project-search'),
  section: document.querySelector('#section'),
  stack: document.querySelector('#stack'),
  statusMessage: document.querySelector('#status-message'),
  upload: document.querySelector('#upload-button'),
  year: document.querySelector('#year'),
}

const projectEditableFields = [
  elements.section,
  elements.published,
  elements.year,
  elements.name,
  elements.description,
  elements.stack,
  elements.github,
  elements.demoType,
  elements.demo,
  elements.mediaType,
  elements.image,
  elements.alt,
]

const introductionEditableFields = [
  elements.introductionEnHeadline,
  elements.introductionEnBody,
  elements.introductionZhHeadline,
  elements.introductionZhBody,
]

function selectedProject() {
  return state.content.projects.find((project) => project.id === state.selectedId) ?? null
}

function setStatus(message, tone = 'neutral') {
  elements.statusMessage.textContent = message
  elements.statusMessage.dataset.tone = tone
}

function setDirty(dirty) {
  state.dirty = dirty
  if (!state.busy) {
    elements.draftState.textContent = state.conflicted ? 'Conflict' : dirty ? 'Unsaved' : 'Saved'
  }
  elements.draftState.dataset.dirty = String(dirty)
  updateControls()
}

function setBusy(busy, label = 'Working') {
  state.busy = busy
  if (busy) elements.draftState.textContent = label
  else {
    elements.draftState.textContent = state.conflicted ? 'Conflict' : state.dirty ? 'Unsaved' : 'Saved'
  }
  updateControls()
}

function sectionProjects(project) {
  return state.content.projects.filter((candidate) => candidate.section === project.section)
}

function updateControls() {
  const project = selectedProject()
  const baseEnabled = state.loaded && !state.busy && !state.conflicted
  const projectEnabled = baseEnabled && state.activeView === 'project' && Boolean(project)
  const introductionEnabled = baseEnabled && state.activeView === 'introduction'
  for (const field of projectEditableFields) field.disabled = !projectEnabled
  for (const field of introductionEditableFields) field.disabled = !introductionEnabled
  elements.introductionEntry.disabled = !state.loaded || state.busy
  elements.add.disabled = !state.loaded || state.busy
  elements.delete.disabled = !projectEnabled
  elements.upload.disabled = !projectEnabled
  elements.save.disabled = !state.loaded || state.busy || state.conflicted || !state.dirty
  elements.publish.disabled = !state.loaded || state.busy || state.conflicted
  elements.projectActions.hidden = state.activeView !== 'project'

  const siblings = project ? sectionProjects(project) : []
  const siblingIndex = project ? siblings.findIndex((candidate) => candidate.id === project.id) : -1
  elements.moveUp.disabled = !projectEnabled || siblingIndex <= 0
  elements.moveDown.disabled = !projectEnabled || siblingIndex < 0 || siblingIndex >= siblings.length - 1
}

function isVideoPath(path) {
  return /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(path)
}

function mediaElement(path, title, mediaType, { play = false } = {}) {
  if (!path) {
    const placeholder = document.createElement('span')
    placeholder.textContent = 'No media'
    return placeholder
  }

  if (mediaType === 'video') {
    const video = document.createElement('video')
    video.src = path
    video.muted = true
    video.loop = true
    video.autoplay = play
    video.playsInline = true
    video.preload = play ? 'auto' : 'metadata'
    video.setAttribute('aria-label', title)
    return video
  }

  const image = document.createElement('img')
  image.src = path
  image.alt = title
  image.loading = play ? 'eager' : 'lazy'
  image.referrerPolicy = 'no-referrer'
  return image
}

function renderList() {
  const visibleProjects = filteredProjects()

  elements.introductionEntry.setAttribute('aria-current', state.activeView === 'introduction' ? 'page' : 'false')
  elements.count.textContent = String(state.content.projects.length)
  elements.list.replaceChildren()

  if (visibleProjects.length === 0) {
    const empty = document.createElement('div')
    empty.className = 'loading-card'
    empty.textContent = state.content.projects.length ? 'No projects match this view.' : 'No projects yet.'
    elements.list.append(empty)
    return
  }

  for (const project of visibleProjects) {
    const button = document.createElement('button')
    button.type = 'button'
    button.dataset.projectId = project.id
    button.setAttribute(
      'aria-current',
      String(state.activeView === 'project' && project.id === state.selectedId),
    )

    const thumb = document.createElement('span')
    thumb.className = 'list-thumb'
    thumb.append(mediaElement(project.image, '', project.mediaType))

    const copy = document.createElement('span')
    copy.className = 'list-copy'
    const name = document.createElement('strong')
    name.textContent = project.name
    const meta = document.createElement('span')
    const sectionLabel = project.section === 'current' ? 'Current project' : 'Past project'
    meta.textContent = project.published ? sectionLabel : `${sectionLabel} · Hidden`
    copy.append(name, meta)

    const year = document.createElement('span')
    year.className = 'list-year'
    year.textContent = String(project.year)

    button.append(thumb, copy, year)
    button.addEventListener('click', () => selectProject(project.id))
    elements.list.append(button)
  }
}

function filteredProjects() {
  const query = elements.search.value.trim().toLowerCase()
  return state.content.projects.filter((project) => {
    if (state.filter !== 'all' && project.section !== state.filter) return false
    const haystack = `${project.name} ${project.year} ${project.stack.join(' ')}`.toLowerCase()
    return haystack.includes(query)
  })
}

function renderIntroductionPreview() {
  const copy = state.content.introduction[state.previewLanguage]
  elements.introductionPreviewCard.lang = state.previewLanguage === 'zh' ? 'zh-CN' : 'en'
  elements.introductionPreviewHeadline.textContent =
    copy.headline || 'Introduction opening line'
  elements.introductionPreviewBody.textContent =
    copy.body || 'Introduction paragraph will appear here.'

  for (const button of elements.previewLanguageButtons) {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.previewLanguage === state.previewLanguage),
    )
  }
}

function renderIntroductionEditor() {
  const introduction = state.content.introduction
  elements.editorEyebrow.textContent = 'INTRODUCTION'
  elements.editorHeading.textContent = 'Profile introduction'
  elements.introductionForm.hidden = false
  elements.projectForm.hidden = true
  elements.introductionPreviewCard.hidden = false
  elements.projectPreviewCard.hidden = true
  elements.previewLanguage.hidden = false
  elements.previewEyebrow.textContent = 'LIVE INTRO'

  elements.introductionEnHeadline.value = introduction.en.headline
  elements.introductionEnBody.value = introduction.en.body
  elements.introductionZhHeadline.value = introduction.zh.headline
  elements.introductionZhBody.value = introduction.zh.body
  updateIntroductionCounts()
  renderIntroductionPreview()
  updateControls()
}

function renderPreview(project) {
  elements.previewMedia.replaceChildren(
    mediaElement(project.image, project.alt || project.name, project.mediaType, { play: true }),
  )
  elements.previewName.textContent = project.name || 'Untitled project'
  elements.previewYear.textContent = String(project.year || 'Year')
  elements.previewDescription.textContent = project.description || 'Project description will appear here.'
  elements.previewStack.replaceChildren()
  elements.previewLinks.replaceChildren()

  for (const tag of project.stack) {
    const item = document.createElement('li')
    item.textContent = tag
    elements.previewStack.append(item)
  }

  for (const [label, value] of [['Github', project.github], ['Demo', project.demo]]) {
    if (!value) continue
    const link = document.createElement('span')
    link.textContent = label
    elements.previewLinks.append(link)
  }
}

function renderEmptyEditor() {
  elements.editorEyebrow.textContent = 'PROJECT DETAILS'
  elements.editorHeading.textContent = 'No project selected'
  elements.introductionForm.hidden = true
  elements.projectForm.hidden = false
  elements.introductionPreviewCard.hidden = true
  elements.projectPreviewCard.hidden = false
  elements.previewLanguage.hidden = true
  elements.previewEyebrow.textContent = 'LIVE CARD'
  for (const field of projectEditableFields) {
    if (field.type === 'checkbox') field.checked = false
    else field.value = ''
  }
  elements.descriptionCount.textContent = '0'
  elements.previewMedia.replaceChildren(document.createTextNode('Add a project to preview it'))
  elements.previewName.textContent = 'Project name'
  elements.previewYear.textContent = 'Year'
  elements.previewDescription.textContent = 'Project description will appear here.'
  elements.previewStack.replaceChildren()
  elements.previewLinks.replaceChildren()
  updateControls()
}

function renderEditor() {
  if (state.activeView === 'introduction') {
    renderIntroductionEditor()
    return
  }

  const project = selectedProject()
  if (!project) {
    renderEmptyEditor()
    return
  }

  elements.editorEyebrow.textContent = 'PROJECT DETAILS'
  elements.editorHeading.textContent = project.name
  elements.introductionForm.hidden = true
  elements.projectForm.hidden = false
  elements.introductionPreviewCard.hidden = true
  elements.projectPreviewCard.hidden = false
  elements.previewLanguage.hidden = true
  elements.previewEyebrow.textContent = 'LIVE CARD'
  elements.section.value = project.section
  elements.published.checked = project.published
  elements.year.value = String(project.year)
  elements.name.value = project.name
  elements.description.value = project.description
  elements.descriptionCount.textContent = String(project.description.length)
  elements.stack.value = project.stack.join(', ')
  elements.github.value = project.github ?? ''
  elements.demoType.value = project.demoType ?? ''
  elements.demo.value = project.demo ?? ''
  elements.mediaType.value = project.mediaType
  elements.image.value = project.image
  elements.alt.value = project.alt
  renderPreview(project)
  updateControls()
}

function selectIntroduction() {
  state.activeView = 'introduction'
  renderList()
  renderEditor()
}

function selectProject(projectId) {
  state.activeView = 'project'
  state.selectedId = projectId
  renderList()
  renderEditor()
}

function updateIntroductionCounts() {
  elements.introductionEnHeadlineCount.textContent = String(
    elements.introductionEnHeadline.value.length,
  )
  elements.introductionEnBodyCount.textContent = String(elements.introductionEnBody.value.length)
  elements.introductionZhHeadlineCount.textContent = String(
    elements.introductionZhHeadline.value.length,
  )
  elements.introductionZhBodyCount.textContent = String(elements.introductionZhBody.value.length)
}

function syncIntroductionFromForm() {
  state.content.introduction.en.headline = elements.introductionEnHeadline.value
  state.content.introduction.en.body = elements.introductionEnBody.value
  state.content.introduction.zh.headline = elements.introductionZhHeadline.value
  state.content.introduction.zh.body = elements.introductionZhBody.value
  updateIntroductionCounts()
  setDirty(true)
  renderIntroductionPreview()
}

function syncProjectFromForm(changedField) {
  const project = selectedProject()
  if (!project) return

  if (changedField === elements.demoType && !elements.demoType.value) elements.demo.value = ''
  if (changedField === elements.demo && elements.demo.value && !elements.demoType.value) {
    elements.demoType.value = isVideoPath(elements.demo.value) ? 'video' : 'external'
  }

  project.section = elements.section.value
  project.published = elements.published.checked
  project.year = Number(elements.year.value)
  project.name = elements.name.value
  project.description = elements.description.value
  project.stack = elements.stack.value.split(',').map((tag) => tag.trim()).filter(Boolean)
  project.github = elements.github.value
  project.demoType = elements.demoType.value
  project.demo = elements.demo.value
  project.mediaType = elements.mediaType.value
  project.image = elements.image.value
  project.alt = elements.alt.value

  if (changedField === elements.section && state.filter !== 'all' && project.section !== state.filter) {
    state.filter = 'all'
    for (const button of elements.filterButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === 'all'))
    }
  }
  if (!filteredProjects().some((candidate) => candidate.id === project.id)) {
    elements.search.value = ''
  }

  elements.editorHeading.textContent = project.name || 'Untitled project'
  elements.descriptionCount.textContent = String(project.description.length)
  setDirty(true)
  renderList()
  renderPreview(project)
}

function addProject() {
  const project = {
    id: `project-${crypto.randomUUID()}`,
    section: 'current',
    published: false,
    image: '/images/comingsoon.jpg',
    mediaType: 'image',
    alt: 'New project preview',
    name: 'Untitled Project',
    year: new Date().getFullYear(),
    description: 'Add a concise description of the project and its impact.',
    stack: ['New'],
  }
  state.content.projects.unshift(project)
  state.filter = 'all'
  elements.search.value = ''
  for (const button of elements.filterButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === 'all'))
  }
  setDirty(true)
  selectProject(project.id)
  elements.name.focus()
  elements.name.select()
}

function confirmDelete() {
  const project = selectedProject()
  if (!project) return
  elements.deleteCopy.textContent = `“${project.name}” will be removed from the local draft. Save locally to write the change.`
  elements.deleteDialog.showModal()
}

function deleteSelectedProject() {
  const projectIndex = state.content.projects.findIndex((project) => project.id === state.selectedId)
  if (projectIndex < 0) return
  state.content.projects.splice(projectIndex, 1)
  state.selectedId = filteredProjects()[0]?.id ?? null
  elements.deleteDialog.close()
  setDirty(true)
  renderList()
  renderEditor()
  setStatus('Project removed from the draft. Save locally to keep this change.')
}

function moveProject(direction) {
  const project = selectedProject()
  if (!project) return
  const siblings = sectionProjects(project)
  const siblingIndex = siblings.findIndex((candidate) => candidate.id === project.id)
  const target = siblings[siblingIndex + direction]
  if (!target) return

  const projectIndex = state.content.projects.findIndex((candidate) => candidate.id === project.id)
  const targetIndex = state.content.projects.findIndex((candidate) => candidate.id === target.id)
  ;[state.content.projects[projectIndex], state.content.projects[targetIndex]] = [
    state.content.projects[targetIndex],
    state.content.projects[projectIndex],
  ]
  setDirty(true)
  renderList()
  updateControls()
}

function contentForSave() {
  return {
    version: 2,
    introduction: {
      en: {
        headline: state.content.introduction.en.headline,
        body: state.content.introduction.en.body,
      },
      zh: {
        headline: state.content.introduction.zh.headline,
        body: state.content.introduction.zh.body,
      },
    },
    projects: state.content.projects.map((project) => {
      const normalized = {
        id: project.id,
        section: project.section,
        published: project.published,
        image: project.image,
        mediaType: project.mediaType,
        alt: project.alt,
        name: project.name,
        year: project.year,
        description: project.description,
        stack: project.stack,
      }
      if (project.github) normalized.github = project.github
      if (project.demo) {
        normalized.demo = project.demo
        normalized.demoType = project.demoType
      }
      return normalized
    }),
  }
}

async function apiJson(path, options = {}) {
  const response = await fetch(path, options)
  let body
  try {
    body = await response.json()
  } catch {
    body = null
  }
  if (!response.ok) {
    const error = new Error(body?.error || `Request failed with ${response.status}`)
    error.status = response.status
    error.details = body?.details
    error.issues = body?.issues
    throw error
  }
  return { body, response }
}

function errorMessage(error) {
  const firstIssue = error.issues?.[0]
  return firstIssue ? `${error.message} ${firstIssue.path}: ${firstIssue.message}` : error.message
}

function focusAfterSave(field) {
  if (!field) return
  window.setTimeout(() => field.focus(), 0)
}

function revealValidationIssue(error) {
  const path = error.issues?.[0]?.path
  if (!path) return

  if (path.startsWith('introduction.')) {
    state.activeView = 'introduction'
    renderList()
    renderEditor()
    const introductionFields = {
      'introduction.en.headline': elements.introductionEnHeadline,
      'introduction.en.body': elements.introductionEnBody,
      'introduction.zh.headline': elements.introductionZhHeadline,
      'introduction.zh.body': elements.introductionZhBody,
    }
    focusAfterSave(introductionFields[path])
    return
  }

  const projectMatch = /^projects\[(\d+)\](?:\.([A-Za-z]+))?/.exec(path)
  if (!projectMatch) return
  const project = state.content.projects[Number(projectMatch[1])]
  if (!project) return

  state.activeView = 'project'
  state.selectedId = project.id
  state.filter = 'all'
  elements.search.value = ''
  for (const button of elements.filterButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === 'all'))
  }
  renderList()
  renderEditor()

  const projectFields = {
    alt: elements.alt,
    demo: elements.demo,
    demoType: elements.demoType,
    description: elements.description,
    github: elements.github,
    image: elements.image,
    mediaType: elements.mediaType,
    name: elements.name,
    published: elements.published,
    section: elements.section,
    stack: elements.stack,
    year: elements.year,
  }
  focusAfterSave(projectFields[projectMatch[2]])
}

async function saveProjects() {
  if (state.busy) return false
  if (state.conflicted) {
    setStatus('Reload the latest disk content before saving this draft again.', 'error')
    return false
  }
  if (!state.dirty) return true
  const activeForm = state.activeView === 'introduction'
    ? elements.introductionForm
    : elements.projectForm
  if (!activeForm.reportValidity()) return false

  setBusy(true, 'Saving')
  setStatus('Validating and saving portfolio content…')
  try {
    const { body, response } = await apiJson('/api/projects', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'If-Match': state.etag,
        'X-Admin-Token': state.token,
      },
      body: JSON.stringify(contentForSave()),
    })
    state.content = body.content
    state.etag = response.headers.get('ETag') || body.etag
    state.conflicted = false
    elements.reload.hidden = true
    setDirty(false)
    renderList()
    renderEditor()
    setStatus('Saved locally. Publish when you are ready to update GitHub Pages.', 'success')
    return true
  } catch (error) {
    setStatus(errorMessage(error), 'error')
    if (error.status === 422) revealValidationIssue(error)
    if (error.status === 409 && error.details?.code === 'etag_conflict') {
      state.conflicted = true
      elements.reload.hidden = false
    }
    return false
  } finally {
    setBusy(false)
  }
}

async function uploadMedia() {
  const file = elements.fileInput.files?.[0]
  if (!file) return
  const projectId = state.selectedId
  setBusy(true, 'Uploading')
  setStatus(`Uploading ${file.name}…`)

  try {
    const { body } = await apiJson('/api/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Admin-Token': state.token,
      },
      body: file,
    })
    const project = state.content.projects.find((candidate) => candidate.id === projectId)
    if (!project) return
    project.image = body.path
    project.mediaType = body.mediaType
    setDirty(true)
    renderList()
    if (state.selectedId === projectId) {
      elements.image.value = body.path
      elements.mediaType.value = body.mediaType
      renderPreview(project)
    }
    setStatus(`${file.name} uploaded to “${project.name}”. Save locally to keep the new path.`, 'success')
  } catch (error) {
    setStatus(errorMessage(error), 'error')
  } finally {
    elements.fileInput.value = ''
    setBusy(false)
  }
}

function appendPublishDetail(text) {
  const item = document.createElement('li')
  item.textContent = text
  elements.publishDetails.append(item)
}

async function preparePublish() {
  if (state.dirty && !(await saveProjects())) return
  state.publishPlanId = null
  setBusy(true, 'Checking Git')
  setStatus('Checking the Git publish plan…')

  try {
    const { body: plan } = await apiJson('/api/publish-plan', {
      headers: { 'X-Admin-Token': state.token },
    })
    state.publishPlanId = plan.planId
    elements.confirmPublish.textContent = 'Commit & push'
    elements.publishDetails.replaceChildren()
    appendPublishDetail(`Branch: ${plan.branch}`)
    appendPublishDetail(`${plan.allowedChanges.length} content file change(s) will be committed.`)
    for (const change of plan.allowedChanges) appendPublishDetail(`Content change: ${change}`)
    appendPublishDetail(`${plan.ahead} existing local commit(s) will also be pushed to ${plan.upstream || 'origin/main'}.`)
    for (const commit of plan.aheadCommits) appendPublishDetail(`Existing commit: ${commit}`)
    for (const pathname of plan.outgoingFiles) appendPublishDetail(`Existing commit file: ${pathname}`)
    if (plan.ignoredMedia.length) {
      appendPublishDetail(`${plan.ignoredMedia.length} unreferenced media change(s) will stay local and will not be staged.`)
    }
    const hiddenProjects = state.content.projects.filter((project) => !project.published).length
    if (hiddenProjects) appendPublishDetail(`${hiddenProjects} hidden project(s) will remain excluded from the site.`)
    appendPublishDetail('A successful push triggers the existing GitHub Pages workflow.')

    const blocked =
      plan.branch !== 'main' || !plan.upstreamValid || plan.behind > 0 || plan.blockers.length > 0
    elements.publishSummary.textContent = blocked
      ? 'The repository needs attention before it can publish.'
      : 'Git will stage only portfolio content/media; the push also includes the existing local commits listed below.'
    elements.publishWarning.hidden = !blocked
    elements.publishWarning.textContent = plan.blockers.length
      ? `Blocked by: ${plan.blockers.join(', ')}`
      : plan.behind > 0
        ? `The local branch is ${plan.behind} commit(s) behind its upstream.`
        : !plan.upstreamValid
          ? 'The main branch must track origin/main before publishing.'
        : plan.branch !== 'main'
          ? 'Switch to the main branch before publishing.'
          : ''
    elements.confirmPublish.disabled = blocked
    elements.publishDialog.showModal()
    setStatus(blocked ? 'Publish is blocked by the repository state.' : 'Publish plan is ready.')
  } catch (error) {
    setStatus(errorMessage(error), 'error')
  } finally {
    setBusy(false)
  }
}

async function publishProjects() {
  if (!state.publishPlanId) {
    elements.publishDialog.close()
    await preparePublish()
    return
  }
  elements.confirmPublish.disabled = true
  elements.cancelPublish.disabled = true
  elements.publishSummary.textContent = 'Committing content and pushing to GitHub…'
  setBusy(true, 'Publishing')

  try {
    const { body } = await apiJson('/api/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': state.token,
      },
      body: JSON.stringify({ planId: state.publishPlanId }),
    })
    elements.publishDialog.close()
    state.publishPlanId = null
    const message = body.status === 'up-to-date'
      ? 'Everything is already published.'
      : `Push completed for ${body.pushedCommits} commit(s); GitHub Pages deployment was triggered.`
    setStatus(message, 'success')
  } catch (error) {
    elements.publishSummary.textContent = errorMessage(error)
    elements.publishWarning.hidden = false
    elements.publishWarning.textContent = 'Nothing was force-pushed or rolled back. Resolve the issue and try again.'
    setStatus(errorMessage(error), 'error')
    state.publishPlanId = null
    elements.confirmPublish.textContent = 'Review again'
    elements.confirmPublish.disabled = false
  } finally {
    elements.cancelPublish.disabled = false
    setBusy(false)
  }
}

async function loadWorkspace() {
  setStatus('Loading local portfolio content…')
  try {
    const [sessionResult, projectsResponse] = await Promise.all([
      apiJson('/api/session'),
      fetch('/api/projects', { cache: 'no-store' }),
    ])
    if (!projectsResponse.ok) throw new Error(`Could not load portfolio content (${projectsResponse.status}).`)
    state.token = sessionResult.body.token
    state.etag = projectsResponse.headers.get('ETag')
    state.content = await projectsResponse.json()
    state.loaded = true
    state.conflicted = false
    elements.reload.textContent = 'Reload from disk'
    elements.reload.hidden = true
    state.selectedId = state.content.projects[0]?.id ?? null
    setDirty(false)
    renderList()
    renderEditor()
    setStatus('Local workspace ready.', 'success')
  } catch (error) {
    elements.list.replaceChildren()
    const message = document.createElement('div')
    message.className = 'loading-card'
    message.textContent = 'Could not load portfolio content.'
    elements.list.append(message)
    elements.draftState.textContent = 'Offline'
    elements.reload.textContent = 'Retry'
    elements.reload.hidden = false
    setStatus(errorMessage(error), 'error')
  }
}

async function reloadWorkspace() {
  if (state.dirty && !window.confirm('Discard the current local draft and reload projects from disk?')) return
  state.loaded = false
  state.conflicted = false
  elements.reload.textContent = 'Reload from disk'
  elements.reload.hidden = true
  updateControls()
  await loadWorkspace()
}

elements.search.addEventListener('input', () => {
  const visible = filteredProjects()
  if (!visible.some((project) => project.id === state.selectedId)) {
    state.selectedId = visible[0]?.id ?? null
  }
  renderList()
  renderEditor()
})
elements.add.addEventListener('click', addProject)
elements.introductionEntry.addEventListener('click', selectIntroduction)
elements.delete.addEventListener('click', confirmDelete)
elements.cancelDelete.addEventListener('click', () => elements.deleteDialog.close())
elements.confirmDelete.addEventListener('click', deleteSelectedProject)
elements.moveUp.addEventListener('click', () => moveProject(-1))
elements.moveDown.addEventListener('click', () => moveProject(1))
elements.save.addEventListener('click', saveProjects)
elements.reload.addEventListener('click', reloadWorkspace)
elements.publish.addEventListener('click', preparePublish)
elements.cancelPublish.addEventListener('click', () => {
  state.publishPlanId = null
  elements.publishDialog.close()
})
elements.confirmPublish.addEventListener('click', publishProjects)
elements.upload.addEventListener('click', () => elements.fileInput.click())
elements.fileInput.addEventListener('change', uploadMedia)

for (const button of elements.filterButtons) {
  button.addEventListener('click', () => {
    state.filter = button.dataset.filter
    for (const candidate of elements.filterButtons) {
      candidate.setAttribute('aria-pressed', String(candidate === button))
    }
    const visible = filteredProjects()
    if (!visible.some((project) => project.id === state.selectedId)) {
      state.selectedId = visible[0]?.id ?? null
    }
    renderList()
    renderEditor()
  })
}

for (const field of projectEditableFields) {
  field.addEventListener('input', () => syncProjectFromForm(field))
  field.addEventListener('change', () => syncProjectFromForm(field))
}

for (const field of introductionEditableFields) {
  field.addEventListener('input', syncIntroductionFromForm)
}

for (const button of elements.previewLanguageButtons) {
  button.addEventListener('click', () => {
    state.previewLanguage = button.dataset.previewLanguage
    renderIntroductionPreview()
  })
}

for (const dialog of [elements.deleteDialog, elements.publishDialog]) {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && !state.busy) dialog.close()
  })
  dialog.addEventListener('cancel', (event) => {
    if (state.busy) event.preventDefault()
  })
}

elements.publishDialog.addEventListener('close', () => {
  if (!state.busy) state.publishPlanId = null
})

window.addEventListener('beforeunload', (event) => {
  if (!state.dirty && !state.busy) return
  event.preventDefault()
  event.returnValue = ''
})

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    saveProjects()
  }
})

loadWorkspace()
