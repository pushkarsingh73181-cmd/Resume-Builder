import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ResumeData, WorkExperience, Education, Skill, Project, ContactInfo } from "@shared/types";
import { nanoid } from "nanoid";

interface ResumeContextType {
  resume: ResumeData;
  updateContactInfo: (info: Partial<ContactInfo>) => void;
  updateSummary: (summary: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<WorkExperience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  updateTemplate: (template: ResumeData["template"]) => void;
  updateTitle: (title: string) => void;
  loadResume: (data: ResumeData) => void;
  resetResume: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const defaultResume: ResumeData = {
  title: "My Resume",
  template: "modern",
  contactInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resume, setResume] = useState<ResumeData>(defaultResume);

  const updateContactInfo = useCallback((info: Partial<ContactInfo>) => {
    setResume((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, ...info },
    }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setResume((prev) => ({ ...prev, summary }));
  }, []);

  const addExperience = useCallback(() => {
    const newExperience: WorkExperience = {
      id: nanoid(),
      company: "",
      position: "",
      startDate: "",
      endDate: null,
      isCurrent: false,
      description: "",
      bulletPoints: [],
    };
    setResume((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  }, []);

  const updateExperience = useCallback((id: string, data: Partial<WorkExperience>) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, ...data } : exp)),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  }, []);

  const addEducation = useCallback(() => {
    const newEducation: Education = {
      id: nanoid(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: null,
      gpa: "",
      details: "",
    };
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  }, []);

  const updateEducation = useCallback((id: string, data: Partial<Education>) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, ...data } : edu)),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  }, []);

  const addSkill = useCallback(() => {
    const newSkill: Skill = {
      id: nanoid(),
      name: "",
      level: "intermediate",
      category: "",
    };
    setResume((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  }, []);

  const updateSkill = useCallback((id: string, data: Partial<Skill>) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) => (skill.id === id ? { ...skill, ...data } : skill)),
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  }, []);

  const addProject = useCallback(() => {
    const newProject: Project = {
      id: nanoid(),
      title: "",
      description: "",
      technologies: [],
      link: "",
      date: "",
    };
    setResume((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), newProject],
    }));
  }, []);

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    setResume((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((proj) => (proj.id === id ? { ...proj, ...data } : proj)),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setResume((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((proj) => proj.id !== id),
    }));
  }, []);

  const updateTemplate = useCallback((template: ResumeData["template"]) => {
    setResume((prev) => ({ ...prev, template }));
  }, []);

  const updateTitle = useCallback((title: string) => {
    setResume((prev) => ({ ...prev, title }));
  }, []);

  const loadResume = useCallback((data: ResumeData) => {
    setResume(data);
  }, []);

  const resetResume = useCallback(() => {
    setResume(defaultResume);
  }, []);

  const value: ResumeContextType = {
    resume,
    updateContactInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
    updateTemplate,
    updateTitle,
    loadResume,
    resetResume,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within ResumeProvider");
  }
  return context;
}
