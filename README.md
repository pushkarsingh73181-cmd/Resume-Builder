# CareerForge Pro 🚀

> AI-powered ATS-Proof Resume Generator & Job Matcher for modern job seekers.

CareerForge Pro helps users optimize resumes for Applicant Tracking Systems (ATS), improve keyword alignment with target job descriptions, and generate professional-grade PDFs using AI.

---

## ✨ Features

### 📄 AI Resume Optimization

* Upload an existing resume
* Paste a target Job Description (JD)
* AI rewrites bullet points for:

  * Better ATS compatibility
  * Stronger wording
  * Improved keyword alignment
* Automatically injects high-priority JD keywords naturally into experience sections

---

### 🧠 JD Analysis Agent

The AI parses and analyzes job descriptions to:

* Extract technical skills
* Detect leadership & soft-skill keywords
* Rank important technologies & frameworks
* Identify industry-specific language
* Perform semantic keyword matching

---

### 📊 ATS Score Engine

* Calculates ATS score before optimization
* Recalculates ATS score after AI rewriting
* Displays keyword coverage improvements in real time

#### Example

```text
Before Optimization: 52%
After Optimization: 88%
```

---

### 🎨 Live Resume Builder

* Split-screen editing interface
* Real-time resume preview
* Instant updates with debounced state management

#### Editable Sections

* Contact Information
* Professional Summary
* Work Experience
* Education
* Skills

---

### 📑 Professional PDF Export

Powered by Puppeteer + Headless Chrome.

Features:

* Pixel-perfect PDF generation
* Professional layouts
* Print-ready formatting
* Proper page boundaries
* Non-editable export

---

### 💳 Subscription System

#### Free Tier

* 1 Resume Generation

#### Pro Tier

* Unlimited resumes
* Premium templates
* Cover Letter Generator
* Advanced ATS optimization

Stripe integration includes:

* Stripe Checkout
* Secure webhooks
* Automatic subscription upgrades
* Idempotent payment handling

---

### 🧾 Cover Letter Generator

Generate personalized, ATS-optimized cover letters tailored to the target job description.

---

### 📂 User Dashboard

Users can:

* Save resumes
* Edit previous resumes
* Re-export PDFs
* Track subscription status

---

# 🏗️ Tech Stack

| Category         | Technology                  |
| ---------------- | --------------------------- |
| Frontend         | React.js, Tailwind CSS      |
| State Management | Redux / Context API         |
| Backend          | Node.js, Express.js         |
| Database         | PostgreSQL / MongoDB        |
| AI               | Anthropic Claude API        |
| Payments         | Stripe Checkout + Webhooks  |
| PDF Generation   | Puppeteer + Headless Chrome |
| Authentication   | JWT / NextAuth              |

---


# 🧠 AI Rewrite Workflow

```text
Upload Resume
      ↓
Paste Job Description
      ↓
JD Analysis Agent Extracts Keywords
      ↓
ATS Score Calculation
      ↓
AI Resume Optimization
      ↓
Updated ATS Score
      ↓
Export Professional PDF
```

---

# 🛠️ Development Roadmap

## ✅ Week 1 — Resume Builder Core

* Resume schema
* State management
* Split-screen live preview
* Real-time updates

## 🚧 Week 2 — AI & ATS Engine

* JD keyword extraction
* ATS scoring
* AI rewrite system

## 🚧 Week 3 — Payments & PDF Export

* Stripe integration
* Puppeteer PDF generation
* Premium templates

## 🚧 Week 4 — Final Polish

* Cover Letter Generator
* User Dashboard
* PDF formatting optimization

---

# 🔒 Security & Best Practices

* Environment variables for secrets
* Stripe webhook verification
* Graceful AI error handling
* Debounced updates (300ms)
* Modular architecture
* Separate Puppeteer microservice

---


---

# 👨‍💻 Author

**Pushkar Singh**

GitHub: [https://github.com/singhpushkar03792](https://github.com/singhpushkar03792)

---

# ⭐ Support

If you found this project useful:

* Star the repository ⭐
* Share it with others 🚀
* Contribute improvements 💡

---

# 📌 Highlights

✅ ATS-Proof Resume Optimization
✅ AI-Powered JD Matching
✅ Stripe Subscription System
✅ Professional PDF Export
✅ Real-Time Resume Preview
✅ Cover Letter Generator
✅ Production-Ready SaaS Architecture

---


