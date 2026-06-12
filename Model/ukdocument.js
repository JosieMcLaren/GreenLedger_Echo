const mongoose = require("mongoose");

const ukdocumentSchema = new mongoose.Schema(
  {
    from: {
      type: Number,
      required: true,
    },
    to: {
      type: Number,
      required: true,
    },
    annualReport: {
      type: Number,
      default: 0,
    },
    sustainability: {
      type: Number,
      default: 0,
    },
    ESG: {
      type: Number,
      default: 0,
    },
    other: {
      type: Number,
      default: 0,
    },
  },

  {
    collation: "ukdocuments",
  },
);

module.exports =
  mongoose.models.ukdocument || mongoose.model("ukdocument", ukdocumentSchema);
