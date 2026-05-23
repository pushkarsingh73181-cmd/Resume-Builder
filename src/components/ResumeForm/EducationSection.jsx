import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addEducation, updateEducation, removeEducation } from '../../store/resumeSlice'

export default function EducationSection() {
  const dispatch = useDispatch()
  const education = useSelector((state) => state.resume.education)

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Education</h3>

      {education.map((edu) => (
        <div key={edu.id} className="border border-gray-100 rounded-xl p-4 mb-4">
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Institution</label>
            <input
              type="text"
              value={edu.institution}
              onChange={(e) => dispatch(updateEducation({ id: edu.id, field: 'institution', value: e.target.value }))}
              placeholder="University Name"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => dispatch(updateEducation({ id: edu.id, field: 'degree', value: e.target.value }))}
                placeholder="Bachelor of Science"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Field of Study</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => dispatch(updateEducation({ id: edu.id, field: 'field', value: e.target.value }))}
                placeholder="Computer Science"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Start Date</label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => dispatch(updateEducation({ id: edu.id, field: 'startDate', value: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">End Date</label>
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => dispatch(updateEducation({ id: edu.id, field: 'endDate', value: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">GPA (Optional)</label>
            <input
              type="text"
              value={edu.gpa}
              onChange={(e) => dispatch(updateEducation({ id: edu.id, field: 'gpa', value: e.target.value }))}
              placeholder="3.8"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => dispatch(removeEducation(edu.id))}
            className="text-red-600 hover:text-red-700 text-xs font-medium"
          >
            Remove Education
          </button>
        </div>
      ))}

      <button
        onClick={() => dispatch(addEducation())}
        className="w-full py-2 px-3 border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 text-sm font-medium hover:border-indigo-400 hover:bg-indigo-50"
      >
        + Add Education
      </button>
    </div>
  )
}
