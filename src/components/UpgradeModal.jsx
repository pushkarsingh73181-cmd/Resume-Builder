import React from 'react'

export default function UpgradeModal({ open, onClose, onUpgrade, title, description }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-10">
        <h3 className="text-lg font-semibold mb-2">{title || 'Upgrade required'}</h3>
        <p className="text-sm text-gray-600 mb-4">{description || 'This is a Pro feature. Upgrade to Pro to unlock it.'}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded border">Cancel</button>
          <button
            onClick={onUpgrade}
            className="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  )
}
