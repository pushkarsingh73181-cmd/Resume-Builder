import React from 'react'

export default function ModernTemplate({ data }) {
  return (
    <div className="bg-white" style={{ width: '794px', minHeight: '1123px' }}>
      {/* Header */}
      <div className="bg-indigo-600 text-white px-10 py-8">
        <h1 className="text-3xl font-black">{data.contact.fullName}</h1>
        <p className="text-indigo-200 text-base mt-1">{data.contact.jobTitle}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-indigo-100">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
          {data.contact.linkedin && <span>{data.contact.linkedin}</span>}
        </div>
      </div>

      {/* Body */}
      <div className="px-10 py-8 grid grid-cols-[35%_1fr] gap-8">
        {/* Left Column */}
        <div>
          {/* Skills */}
          {Object.values(data.skills).some((s) => s.length > 0) && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-600 pb-1 mb-3">
                Skills
              </h3>
              {Object.entries(data.skills).map(
                ([category, skills]) =>
                  skills.length > 0 && (
                    <div key={category} className="mb-3">
                      <p className="text-xs font-bold text-gray-600 mb-1.5">{category.charAt(0).toUpperCase() + category.slice(1)}</p>
                      <div className="flex flex-wrap gap-1">
                        {skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          )}

          {/* Summary */}
          {data.summary && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-600 pb-1 mb-3">
                Summary
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">{data.summary}</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Experience */}
          {data.experience.some((e) => e.jobTitle || e.company) && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-600 pb-1 mb-3">
                Experience
              </h3>
              {data.experience.map((exp, idx) => (
                (exp.jobTitle || exp.company) && (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{exp.jobTitle}</h4>
                        <p className="text-xs font-medium text-indigo-600">{exp.company}</p>
                      </div>
                      {exp.startDate && (
                        <p className="text-xs text-gray-500">{exp.startDate}</p>
                      )}
                    </div>
                    {exp.location && <p className="text-xs text-gray-500 mt-0.5">{exp.location}</p>}
                    {exp.bullets.some((b) => b.trim()) && (
                      <ul className="text-xs text-gray-700 mt-2 ml-4 space-y-1">
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
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-600 pb-1 mb-3">
                Education
              </h3>
              {data.education.map((edu, idx) => (
                (edu.institution || edu.degree) && (
                  <div key={idx} className="mb-3">
                    <h4 className="text-sm font-bold text-gray-900">{edu.institution}</h4>
                    <p className="text-xs text-gray-600">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                    {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
