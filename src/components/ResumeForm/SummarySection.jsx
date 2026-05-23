import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateSummary } from '../../store/resumeSlice'
import usePlan from '../../hooks/usePlan'
import UpgradeModal from '../UpgradeModal'

export default function SummarySection() {
  const dispatch = useDispatch()
  const summary = useSelector((state) => state.resume.summary)
  const characterCount = summary.length
  const { checkFeature } = usePlan()

  const [showUpgrade, setShowUpgrade] = useState(false)

  const handleMagicWrite = () => {
    if (!checkFeature('magicWrite')) {
      setShowUpgrade(true)
      return
    }

    // Simulate AI-generated content (replace with real API call later)
    const aiText = 'AI-generated professional summary tailored to your role and experience. Optimize for impact, brevity, and relevant keywords.'
    dispatch(updateSummary(aiText))
  }

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Professional Summary</h3>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">Summary</label>
          <button
            onClick={handleMagicWrite}
            className="text-xs bg-indigo-600 text-white rounded px-3 py-1"
            title="Magic Write — AI-powered summary (Pro)"
          >
            Magic Write
          </button>
        </div>

        <textarea
          value={summary}
          onChange={(e) => dispatch(updateSummary(e.target.value))}
          placeholder="Write a brief professional summary..."
          rows={5}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="text-xs text-gray-500 mt-1.5">{characterCount} / 500 characters</p>
      </div>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        title="Magic Write is a Pro feature"
        description="Magic Write is available to Pro users. Upgrade to unlock AI-powered writing assistance."
        onUpgrade={() => {
          // redirect to pricing page or trigger upgrade flow
          window.location.href = '/pricing'
        }}
      />
    </div>
  )
}
