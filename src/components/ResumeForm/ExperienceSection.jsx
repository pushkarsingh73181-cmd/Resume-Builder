import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  addExperience,
  updateExperience,
  removeExperience,
  addBullet,
  updateBullet,
  removeBullet,
} from '../../store/resumeSlice'

export default function ExperienceSection() {
  const dispatch = useDispatch()
  const experience = useSelector((state) => state.resume.experience)

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Experience</h3>

      {experience.map((exp) => (
        <div key={exp.id} className="border border-gray-100 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Job Title</label>
              <input
                type="text"
                value={exp.jobTitle}
                onChange={(e) => dispatch(updateExperience({ id: exp.id, field: 'jobTitle', value: e.target.value }))}
                placeholder="Software Engineer"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => dispatch(updateExperience({ id: exp.id, field: 'company', value: e.target.value }))}
                placeholder="Tech Company"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Location</label>
            <input
              type="text"
              value={exp.location}
              onChange={(e) => dispatch(updateExperience({ id: exp.id, field: 'location', value: e.target.value }))}
              placeholder="San Francisco, CA"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Start Date</label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => dispatch(updateExperience({ id: exp.id, field: 'startDate', value: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">End Date</label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => dispatch(updateExperience({ id: exp.id, field: 'endDate', value: e.target.value }))}
                disabled={exp.current}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={exp.current}
              onChange={(e) => dispatch(updateExperience({ id: exp.id, field: 'current', value: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Currently working here</span>
          </label>

          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Key Responsibilities & Achievements</label>
            {exp.bullets.map((bullet, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <textarea
                  value={bullet}
                  onChange={(e) => dispatch(updateBullet({ expId: exp.id, index, value: e.target.value }))}
                  placeholder="Describe your achievement..."
                  rows={2}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => dispatch(removeBullet({ expId: exp.id, index }))}
                  className="text-red-500 hover:text-red-700 font-bold text-lg flex-shrink-0 pt-1"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => dispatch(addBullet(exp.id))}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2"
            >
              + Add bullet point
            </button>
          </div>

          <button
            onClick={() => dispatch(removeExperience(exp.id))}
            className="text-red-600 hover:text-red-700 text-xs font-medium"
          >
            Remove Experience
          </button>
        </div>
      ))}

      <button
        onClick={() => dispatch(addExperience())}
        className="w-full py-2 px-3 border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 text-sm font-medium hover:border-indigo-400 hover:bg-indigo-50"
      >
        + Add Experience
      </button>
    </div>
  )
}
