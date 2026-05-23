import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { AuthContext } from '../AuthContext'
import usePlan from '../hooks/usePlan'

export default function Pricing() {
  const navigate = useNavigate()
  const { user, refreshUser } = useContext(AuthContext)
  const { plan } = usePlan()
  const [billingCycle, setBillingCycle] = useState('month')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    const canceled = params.get('canceled')

    if (canceled && !sessionId) {
      setStatusMessage('Checkout was canceled. No changes were made.')
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }

    if (sessionId) {
      setStatusMessage('Verifying your payment...')
      api.post('/subscription/verify-payment', { sessionId })
        .then(async () => {
          await refreshUser()
          setStatusMessage('Payment verified! Your Pro plan is active.')
          window.history.replaceState({}, document.title, window.location.pathname)
        })
        .catch((error) => {
          console.error('Verification error', error)
          setStatusMessage('Payment verification is still processing. Please refresh in a moment.')
        })
    }
  }, [refreshUser])

  const handleCheckout = async () => {
    if (!user) return navigate('/login')
    setLoading(true)
    try {
      const res = await api.post('/subscription/create-order', { billingCycle })
      const { url } = res.data
      if (url) {
        window.location.href = url
      }
    } catch (e) {
      console.error('Checkout error', e)
      const serverError = e.response?.data?.error || 'Unable to start checkout. Please try again later.'
      setStatusMessage(serverError)
    } finally {
      setLoading(false)
    }
  }

  const isPro = plan === 'pro'
  const priceLabel = billingCycle === 'year' ? '₹360 / year' : '₹50 / month'

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Pricing</p>
            <h1 className="mt-4 text-4xl font-bold">CareerForge Pro</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Unlock AI Magic Write, ATS scoring, premium templates, clean export, and unlimited resumes.</p>
          </div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-2 text-sm text-slate-200">
            <button
              type="button"
              className={`rounded-full px-4 py-2 transition ${billingCycle === 'month' ? 'bg-purple-500 text-white' : 'text-slate-300 hover:text-white'}`}
              onClick={() => setBillingCycle('month')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 transition ${billingCycle === 'year' ? 'bg-purple-500 text-white' : 'text-slate-300 hover:text-white'}`}
              onClick={() => setBillingCycle('year')}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#9da6ff]">Free Plan</p>
                <h2 className="mt-4 text-3xl font-bold">Free</h2>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Current</span>
            </div>
            <p className="mt-6 text-slate-300">One resume, basic templates, and preview access — perfect for starting out.</p>
            <ul className="mt-8 space-y-3 text-slate-300">
              <li>✔ 1 resume only</li>
              <li>❌ AI Magic Write</li>
              <li>❌ ATS Score Checker</li>
              <li>❌ Premium templates</li>
              <li>❌ Clean PDF downloads</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-purple-500 bg-[#1f1647] p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-purple-200">Pro Plan</p>
                <h2 className="mt-4 text-3xl font-bold">Pro</h2>
              </div>
              <div className="rounded-full bg-purple-500 px-3 py-1 text-xs font-semibold text-white">Save 40% yearly</div>
            </div>
            <p className="mt-6 text-slate-300">Unlimited resumes, premium templates, clean PDF downloads, and advanced AI support.</p>
            <div className="mt-8 text-4xl font-bold">{priceLabel}</div>
            <ul className="mt-8 space-y-3 text-slate-300">
              <li>✔ Unlimited resumes</li>
              <li>✔ AI Magic Write</li>
              <li>✔ ATS Score Checker</li>
              <li>✔ All premium templates</li>
              <li>✔ Clean PDF downloads</li>
              <li>✔ Priority support</li>
            </ul>
            <button
              onClick={handleCheckout}
              disabled={loading || isPro}
              className={`mt-8 w-full rounded-full px-6 py-3 text-sm font-semibold transition ${isPro ? 'bg-slate-600 text-slate-300 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-400'}`}
            >
              {isPro ? 'Current Plan' : loading ? 'Redirecting...' : 'Upgrade to Pro'}
            </button>
            {isPro && <p className="mt-3 text-sm text-slate-400">You are already subscribed to Pro.</p>}
          </div>
        </div>

        {statusMessage && <div className="mt-8 rounded-3xl bg-white/10 p-4 text-sm text-slate-200">{statusMessage}</div>}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate('/')}
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white transition hover:bg-white/10"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/account')}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0f0f1a] transition hover:bg-slate-100"
          >
            View Account
          </button>
        </div>
      </div>
    </div>
  )
}
