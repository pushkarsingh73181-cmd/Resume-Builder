import React from 'react'

export default function ClassicTemplate({ data }) {
  return (
    <div className="bg-white" style={{ width: '794px', minHeight: '1123px', padding: '32px 40px' }}>
      {/* Header */}
      <div className="text-center mb-4 pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-black text-gray-900">{data.contact.fullName}</h1>
        <p className="text-base text-gray-600 mt-1">{data.contact.jobTitle}</p>
        <div className="flex justify-center gap-2 mt-2 text-xs text-gray-600">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>|</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>|</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Summary
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.some((e) => e.jobTitle || e.company) && (
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Experience
          </h3>
          {data.experience.map((exp, idx) => (
            (exp.jobTitle || exp.company) && (
              <div key={idx} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{exp.jobTitle}</h4>
                    <p className="text-xs text-gray-700">{exp.company}</p>
                  </div>
                  {exp.startDate && (
                    <p className="text-xs text-gray-600">{exp.startDate}</p>
                  )}
                </div>
                {exp.location && <p className="text-xs text-gray-600">{exp.location}</p>}
                {exp.bullets.some((b) => b.trim()) && (
                  <ul className="text-xs text-gray-700 mt-1 ml-4 space-y-0.5">
                    {exp.bullets.map(
                      (bullet, bIdx) =>
                        bullet.trim() && <li key={bIdx} className="list-disc">{bullet}</li>
                    )}
                  </ul>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.some((e) => e.institution || e.degree) && (
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Education
          </h3>
          {data.education.map((edu, idx) => (
            (edu.institution || edu.degree) && (
              <div key={idx} className="mb-2">
                <h4 className="text-sm font-bold text-gray-900">{edu.institution}</h4>
                <p className="text-xs text-gray-700">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </p>
                {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {Object.values(data.skills).some((s) => s.length > 0) && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Skills
          </h3>
          <div className="text-xs text-gray-700">
            {Object.entries(data.skills).map(
              ([category, skills]) =>
                skills.length > 0 && (
                  <p key={category}>
                    <strong>{category.charAt(0).toUpperCase() + category.slice(1)}:</strong> {skills.join(', ')}
                  </p>
                )
            )}
          </div>
        </div>
      )}
    </div>
  )
}
