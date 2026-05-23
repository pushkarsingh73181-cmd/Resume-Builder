import React from 'react'
import { Link } from 'react-router-dom'

const features = [
  {
    title: 'AI Magic Write',
    description: 'Generate polished resume summaries, bullet points, and tailored content in seconds.',
  },
  {
    title: 'ATS Score Checker',
    description: 'See how your resume performs against applicant tracking systems and improve instantly.',
  },
  {
    title: 'PDF Export',
    description: 'Download a professional resume in PDF with one click and share it with confidence.',
  },
  {
    title: 'Real-time Preview',
    description: 'Edit your resume while previewing changes live on desktop and mobile layouts.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <section className="relative overflow-hidden pb-20">
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-br from-purple-600 via-[#7d62ff] to-[#6c47ff] opacity-30 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 mb-6">
                New launch • AI resume writing, ATS-ready templates, and instant PDF export
              </div>
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl">Build Your Dream Resume with AI</h1>
              <p className="mt-6 max-w-xl text-lg text-slate-300 leading-8">
                CareerForge Pro helps you create a polished, job-winning resume using AI, ATS optimization, and beautiful templates — all from your browser.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[#6c47ff] px-8 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:bg-[#5a3ce6]"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  See Pricing
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-white/10 bg-[#111428] p-8 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Resume Preview</p>
                    <h2 className="mt-2 text-xl font-semibold">Modern Resume Builder</h2>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">Live</div>
                </div>
                <div className="space-y-4">
                  <div className="h-3 rounded-full bg-white/10 w-5/6" />
                  <div className="h-3 rounded-full bg-white/10 w-4/6" />
                  <div className="h-3 rounded-full bg-white/10 w-3/4" />
                  <div className="rounded-3xl bg-[#6c47ff] p-5">
                    <div className="h-3 rounded-full bg-white/90 w-2/3 mb-3" />
                    <div className="space-y-2">
                      <div className="h-2 rounded-full bg-white/80 w-5/6" />
                      <div className="h-2 rounded-full bg-white/70 w-3/4" />
                      <div className="h-2 rounded-full bg-white/70 w-1/2" />
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-xs uppercase text-slate-400">ATS score</p>
                      <p className="mt-2 text-lg font-semibold">89</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-xs uppercase text-slate-400">Download</p>
                      <p className="mt-2 text-lg font-semibold">PDF ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-[#111428] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm uppercase tracking-[0.28em] text-[#9da6ff]">Features</p>
            <h2 className="mt-4 text-4xl font-bold">Everything you need to land your next role</h2>
            <p className="mt-4 text-slate-300">A modern resume workflow with smart AI, ATS analysis, and an easy export experience.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-purple-400/30 hover:bg-white/10">
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-slate-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-16 lg:grid-cols-[1fr_0.9fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#9da6ff]">How It Works</p>
              <h2 className="mt-4 text-4xl font-bold">Launch your resume in three simple steps</h2>
              <p className="mt-4 max-w-xl text-slate-300">
                CareerForge Pro makes it easy for anyone to build a job-ready resume with expert guidance and AI-powered content recommendations.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Create Account', detail: 'Sign up and choose your free resume workspace.' },
                { label: 'Fill Your Details', detail: 'Complete your experience, education, and skills in one place.' },
                { label: 'Download PDF', detail: 'Export a resume that looks great and works with ATS systems.' },
              ].map((step, index) => (
                <div key={step.label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Step {index + 1}</span>
                    <div className="h-10 w-10 rounded-full bg-purple-500 text-white grid place-items-center font-semibold">{index + 1}</div>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{step.label}</h3>
                  <p className="mt-3 text-slate-300">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm uppercase tracking-[0.28em] text-[#9da6ff]">Pricing</p>
            <h2 className="mt-4 text-4xl font-bold">Plans built for every job seeker</h2>
            <p className="mt-4 text-slate-300">Start for free or upgrade to unlock premium resume templates and advanced ATS tools.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <span className="text-sm uppercase tracking-[0.28em] text-[#9da6ff]">Free</span>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-slate-300">/ forever</span>
              </div>
              <p className="mt-6 text-slate-300">Access one resume, live preview, and essential AI suggestions.</p>
              <ul className="mt-8 space-y-3 text-slate-300">
                <li>✔ Basic resume editor</li>
                <li>✔ Live preview</li>
                <li>✔ One resume project</li>
                <li>❌ Premium templates</li>
              </ul>
              <Link
                to="/signup"
                className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Start free
              </Link>
            </div>
            <div className="rounded-[2rem] border border-purple-500 bg-[#201a4c] p-8">
              <span className="text-sm uppercase tracking-[0.28em] text-purple-200">Pro</span>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-bold">$14</span>
                <span className="text-slate-300">/ month</span>
              </div>
              <p className="mt-6 text-slate-300">Unlock premium templates, ATS score improvements, and unlimited resume exports.</p>
              <ul className="mt-8 space-y-3 text-slate-300">
                <li>✔ Unlimited resumes</li>
                <li>✔ Premium templates</li>
                <li>✔ ATS scoring</li>
                <li>✔ Export to PDF</li>
              </ul>
              <Link
                to="/pricing"
                className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-purple-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-400"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0b0e1f] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-bold text-white">CareerForge Pro</p>
            <p className="mt-2 text-sm text-slate-400">Resume builder for modern job seekers.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#about" className="hover:text-white">About</a>
            <Link to="/pricing" className="hover:text-white">Pricing</Link>
          </div>
          <p className="text-sm text-slate-500">© 2026 CareerForge Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
