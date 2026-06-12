const mongoose = require("mongoose");
const ukCharitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companies: [String],
    Url: {
      type: String,
    },
  },
  {
    collection: "ukcharity",
  },
);
module.exports =
  mongoose.models.ukCharity || mongoose.model("ukCharity", ukCharitySchema);
