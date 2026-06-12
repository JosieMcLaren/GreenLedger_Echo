const mongoose = require("mongoose");

const euCompanySchema = new mongoose.Schema({
  sector: { type: String, default: "" },
  companyName: { type: String, required: true },
  Commitment: [String],
  targetDate: [Number],
  TargetMetric: [String],
  Standardised: [String],
  fromBaseline: { type: Number, default: 0 },
  toBaseline: { type: Number, default: 0 },
});
module.exports =
  mongoose.models.eucompany || mongoose.model("eucompany", euCompanySchema);
