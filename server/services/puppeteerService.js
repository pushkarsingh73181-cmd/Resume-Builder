import puppeteer from 'puppeteer'

const renderSection = (title, content) => {
  if (!content) return ''
  return `<div class="section"><h2>${title}</h2>${content}</div>`
}

const safeText = (value) => {
  if (!value && value !== 0) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const buildHtml = (resume, template) => {
  const contact = resume.contact || {}
  const experience = Array.isArray(resume.experience) ? resume.experience : []
  const education = Array.isArray(resume.education) ? resume.education : []
  const skills = Array.isArray(resume.skills) ? resume.skills : []
  const summary = safeText(resume.summary)
  const jobDescription = safeText(resume.jobDescription)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeText(resume.name || 'Resume')}</title>
  <style>
    @page { size: A4; margin: 20mm }
    html, body { margin: 0; padding: 0; min-height: 100%; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background: white; }
    body { padding: 24px; }
    .page { width: 100%; max-width: 794px; margin: 0 auto; }
    .wrapper { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; margin-bottom: 22px; }
    .name { font-size: 34px; font-weight: 800; line-height: 1.05; margin: 0; }
    .title { color: #6366f1; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; margin-top: 8px; }
    .contact { display: grid; gap: 6px; font-size: 11px; color: #52525b; line-height: 1.6; }
    .section { margin-bottom: 18px; }
    h2 { font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: #4f46e5; margin: 0 0 12px 0; }
    p, li { margin: 0; font-size: 12px; color: #374151; line-height: 1.6; }
    .block { border-radius: 16px; padding: 18px 20px; background: #fafafa; }
    .item { margin-bottom: 14px; }
    .item-heading { display: flex; justify-content: space-between; gap: 8px; font-weight: 700; color: #111827; }
    .item-meta { font-size: 11px; color: #6b7280; margin-top: 4px; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .chip { background: #eff6ff; color: #1d4ed8; padding: 6px 10px; border-radius: 999px; font-size: 11px; }
    .page-break { page-break-after: always; }
    .preview { white-space: pre-wrap; word-break: break-word; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <h1 class="name">${safeText(contact.fullName || resume.name || 'Your Name')}</h1>
        <div class="title">${safeText(contact.title || '')}</div>
      </div>
      <div class="contact">
        ${safeText(contact.email)}
        ${safeText(contact.phone)}
        ${safeText(contact.location)}
      </div>
    </div>

    <div class="wrapper">
      <div>
        ${summary ? `<div class="section"><h2>Summary</h2><p class="preview">${summary}</p></div>` : ''}
        ${experience.length ? `<div class="section"><h2>Experience</h2>${experience.map((item) => `
          <div class="item">
            <div class="item-heading"><span>${safeText(item.role || item.company)}</span><span>${safeText(item.startDate)} — ${safeText(item.endDate || 'Present')}</span></div>
            <div class="item-meta">${safeText(item.company)} ${item.location ? '• ' + safeText(item.location) : ''}</div>
            <p class="preview">${safeText(item.details)}</p>
          </div>
        `).join('')}</div>` : ''}
        ${education.length ? `<div class="section"><h2>Education</h2>${education.map((item) => `
          <div class="item">
            <div class="item-heading"><span>${safeText(item.degree || item.institution)}</span><span>${safeText(item.startDate)} — ${safeText(item.endDate || 'Present')}</span></div>
            <p class="preview">${safeText(item.institution)}</p>
            <p class="preview">${safeText(item.details)}</p>
          </div>
        `).join('')}</div>` : ''}
      </div>
      <div>
        ${jobDescription ? `<div class="section block"><h2>Job Description</h2><p class="preview">${jobDescription}</p></div>` : ''}
        ${skills.length ? `<div class="section block"><h2>Skills</h2><div class="chips">${skills.filter(Boolean).map((skill) => `<span class="chip">${safeText(skill)}</span>`).join('')}</div></div>` : ''}
      </div>
    </div>
  </div>
</body>
</html>`
}

export const generatePDF = async (resumeData, template = 'modern') => {
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath,
  })
  const page = await browser.newPage()
  const html = buildHtml(resumeData, template)

  await page.setContent(html, { waitUntil: 'networkidle0' })
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
    preferCSSPageSize: true,
  })

  await browser.close()
  return pdf
}
