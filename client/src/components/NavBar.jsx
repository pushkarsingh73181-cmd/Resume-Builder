import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import usePlan from '../hooks/usePlan'

export default function NavBar() {
  const { user, logout } = useContext(AuthContext)
  const { plan, isPro } = usePlan()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <>
      <nav className="w-full bg-[#0f0f1a] border-b border-[#2a2550] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white font-bold text-xl tracking-tight">CareerForge Pro</Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#about" className="hover:text-white transition">About</a>
          {user && (
            <Link to="/dashboard" className="text-white font-medium hover:text-purple-200">
              Dashboard
            </Link>
          )}
          {user && (
            <Link to="/account" className="text-white font-medium hover:text-purple-200">
              Account
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-xs font-semibold">
                  {initials}
                </span>
                <span className="flex items-center gap-2">
                  {user.name || user.email}
                  {isPro && <span className="rounded-full bg-purple-500 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white">Pro</span>}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0f0f1a] transition hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-400"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>
      {user && plan === 'free' && (
        <div className="w-full bg-[#1a1440] border-b border-[#2a2550] px-6 py-3 text-center text-sm text-purple-200">
          You're on the Free plan. Upgrade to Pro to unlock AI Magic Write, ATS scoring, and clean PDF export. <Link to="/pricing" className="underline text-white">Upgrade now</Link>
        </div>
      )}
    </>
  )
}
