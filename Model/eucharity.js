const mongoose = require("mongoose");

const eucharitySchema = new mongoose.Schema(
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
    collection: "eucharity",
  },
);
module.exports =
  mongoose.models.eucharity || mongoose.model("eucharity", eucharitySchema);
