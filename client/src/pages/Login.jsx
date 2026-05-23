import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import { AuthContext } from '../AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, user } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  const validate = () => {
    const errs = {}
    const emailRe = /^\S+@\S+\.\S+$/
    if (!email.trim()) errs.email = 'Email is required'
    else if (!emailRe.test(email)) errs.email = 'Enter a valid email'
    if (!password) errs.password = 'Password is required'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setLoading(true)

    try {
      const response = await api.post('/auth/login', { email, password })
      if (response?.data?.token) {
        await login(response.data.token)
      }
      navigate('/dashboard')
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach the API server. Please start the backend and try again.')
      } else if (err.response?.status === 401) {
        setError('Invalid email or password')
      } else {
        setError(err.response?.data?.error || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111428]/95 p-10 shadow-2xl shadow-black/30">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#9da6ff]">CareerForge Pro</p>
          <h1 className="mt-4 text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-slate-400">Log in to continue building your resume.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-200">Password</label>
              <button type="button" className="text-sm text-purple-300 hover:text-white">Forgot password?</button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
            />
            {fieldErrors.password && <div className="mt-2 text-sm text-red-400">{fieldErrors.password}</div>}
          </div>

          {error && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#6c47ff] px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-300 hover:text-white font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
