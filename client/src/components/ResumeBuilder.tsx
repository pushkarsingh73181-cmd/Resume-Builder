import { useResume } from "@/contexts/ResumeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { useState, useCallback } from "react";

export function ResumeBuilder() {
  const {
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
    updateTemplate,
  } = useResume();

  const [activeTab, setActiveTab] = useState("contact");

  // Debounce handler for form inputs
  const debounceTimer = useCallback((callback: () => void, delay = 300) => {
    return setTimeout(callback, delay);
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 sticky top-0 bg-background z-10">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        {/* Contact Information */}
        <TabsContent value="contact" className="space-y-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  value={resume.contactInfo.fullName}
                  onChange={(e) => updateContactInfo({ fullName: e.target.value })}
                  placeholder="John Doe"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={resume.contactInfo.email}
                  onChange={(e) => updateContactInfo({ email: e.target.value })}
                  placeholder="john@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone *</label>
                <Input
                  value={resume.contactInfo.phone}
                  onChange={(e) => updateContactInfo({ phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location *</label>
                <Input
                  value={resume.contactInfo.location}
                  onChange={(e) => updateContactInfo({ location: e.target.value })}
                  placeholder="San Francisco, CA"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Website</label>
                <Input
                  value={resume.contactInfo.website || ""}
                  onChange={(e) => updateContactInfo({ website: e.target.value })}
                  placeholder="https://johndoe.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">LinkedIn</label>
                <Input
                  value={resume.contactInfo.linkedin || ""}
                  onChange={(e) => updateContactInfo({ linkedin: e.target.value })}
                  placeholder="linkedin.com/in/johndoe"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">GitHub</label>
                <Input
                  value={resume.contactInfo.github || ""}
                  onChange={(e) => updateContactInfo({ github: e.target.value })}
                  placeholder="github.com/johndoe"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Resume Template</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["modern", "classic", "minimal", "creative"].map((template) => (
                    <Button
                      key={template}
                      variant={resume.template === template ? "default" : "outline"}
                      onClick={() => updateTemplate(template as any)}
                      className="capitalize"
                    >
                      {template}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Summary */}
        <TabsContent value="summary" className="space-y-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resume.summary || ""}
                onChange={(e) => updateSummary(e.target.value)}
                placeholder="Write a brief professional summary about yourself..."
                className="min-h-32"
              />
              <p className="text-xs text-gray-500 mt-2">
                Keep it concise (2-3 sentences) and highlight your key strengths
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Experience */}
        <TabsContent value="experience" className="space-y-4 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Work Experience</h3>
            <Button onClick={addExperience} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Experience
            </Button>
          </div>

          {resume.experience.map((exp, idx) => (
            <Card key={exp.id}>
              <CardHeader className="flex flex-row justify-between items-start">
                <CardTitle className="text-base">Experience {idx + 1}</CardTitle>
                <Button
                  onClick={() => removeExperience(exp.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Company *</label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      placeholder="Company Name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Position *</label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      placeholder="Job Title"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={exp.endDate || ""}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value || null })}
                      disabled={exp.isCurrent}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.isCurrent}
                    onChange={(e) => updateExperience(exp.id, { isCurrent: e.target.checked, endDate: e.target.checked ? null : exp.endDate })}
                    className="mr-2"
                  />
                  <label htmlFor={`current-${exp.id}`} className="text-sm">
                    I currently work here
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    placeholder="Brief description of your role"
                    className="mt-1 min-h-20"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Education */}
        <TabsContent value="education" className="space-y-4 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Education</h3>
            <Button onClick={addEducation} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Education
            </Button>
          </div>

          {resume.education.map((edu, idx) => (
            <Card key={edu.id}>
              <CardHeader className="flex flex-row justify-between items-start">
                <CardTitle className="text-base">Education {idx + 1}</CardTitle>
                <Button
                  onClick={() => removeEducation(edu.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">School *</label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                    placeholder="University Name"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Degree *</label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      placeholder="Bachelor's, Master's, etc."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Field of Study *</label>
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                      placeholder="Computer Science"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={edu.endDate || ""}
                      onChange={(e) => updateEducation(edu.id, { endDate: e.target.value || null })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">GPA</label>
                  <Input
                    value={edu.gpa || ""}
                    onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                    placeholder="3.8"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills" className="space-y-4 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Skills</h3>
            <Button onClick={addSkill} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Skill
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {resume.skills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <Input
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                        placeholder="Skill name"
                        className="text-sm"
                      />
                    </div>
                    <Button
                      onClick={() => removeSkill(skill.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <select
                    value={skill.level || "intermediate"}
                    onChange={(e) => updateSkill(skill.id, { level: e.target.value as any })}
                    className="w-full text-sm border rounded px-2 py-1"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
