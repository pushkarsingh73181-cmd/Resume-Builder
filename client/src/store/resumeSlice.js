import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id: null,
  name: 'Untitled Resume',
  contact: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experience: [
    {
      id: 'exp-1',
      company: '',
      jobTitle: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    },
  ],
  skills: {
    languages: [],
    frontend: [],
    backend: [],
    infrastructure: [],
    practices: [],
  },
  jobDescription: '',
  atsScoreBefore: 0,
  atsScoreAfter: 0,
  extractedKeywords: [],
  activeSection: 'contact',
  selectedTemplate: 'modern',
  isSaving: false,
  lastSaved: null,
}

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    updateContact: (state, action) => {
      state.contact = { ...state.contact, ...action.payload }
    },
    setResumeName: (state, action) => {
      state.name = action.payload
    },
    updateSummary: (state, action) => {
      state.summary = action.payload
    },
    addExperience: (state) => {
      const newId = `exp-${Date.now()}`
      state.experience.push({
        id: newId,
        company: '',
        jobTitle: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        bullets: [''],
      })
    },
    updateExperience: (state, action) => {
      const { id, field, value } = action.payload
      const exp = state.experience.find((e) => e.id === id)
      if (exp) {
        exp[field] = value
      }
    },
    addBullet: (state, action) => {
      const expId = action.payload
      const exp = state.experience.find((e) => e.id === expId)
      if (exp) {
        exp.bullets.push('')
      }
    },
    updateBullet: (state, action) => {
      const { expId, index, value } = action.payload
      const exp = state.experience.find((e) => e.id === expId)
      if (exp && exp.bullets[index] !== undefined) {
        exp.bullets[index] = value
      }
    },
    removeBullet: (state, action) => {
      const { expId, index } = action.payload
      const exp = state.experience.find((e) => e.id === expId)
      if (exp && exp.bullets[index] !== undefined) {
        exp.bullets.splice(index, 1)
      }
    },
    removeExperience: (state, action) => {
      state.experience = state.experience.filter((e) => e.id !== action.payload)
    },
    addEducation: (state) => {
      const newId = `edu-${Date.now()}`
      state.education.push({
        id: newId,
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
      })
    },
    updateEducation: (state, action) => {
      const { id, field, value } = action.payload
      const edu = state.education.find((e) => e.id === id)
      if (edu) {
        edu[field] = value
      }
    },
    removeEducation: (state, action) => {
      state.education = state.education.filter((e) => e.id !== action.payload)
    },
    updateSkillCategory: (state, action) => {
      const { category, skills } = action.payload
      state.skills[category] = skills
    },
    setJobDescription: (state, action) => {
      state.jobDescription = action.payload
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload
    },
    setATSScores: (state, action) => {
      const { before, after } = action.payload
      state.atsScoreBefore = before
      state.atsScoreAfter = after
    },
    setExtractedKeywords: (state, action) => {
      state.extractedKeywords = action.payload
    },
    loadResume: (state, action) => {
      return action.payload
    },
    resetResume: (state) => {
      return initialState
    },
    setIsSaving: (state, action) => {
      state.isSaving = action.payload
    },
    setLastSaved: (state, action) => {
      state.lastSaved = action.payload
    },
  },
})

export const {
  updateContact,
  setResumeName,
  updateSummary,
  addExperience,
  updateExperience,
  addBullet,
  updateBullet,
  removeBullet,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  updateSkillCategory,
  setJobDescription,
  setActiveSection,
  setSelectedTemplate,
  setATSScores,
  setExtractedKeywords,
  loadResume,
  resetResume,
  setIsSaving,
  setLastSaved,
} = resumeSlice.actions

export default resumeSlice.reducer
