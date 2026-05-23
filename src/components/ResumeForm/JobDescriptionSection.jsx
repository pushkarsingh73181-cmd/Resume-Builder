import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setJobDescription } from '../../store/resumeSlice'

export default function JobDescriptionSection() {
  const dispatch = useDispatch()
  const jobDescription = useSelector((state) => state.resume.jobDescription)
  const characterCount = jobDescription.length

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Job Description</h3>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Paste Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => dispatch(setJobDescription(e.target.value))}
          placeholder="Paste the full job description here..."
          rows={12}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="text-xs text-gray-500 mt-1.5">{characterCount} characters</p>
      </div>

      <button
        disabled
        title="Available in Week 2"
        className="w-full py-2 px-3 bg-gray-300 text-gray-600 text-sm font-medium rounded-lg cursor-not-allowed"
      >
        Analyze JD (Coming in Week 2)
      </button>
    </div>
  )
}
