import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { subscriptionGate } from '../middleware/subscriptionGate.js'
import { generatePDF } from '../services/puppeteerService.js'

const router = express.Router()

router.post('/generate', authMiddleware, subscriptionGate, async (req, res) => {
  try {
    const resumeData = req.body
    const pdfBuffer = await generatePDF(resumeData, resumeData.selectedTemplate || 'modern')
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${(resumeData.name || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf"`,
    })
    res.send(pdfBuffer)
  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({ error: 'PDF generation failed. Please try again later.' })
  }
})

export default router
