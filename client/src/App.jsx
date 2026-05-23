import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Builder from './pages/Builder'
import CoverLetter from './pages/CoverLetter'
import Pricing from './pages/Pricing'
import Account from './pages/Account'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthProvider } from './AuthContext'
import PrivateRoute from './PrivateRoute'
import NavBar from './components/NavBar'
import Admin from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Builder /></PrivateRoute>} />
          <Route path="/builder" element={<Navigate to="/dashboard" replace />} />
          <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
          <Route path="/cover-letter" element={<CoverLetter />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
