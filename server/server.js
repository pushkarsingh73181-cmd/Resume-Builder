import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import resumeRoutes from './routes/resume.js'
import jdRoutes from './routes/jd.js'
import pdfRoutes from './routes/pdf.js'
import subscriptionRoutes, { subscriptionWebhookHandler } from './routes/subscription.js'

const app = express()

// MongoDB Connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  })

// CORS
const allowlist = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
]
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowlist.includes(origin) || origin?.startsWith('http://localhost:')) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}
app.use(cors(corsOptions))

// Webhook needs raw body; mount it before express.json to capture raw payload
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), subscriptionWebhookHandler)

// Middleware
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/jd', jdRoutes)
app.use('/api/pdf', pdfRoutes)
app.use('/api/subscription', subscriptionRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
