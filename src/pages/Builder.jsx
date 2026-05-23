import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadResume, setActiveSection, setIsSaving, setLastSaved, setResumeName, setSelectedTemplate } from '../store/resumeSlice'
import { useDebounce } from '../hooks/useDebounce'
import ResumeForm from '../components/ResumeForm'
import ResumePreview from '../components/ResumePreview'
import usePlan from '../hooks/usePlan'
import UpgradeModal from '../components/UpgradeModal'
import api from '../utils/api'

const SECTIONS = [
  { id: 'contact', label: 'Contact' },
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'jobDescription', label: 'Job Description' },
]

// Include a premium template example
const TEMPLATES = [
  { id: 'modern', label: 'Modern', premium: false },
  { id: 'classic', label: 'Classic', premium: false },
  { id: 'sleek', label: 'Sleek (Pro)', premium: true },
]

export default function Builder() {
  const dispatch = useDispatch()
  const resumeState = useSelector((state) => state.resume)
  const activeSection = useSelector((state) => state.resume.activeSection)
  const selectedTemplate = useSelector((state) => state.resume.selectedTemplate)
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(resumeState.name)
  const { checkFeature } = usePlan()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const debouncedResume = useDebounce(resumeState, 300)

  const handleSaveName = () => {
    dispatch(setResumeName(nameValue.trim() || 'Untitled Resume'))
    setEditingName(false)
  }

  const handleExportPDF = async () => {
    if (!checkFeature('pdf')) {
      setShowUpgrade(true)
      return
    }

    try {
      const response = await api.post('/pdf/generate', resumeState, {
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${resumeState.name || 'CareerForge-Resume'}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF export failed', error)
      setStatusMessage(error.response?.data?.error || 'Could not generate PDF. Please try again.')
    }
  }

  const handleSave = async () => {
    if (!resumeState._id && !checkFeature('multipleResumes')) {
      setShowUpgrade(true)
      return
    }

    dispatch(setIsSaving(true))
    setStatusMessage('')
    const payload = {
      name: resumeState.name,
      jobTitle: resumeState.contact.jobTitle,
      jobDescription: resumeState.jobDescription,
      resumeData: resumeState,
    }

    try {
      const response = resumeState._id
        ? await api.put(`/resume/${resumeState._id}`, payload)
        : await api.post('/resume', payload)
      const savedResume = response.data.resume

      if (!resumeState._id) {
        dispatch(loadResume({ ...resumeState, _id: savedResume._id, name: savedResume.name }))
      }
      dispatch(setLastSaved(new Date().toISOString()))
      setStatusMessage('Resume saved.')
    } catch (error) {
      if (error.response?.status === 402) {
        setShowUpgrade(true)
      } else {
        setStatusMessage(error.response?.data?.error || 'Could not save your resume. Please try again.')
      }
    } finally {
      dispatch(setIsSaving(false))
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Panel - Form */}
      <div
        className="w-[420px] border-r border-gray-200 flex flex-col overflow-hidden"
        style={{ maxWidth: '420px' }}
      >
        {/* Action Bar */}
        <div className="border-b border-gray-200 px-6 py-3.5 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {editingName ? (
                <input
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  autoFocus
                  className="border border-gray-200 rounded px-2 py-1 text-sm w-full"
                />
              ) : (
                <h2
                  onClick={() => {
                    setEditingName(true)
                    setNameValue(resumeState.name)
                  }}
                  className="font-semibold text-sm cursor-pointer hover:text-indigo-600"
                >
                  {resumeState.name}
                </h2>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {TEMPLATES.map((t) => {
                  const locked = t.premium && !checkFeature('premiumTemplates')
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        if (locked) {
                          setShowUpgrade(true)
                          return
                        }
                        dispatch(setSelectedTemplate(t.id))
                      }}
                      className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                        selectedTemplate === t.id ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                      } ${locked ? 'cursor-not-allowed opacity-70' : ''}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {t.label}
                        {t.premium && <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-bold uppercase text-[#0f0f1a]">Pro</span>}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={resumeState.isSaving}
                  className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900"
                >
                  {resumeState.isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-3 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {checkFeature('pdf') ? 'Export PDF' : 'Export PDF (Pro)'}
                </button>
              </div>
              {statusMessage && <p className="text-xs text-gray-500">{statusMessage}</p>}
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 flex overflow-x-auto">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => dispatch(setActiveSection(section.id))}
              className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeSection === section.id
                  ? 'border-indigo-600 bg-white text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <ResumeForm />
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 bg-gray-100 overflow-y-auto flex items-start justify-center py-8">
        <ResumePreview data={debouncedResume} />
      </div>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={() => (window.location.href = '/pricing')}
        title="Pro feature"
        description="This feature is available on CareerForge Pro. Upgrade to unlock premium features."
      />
    </div>
  )
}
