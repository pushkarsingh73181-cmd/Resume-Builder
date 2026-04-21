import { ResumeData } from "@shared/types";
import { format } from "date-fns";

interface ResumePreviewProps {
  resume: ResumeData;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white text-gray-900 p-8 min-h-screen font-serif" id="resume-preview">
      {/* Header */}
      <div className="mb-6 border-b-2 border-gray-300 pb-4">
        <h1 className="text-4xl font-bold mb-2">{resume.contactInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {resume.contactInfo.email && (
            <span>{resume.contactInfo.email}</span>
          )}
          {resume.contactInfo.phone && (
            <span>{resume.contactInfo.phone}</span>
          )}
          {resume.contactInfo.location && (
            <span>{resume.contactInfo.location}</span>
          )}
          {resume.contactInfo.website && (
            <span>{resume.contactInfo.website}</span>
          )}
          {resume.contactInfo.linkedin && (
            <span>{resume.contactInfo.linkedin}</span>
          )}
          {resume.contactInfo.github && (
            <span>{resume.contactInfo.github}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 uppercase tracking-wide">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Experience</h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-sm">{exp.position}</h3>
                <span className="text-xs text-gray-600">
                  {formatDate(exp.startDate)}
                  {exp.endDate ? ` - ${formatDate(exp.endDate)}` : exp.isCurrent ? " - Present" : ""}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{exp.company}</p>
              {exp.description && (
                <p className="text-xs text-gray-600 mb-2">{exp.description}</p>
              )}
              {exp.bulletPoints.length > 0 && (
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                  {exp.bulletPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Education</h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-sm">{edu.degree} in {edu.field}</h3>
                <span className="text-xs text-gray-600">
                  {formatDate(edu.startDate)}
                  {edu.endDate ? ` - ${formatDate(edu.endDate)}` : ""}
                </span>
              </div>
              <p className="text-sm text-gray-700">{edu.school}</p>
              {edu.gpa && (
                <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
              )}
              {edu.details && (
                <p className="text-xs text-gray-600 mt-1">{edu.details}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs"
              >
                {skill.name}
                {skill.level && <span className="ml-1 text-gray-600">({skill.level})</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Projects</h2>
          {resume.projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-sm">{proj.title}</h3>
                {proj.date && (
                  <span className="text-xs text-gray-600">{proj.date}</span>
                )}
              </div>
              <p className="text-xs text-gray-700 mb-1">{proj.description}</p>
              {proj.technologies.length > 0 && (
                <p className="text-xs text-gray-600">
                  <strong>Technologies:</strong> {proj.technologies.join(", ")}
                </p>
              )}
              {proj.link && (
                <p className="text-xs text-blue-600">
                  <a href={proj.link} target="_blank" rel="noopener noreferrer">
                    {proj.link}
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Certifications</h2>
          {resume.certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm">{cert.name}</h3>
                <span className="text-xs text-gray-600">{cert.date}</span>
              </div>
              <p className="text-sm text-gray-700">{cert.issuer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
