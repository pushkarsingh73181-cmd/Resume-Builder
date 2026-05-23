import { useContext, useMemo } from 'react'
import { AuthContext } from '../AuthContext'

// usePlan: returns plan info and a helper to check feature availability
export default function usePlan() {
  const { user } = useContext(AuthContext)

  const isActivePro = useMemo(() => {
    if (!user) return false
    if (user.plan === 'pro' && user.subscriptionStatus === 'active') return true
    if (user.isPro && user.plan !== 'free') return true
    return false
  }, [user])

  const plan = useMemo(() => {
    if (!user) return 'free'
    return isActivePro ? 'pro' : 'free'
  }, [user, isActivePro])

  const checkFeature = (featureName) => {
    if (isActivePro) return true

    switch (featureName) {
      case 'magicWrite':
      case 'ats':
      case 'premiumTemplates':
      case 'pdf':
        return false
      case 'multipleResumes':
        return (user?.resumeCount || 0) < 1
      default:
        return false
    }
  }

  return {
    plan,
    isPro: isActivePro,
    user,
    checkFeature,
  }
}
