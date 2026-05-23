import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateContact } from '../../store/resumeSlice'

export default function ContactSection() {
  const dispatch = useDispatch()
  const contact = useSelector((state) => state.resume.contact)

  const handleChange = (field, value) => {
    dispatch(updateContact({ [field]: value }))
  }

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Contact Information</h3>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Full Name</label>
        <input
          type="text"
          value={contact.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="John Doe"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Job Title</label>
        <input
          type="text"
          value={contact.jobTitle}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          placeholder="Software Engineer"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">Email</label>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">Phone</label>
          <input
            type="tel"
            value={contact.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">Location</label>
          <input
            type="text"
            value={contact.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="San Francisco, CA"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">LinkedIn</label>
          <input
            type="url"
            value={contact.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/john"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Website</label>
        <input
          type="url"
          value={contact.website}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="https://johndoe.com"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  )
}
