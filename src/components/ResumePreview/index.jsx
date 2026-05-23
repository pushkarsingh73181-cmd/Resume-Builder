import React from 'react'
import ModernTemplate from './templates/ModernTemplate'
import ClassicTemplate from './templates/ClassicTemplate'

export default function ResumePreview({ data }) {
  const template = data.selectedTemplate || 'modern'

  return (
    <div
      id="resume-preview"
      className="flex justify-center items-start py-8"
      style={{
        background: '#f8fafc',
      }}
    >
      <div
        style={{
          boxShadow: '0 4px 32px rgba(0, 0, 0, 0.10)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        {template === 'modern' ? (
          <ModernTemplate data={data} />
        ) : (
          <ClassicTemplate data={data} />
        )}
      </div>
    </div>
  )
}
