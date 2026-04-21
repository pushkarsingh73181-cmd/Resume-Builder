import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Zap, BarChart3, Download, Share2, Sparkles } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CareerForge Pro</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Create ATS-Optimized Resumes
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Tailor your resume to any job description and pass ATS screening with AI-powered optimization
            </p>
            <Button
              onClick={() => navigate("/editor")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Creating Resume
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="w-8 h-8 text-yellow-500 mb-2" />
                <CardTitle>AI-Powered Rewriting</CardTitle>
                <CardDescription>
                  Automatically optimize your resume content to match job descriptions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-green-500 mb-2" />
                <CardTitle>ATS Scoring</CardTitle>
                <CardDescription>
                  Get real-time ATS compatibility scores and actionable feedback
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Download className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle>Professional PDFs</CardTitle>
                <CardDescription>
                  Generate pixel-perfect PDFs optimized for both humans and machines
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Build Resume</h4>
                <p className="text-sm text-gray-600">
                  Enter your information with our intuitive form builder
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Paste Job Description</h4>
                <p className="text-sm text-gray-600">
                  Share the job posting you're targeting
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-blue-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Optimization</h4>
                <p className="text-sm text-gray-600">
                  Let AI rewrite your resume to match the job
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-blue-600">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Download & Apply</h4>
                <p className="text-sm text-gray-600">
                  Get your optimized PDF and apply with confidence
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Simple Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free Tier */}
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Get started for free</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-gray-900">$0</div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                      1 resume
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                      ATS scoring
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
                      AI rewriting
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
                      Cover letter generator
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Pro Tier */}
              <Card className="border-2 border-blue-600 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                </div>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>Unlimited access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-gray-900">
                    $9<span className="text-lg text-gray-600">/mo</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                      Unlimited resumes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                      ATS scoring
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                      AI rewriting
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                      Cover letter generator
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                      Premium templates
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Not authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">CareerForge Pro</h1>
          </div>
          <Button asChild>
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Create ATS-Optimized Resumes in Minutes
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tailor your resume to any job description using AI-powered optimization. Pass ATS screening and land more interviews.
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
          >
            <a href={getLoginUrl()}>
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Free
            </a>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="w-8 h-8 text-yellow-500 mb-2" />
              <CardTitle>AI-Powered Rewriting</CardTitle>
              <CardDescription>
                Automatically optimize your resume content to match job descriptions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle>ATS Scoring</CardTitle>
              <CardDescription>
                Get real-time ATS compatibility scores and actionable feedback
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Download className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle>Professional PDFs</CardTitle>
              <CardDescription>
                Generate pixel-perfect PDFs optimized for both humans and machines
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to land your dream job?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of job seekers who are using CareerForge Pro to optimize their resumes
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
          >
            <a href={getLoginUrl()}>
              Start Free Today
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
}
