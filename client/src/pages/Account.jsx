import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { AuthContext } from '../AuthContext'
import usePlan from '../hooks/usePlan'

export default function Account() {
  const navigate = useNavigate()
  const { user, refreshUser } = useContext(AuthContext)
  const { plan, isPro } = usePlan()
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStatus = async () => {
      try {
        setLoading(true)
        const res = await api.get('/subscription/status')
        setStatus(res.data)
      } catch (err) {
        console.error(err)
        setError('Could not load subscription details.')
      } finally {
        setLoading(false)
      }
    }
    loadStatus()
  }, [])

  const handleCancel = async () => {
    setError('')
    try {
      setLoading(true)
      await api.post('/subscription/cancel')
      await refreshUser()
      const res = await api.get('/subscription/status')
      setStatus(res.data)
      setConfirmCancel(false)
    } catch (err) {
      console.error(err)
      setError('Unable to cancel subscription right now.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading account details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white px-4 py-16">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-[#111428] p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Account</p>
              <h1 className="mt-3 text-4xl font-bold">Your plan & billing</h1>
              <p className="mt-2 text-slate-400">Manage your CareerForge Pro subscription and see recent activity.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-purple-500 px-4 py-2 text-sm font-semibold text-white">{plan === 'pro' ? 'Pro plan' : 'Free plan'}</span>
              {isPro && status?.user?.planExpiresAt && (
                <span className="rounded-full border border-purple-500 px-4 py-2 text-sm text-purple-200">
                  Expires {new Date(status.user.planExpiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Plan summary</h2>
              <p className="mt-3 text-slate-300">{plan === 'pro'
                ? 'You have access to all Pro features and unlimited resume exports.'
                : 'Your Free plan includes one resume, basic templates, and live preview access.'}
              </p>
              {status?.user?.subscriptionStatus && (
                <p className="mt-4 text-sm text-slate-400">Subscription status: {status.user.subscriptionStatus}</p>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Next steps</h2>
              <div className="mt-6 space-y-3">
                {!isPro && (
                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full rounded-full bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-400"
                  >
                    Upgrade to Pro
                  </button>
                )}
                {isPro && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setConfirmCancel(true)}
                      className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Cancel subscription
                    </button>
                    <p className="text-sm text-slate-400">Cancelling will stop renewal at the end of the current billing period.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-[#111428] p-6">
            <h2 className="text-xl font-semibold">Last payment</h2>
            {status?.lastInvoice ? (
              <div className="mt-4 space-y-3 text-slate-300">
                <p>Invoice: <span className="font-semibold text-white">{status.lastInvoice.id}</span></p>
                <p>Amount paid: <span className="font-semibold text-white">{(status.lastInvoice.amountPaid / 100).toFixed(2)} {status.lastInvoice.currency?.toUpperCase()}</span></p>
                <p>Status: <span className="font-semibold text-white">{status.lastInvoice.status}</span></p>
                <p>Period end: <span className="font-semibold text-white">{status.lastInvoice.periodEnd ? new Date(status.lastInvoice.periodEnd).toLocaleDateString() : 'N/A'}</span></p>
              </div>
            ) : (
              <p className="mt-4 text-slate-400">No invoice data available yet.</p>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#111428] p-6">
            <h2 className="text-xl font-semibold">User details</h2>
            <div className="mt-4 space-y-3 text-slate-300">
              <p><span className="font-semibold text-white">Name:</span> {user.name}</p>
              <p><span className="font-semibold text-white">Email:</span> {user.email}</p>
              <p><span className="font-semibold text-white">Plan:</span> {plan === 'pro' ? 'Pro' : 'Free'}</p>
              <p><span className="font-semibold text-white">Resume projects:</span> {user.resumeCount || 0}</p>
            </div>
          </div>
        </div>

        {confirmCancel && (
          <div className="rounded-[2rem] border border-rose-500/20 bg-[#2a1424] p-6">
            <h3 className="text-lg font-semibold text-rose-200">Confirm cancellation</h3>
            <p className="mt-3 text-slate-300">Are you sure you want to cancel your Pro subscription? It will remain active until the end of the current billing period.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                {loading ? 'Cancelling…' : 'Yes, cancel'}
              </button>
              <button
                onClick={() => setConfirmCancel(false)}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Keep plan
              </button>
            </div>
            {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
