import express from 'express'
import * as resumeController from '../controllers/resumeController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, resumeController.getAllResumes)
router.post('/', authMiddleware, resumeController.createResume)
router.put('/:id', authMiddleware, resumeController.updateResume)

export default router
