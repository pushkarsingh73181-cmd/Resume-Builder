import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-black text-gray-900 mb-4">Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">Coming soon — Dashboard</p>
      <button
        onClick={() => navigate('/builder')}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Back to Builder
      </button>
    </div>
  )
}
