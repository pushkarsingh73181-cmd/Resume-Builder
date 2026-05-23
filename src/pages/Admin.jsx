import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../AuthContext'

export default function Admin() {
  const { user } = useContext(AuthContext)

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">Welcome, {user?.name || user?.email}. This area is only for administrators.</p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">User stats</h2>
          <p className="text-sm text-gray-500">(Placeholder) Add graphs and user management tools here.</p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">System actions</h2>
          <p className="text-sm text-gray-500">(Placeholder) Add admin actions like manage plans, view errors, etc.</p>
        </div>
      </section>
    </div>
  )
}
