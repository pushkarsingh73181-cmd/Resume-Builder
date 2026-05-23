import React, { createContext, useState, useEffect, useCallback } from 'react'
import api from './utils/api'

export const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  loading: false,
})

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('cfp_token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchProfile = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.user || res.data || null)
    } catch (e) {
      // on any error, clear auth
      localStorage.removeItem('cfp_token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchProfile()
  }, [token, fetchProfile])

  const login = async (newToken) => {
    localStorage.setItem('cfp_token', newToken)
    setToken(newToken)
    await fetchProfile()
  }

  const logout = () => {
    localStorage.removeItem('cfp_token')
    setToken(null)
    setUser(null)
  }

  const refreshUser = async () => {
    await fetchProfile()
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

