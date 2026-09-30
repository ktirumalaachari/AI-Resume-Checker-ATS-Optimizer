const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const basicsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    links: {
      type: [linkSchema],
      default: [],
    },
  },
  { _id: false },
);

const experienceItemSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "",
    },

    period: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    bullets: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const educationItemSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      default: "",
    },

    school: {
      type: String,
      default: "",
    },

    period: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    details: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const projectItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    tech: {
      type: [String],
      default: [],
    },

    links: {
      type: [linkSchema],
      default: [],
    },

    bullets: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const certificationItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },

    issuer: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const extraSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    items: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const parsedSectionsSchema = new mongoose.Schema(
  {
    basics: {
      type: basicsSchema,
      default: () => ({}),
    },

    summary: {
      type: String,
      default: "",
    },

    experience: {
      type: [experienceItemSchema],
      default: [],
    },

    education: {
      type: [educationItemSchema],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    projects: {
      type: [projectItemSchema],
      default: [],
    },

    certifications: {
      type: [certificationItemSchema],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    interests: {
      type: [String],
      default: [],
    },

    extraSections: {
      type: [extraSectionSchema],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const resumeVersionSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },

    versionNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    label: {
      type: String,
      required: true,
    },

    rawText: {
      type: String,
      required: true,
    },

    parsedSections: {
      type: parsedSectionsSchema,
      default: () => ({}),
    },

    sourceType: {
      type: String,
      enum: ["upload", "rewrite"],
      required: true,
    },

    parentVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeVersion",
      default: null,
    },

    latestAnalysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analysis",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

resumeVersionSchema.index(
  {
    resumeId: 1,
    versionNumber: -1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("ResumeVersion", resumeVersionSchema);
