const mongoose = require("mongoose");

const eualianceschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    companies: [String],
  },
  {
    collection: "eualiance",
  },
);
module.exports =
  mongoose.models.eualiance || mongoose.model("eualiance", eualianceschema);
