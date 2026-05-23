import express from 'express'

const router = express.Router()

router.post('/analyze', (req, res) => {
  res.status(501).json({ error: 'JD analysis coming in Week 2' })
})

export default router
