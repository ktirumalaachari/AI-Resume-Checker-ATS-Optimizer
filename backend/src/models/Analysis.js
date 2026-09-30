const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    explanation: {
      type: String,
      required: true,
    },

    fix: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const strengthSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    evidence: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const bulletRewriteSchema = new mongoose.Schema(
  {
    section: {
      type: String,
    },
    original: {
      type: String,
      required: true,
    },
    rewritten: {
      type: String,
      required: true,
    },
    rationale: {
      type: String,
    },
  },
  { _id: true },
);
const scoreBreakdownSchema = new mongoose.Schema(
  {
    formatting: {
      type: Number,
      min: 0,
      max: 25,
    },
    impact: {
      type: Number,
      min: 0,
      max: 25,
    },
    keywords: {
      type: Number,
      min: 0,
      max: 25,
    },
    clarity: {
      type: Number,
      min: 0,
      max: 25,
    },
  },
  { _id: false },
);
const keywordSchema = new mongoose.Schema(
  {
    matched: {
      type: [String],
      default: [],
    },
    missing: {
      type: [String],
      default: [],
    },
    recommended: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },
    versionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeVersion",
      required: true,
      index: true,
    },
    atsScore: { type: Number, min: 0, max: 100, required: true },
    scoreBreakdown: scoreBreakdownSchema,
    issues: { type: [issueSchema], default: [] },
    strengths: { type: [strengthSchema], default: [] },
    bulletRewrites: { type: [bulletRewriteSchema], default: [] },
    keywordsPresent: { type: [String], default: [] },
    keywordsMissing: { type: [String], default: [] },
    summary: { type: String, default: "" },
    model: { type: String, required: true },
    promptTokens: Number,
    responseTokens: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Analysis", analysisSchema);
