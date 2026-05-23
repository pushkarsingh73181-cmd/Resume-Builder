import User from '../models/User.js'

export const subscriptionGate = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const hasActiveSubscription = ['active', 'trialing'].includes(user.subscriptionStatus)
    if (!hasActiveSubscription) {
      return res.status(403).json({ error: 'An active Pro subscription is required for this feature.' })
    }

    next()
  } catch (error) {
    console.error('Subscription access check failed:', error)
    res.status(500).json({ error: 'Unable to verify subscription access.' })
  }
}
