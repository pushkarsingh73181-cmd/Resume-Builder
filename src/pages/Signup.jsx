import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import { AuthContext } from '../AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { login, user } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Full name is required'
    const emailRe = /^\S+@\S+\.\S+$/
    if (!email.trim()) errs.email = 'Email is required'
    else if (!emailRe.test(email)) errs.email = 'Please enter a valid email address'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords don't match"
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setLoading(true)

    try {
      const response = await api.post('/auth/register', { name, email, password })
      if (response?.data?.token) {
        await login(response.data.token)
        setShowWelcome(true)
        setTimeout(() => navigate('/dashboard'), 2200)
      }
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach the API server. Please start the backend and try again.')
      } else if (err.response?.status === 409) {
        setError('An account with this email already exists')
      } else if (err.response?.status === 400 && Array.isArray(err.response?.data?.errors)) {
        const serverFieldErrors = {}
        err.response.data.errors.forEach((e) => {
          if (e.param) serverFieldErrors[e.param] = e.msg
        })
        setFieldErrors(serverFieldErrors)
        setError('Please fix the highlighted fields')
      } else {
        setError(err.response?.data?.error || 'Signup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111428]/95 p-10 shadow-2xl shadow-black/30">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#9da6ff]">Create your account</p>
          <h1 className="mt-4 text-3xl font-bold">Ready to build your resume?</h1>
          <p className="mt-2 text-slate-400">Start your free CareerForge Pro experience today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-200">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
            />
            {fieldErrors.name && <div className="mt-2 text-sm text-red-400">{fieldErrors.name}</div>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
            />
            {fieldErrors.email && <div className="mt-2 text-sm text-red-400">{fieldErrors.email}</div>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
            />
            {fieldErrors.password && <div className="mt-2 text-sm text-red-400">{fieldErrors.password}</div>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-200">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
            />
            {fieldErrors.confirmPassword && <div className="mt-2 text-sm text-red-400">{fieldErrors.confirmPassword}</div>}
          </div>

          {error && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#6c47ff] px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-300 hover:text-white font-semibold">
            Log In
          </Link>
        </p>
      </div>

      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111428] border border-white/10 p-8 text-white shadow-2xl">
            <h2 className="text-2xl font-bold">Welcome to CareerForge Pro</h2>
            <p className="mt-4 text-slate-300">You are now on the Free plan. Upgrade anytime to unlock Pro features like AI Magic Write, ATS scoring, premium templates, and clean PDF export.</p>
            <div className="mt-6 flex flex-col gap-3">
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Free plan</p>
                <p className="mt-2 text-slate-300">One resume, live preview, and basic templates.</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Pro plan</p>
                <p className="mt-2 text-slate-300">Unlimited resumes, AI writing, ATS scoring, premium templates, and PDF downloads.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 w-full rounded-full bg-purple-500 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-400"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
