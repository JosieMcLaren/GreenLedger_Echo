const mongoose = require("mongoose");

const eudocSchema = new mongoose.Schema(
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
    integratedReport: {
      type: Number,
      default: 0,
    },

    other: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "eudocuments",
  },
);
module.exports = mongoose.models.eudoc || mongoose.model("eudoc", eudocSchema);
