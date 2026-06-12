const mongoose = require("mongoose");

const ukAlliancesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companies: [String],
    Url: {
      type: String,
      required: false,
    },
  },
  {
    collection: "ukalliances",
  },
);
module.exports =
  mongoose.models.ukAlliances ||
  mongoose.model("ukAlliances", ukAlliancesSchema);
