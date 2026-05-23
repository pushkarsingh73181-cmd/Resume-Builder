import React, { useState } from 'react'
import usePlan from '../hooks/usePlan'
import UpgradeModal from './UpgradeModal'

export default function ATSScoreBar() {
  const { checkFeature } = usePlan()
  const [showUpgrade, setShowUpgrade] = useState(false)

  const allowed = checkFeature('ats')

  return (
    <div className="relative">
      <div className={`p-4 rounded text-center text-sm ${allowed ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500'}`}>
        {allowed ? (
          <div>ATS Score: <strong>78</strong></div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>ATS Scoring (Pro)</span>
            <button
              onClick={() => setShowUpgrade(true)}
              className="text-xs px-2 py-1 bg-indigo-600 text-white rounded"
            >
              Unlock
            </button>
          </div>
        )}
      </div>

      {!allowed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="backdrop-blur-sm w-full h-full opacity-60" />
        </div>
      )}

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        title="ATS Score Checker is a Pro feature"
        description="Unlock detailed ATS scoring and recommendations by upgrading to Pro."
        onUpgrade={() => window.location.href = '/pricing'}
      />
    </div>
  )
}
