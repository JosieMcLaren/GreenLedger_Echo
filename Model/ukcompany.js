const mongoose = require("mongoose");

const ukDataItemSchema = new mongoose.Schema({
  from: {
    type: Number,
    required: true,
  },
  to: {
    type: Number,
    required: true,
  },

  foodHandled: {
    type: Number,
    default: 0,
  },
  unsoldFood: {
    type: Number,
    default: 0,
  },
  foodSurplus: {
    type: Number,
    default: 0,
  },
  foodWaste: {
    type: Number,
    default: 0,
  },
  foodWastePerHandled: {
    type: Number,
    default: 0,
  },
  unsoldFoodPerHandled: {
    type: Number,
    default: 0,
  },
  foodWasteToAnimalFeed: {
    type: Number,
    default: 0,
  },
  humanRedistribution: {
    type: Number,
    default: 0,
  },
  foodWasteReductionRate: {
    type: Number,
    default: 0,
  },
});

const ukCompanySchema = new mongoose.Schema({
  sector: {
    type: String,
    default: "",
  },
  company: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  data: {
    type: [ukDataItemSchema],
    default: [],
  },
});

module.exports =
  mongoose.models.UkCompany || mongoose.model("UkCompany", ukCompanySchema);
