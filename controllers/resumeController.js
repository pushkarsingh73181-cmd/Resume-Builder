import Resume from '../models/Resume.js'
import User from '../models/User.js'

// Helper: check if user is currently pro based on flags or subscription expiry
const userIsPro = (user) => {
  if (!user) return false
  if (user.isPro) return true
  if (user.subscriptionStatus && (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing')) return true
  if (user.subscriptionCurrentPeriodEnd && user.subscriptionCurrentPeriodEnd > new Date()) return true
  return false
}

export const getAllResumes = async (req, res) => {
  try {
    const userId = req.user.id
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 })
    res.json({ resumes })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createResume = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const isPro = userIsPro(user)

    if (!isPro) {
      // Count existing resumes
      const count = await Resume.countDocuments({ userId })
      if (count >= 1) {
        return res.status(402).json({ error: 'Upgrade required to create more resumes' })
      }
    }

    const payload = req.body || {}
    const resume = new Resume({
      userId,
      name: payload.name || 'Untitled Resume',
      jobTitle: payload.jobTitle || '',
      resumeData: payload.resumeData || {},
      jobDescription: payload.jobDescription || '',
    })

    await resume.save()

    // increment user's resumeCount for quick reference
    user.resumeCount = (user.resumeCount || 0) + 1
    await user.save()

    res.status(201).json({ resume })
  } catch (error) {
    console.error('Create resume error:', error)
    res.status(500).json({ error: error.message })
  }
}

export const updateResume = async (req, res) => {
  try {
    const userId = req.user.id
    const id = req.params.id
    const update = req.body || {}

    const resume = await Resume.findOneAndUpdate({ _id: id, userId }, update, { new: true })
    if (!resume) return res.status(404).json({ error: 'Resume not found' })

    res.json({ resume })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
