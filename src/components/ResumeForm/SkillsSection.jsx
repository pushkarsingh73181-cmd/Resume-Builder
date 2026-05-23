import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateSkillCategory } from '../../store/resumeSlice'

const SKILL_CATEGORIES = ['languages', 'frontend', 'backend', 'infrastructure', 'practices']
const CATEGORY_LABELS = {
  languages: 'Languages',
  frontend: 'Frontend',
  backend: 'Backend',
  infrastructure: 'Infrastructure',
  practices: 'Practices',
}

export default function SkillsSection() {
  const dispatch = useDispatch()
  const skills = useSelector((state) => state.resume.skills)
  const [inputValues, setInputValues] = useState({
    languages: '',
    frontend: '',
    backend: '',
    infrastructure: '',
    practices: '',
  })

  const handleAddSkill = (category) => {
    const value = inputValues[category].trim()
    if (!value) return

    const currentSkills = skills[category] || []
    dispatch(updateSkillCategory({ category, skills: [...currentSkills, value] }))
    setInputValues({ ...inputValues, [category]: '' })
  }

  const handleRemoveSkill = (category, index) => {
    const currentSkills = skills[category] || []
    const updated = currentSkills.filter((_, i) => i !== index)
    dispatch(updateSkillCategory({ category, skills: updated }))
  }

  const handleKeyDown = (e, category) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddSkill(category)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Skills</h3>

      {SKILL_CATEGORIES.map((category) => (
        <div key={category}>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">{CATEGORY_LABELS[category]}</label>

          <div className="flex flex-wrap gap-2 mb-2 p-3 bg-gray-50 rounded-lg min-h-10">
            {(skills[category] || []).map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(category, index)}
                  className="hover:text-indigo-900 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValues[category]}
              onChange={(e) => setInputValues({ ...inputValues, [category]: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, category)}
              placeholder="Type skill and press Enter"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleAddSkill(category)}
              className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
