import React from 'react'
import { useSelector } from 'react-redux'
import ContactSection from './ContactSection'
import SummarySection from './SummarySection'
import ExperienceSection from './ExperienceSection'
import EducationSection from './EducationSection'
import SkillsSection from './SkillsSection'
import JobDescriptionSection from './JobDescriptionSection'

export default function ResumeForm() {
  const activeSection = useSelector((state) => state.resume.activeSection)

  const renderSection = () => {
    switch (activeSection) {
      case 'contact':
        return <ContactSection />
      case 'summary':
        return <SummarySection />
      case 'experience':
        return <ExperienceSection />
      case 'education':
        return <EducationSection />
      case 'skills':
        return <SkillsSection />
      case 'jobDescription':
        return <JobDescriptionSection />
      default:
        return <ContactSection />
    }
  }

  return <div className="px-6 py-6">{renderSection()}</div>
}
