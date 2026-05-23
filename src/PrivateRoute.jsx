import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { token, user, loading } = useContext(AuthContext)
  if (loading) return null
  if (!token) return <Navigate to="/login" replace />
  if (allowedRoles.length && !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}
