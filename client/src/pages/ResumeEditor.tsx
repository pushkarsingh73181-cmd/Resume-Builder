import { useResume } from "@/contexts/ResumeContext";
import { ResumeBuilder } from "@/components/ResumeBuilder";
import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Wand2, BarChart3 } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function ResumeEditor() {
  const { resume } = useResume();
  const { user } = useAuth();
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showJobDescriptionInput, setShowJobDescriptionInput] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  const calculateAtsScore = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first");
      return;
    }

    setIsAnalyzing(true);
    try {
      // TODO: Implement ATS scoring via API
      // For now, simulate a score
      const score = Math.floor(Math.random() * 40) + 50;
      setAtsScore(score);
      toast.success(`ATS Score: ${score}%`);
    } catch (error) {
      toast.error("Failed to calculate ATS score");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // TODO: Implement PDF generation via Puppeteer
      toast.info("PDF download feature coming soon");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  const handleMagicRewrite = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first");
      return;
    }

    try {
      // TODO: Implement AI rewrite via Claude API
      toast.info("AI rewrite feature coming soon");
    } catch (error) {
      toast.error("Failed to rewrite resume");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resume Editor</h1>
            <p className="text-sm text-gray-600">Create an ATS-optimized resume</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button
              onClick={handleMagicRewrite}
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Wand2 className="w-4 h-4" />
              Magic Rewrite
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left: Form Builder */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <ResumeBuilder />
            </div>
          </div>

          {/* Right: Preview & Analysis */}
          <div className="space-y-4 flex flex-col">
            {/* Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 sticky top-0 bg-gray-50">
                <h2 className="font-semibold text-gray-900">Live Preview</h2>
              </div>
              <div className="p-4 scale-50 origin-top-left w-[200%] h-[200%]">
                <ResumePreview resume={resume} />
              </div>
            </div>

            {/* Job Description & ATS Analysis */}
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    ATS Analysis
                  </h3>
                  {atsScore !== null && (
                    <div className="text-2xl font-bold text-green-600">{atsScore}%</div>
                  )}
                </div>

                {!showJobDescriptionInput ? (
                  <Button
                    onClick={() => setShowJobDescriptionInput(true)}
                    variant="outline"
                    className="w-full"
                  >
                    Paste Job Description
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here..."
                      className="w-full h-24 p-2 border border-gray-300 rounded text-sm resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={calculateAtsScore}
                        disabled={isAnalyzing}
                        className="flex-1"
                        size="sm"
                      >
                        {isAnalyzing ? "Analyzing..." : "Analyze"}
                      </Button>
                      <Button
                        onClick={() => setShowJobDescriptionInput(false)}
                        variant="outline"
                        size="sm"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
