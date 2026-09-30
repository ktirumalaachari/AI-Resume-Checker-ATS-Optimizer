const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    currentVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeVersion",
      default: null,
    },

    latestVersionNumber: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

ResumeSchema.index({
  userId: 1,
  updatedAt: -1,
});

module.exports = mongoose.model("Resume", ResumeSchema);