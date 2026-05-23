import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      default: 'Untitled Resume',
    },
    jobTitle: {
      type: String,
    },
    resumeData: {
      type: Object,
    },
    jobDescription: {
      type: String,
    },
    atsScoreBefore: {
      type: Number,
      default: 0,
    },
    atsScoreAfter: {
      type: Number,
      default: 0,
    },
    coverLetter: {
      type: String,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Resume', resumeSchema)
