const Transfer = require("../models/transfer");

const config = {
  MODEL: Transfer,
  POPULATE_PATHS: [
    { path: "from_team", collection: "teams" },
    { path: "to_team", collection: "teams" },
    { path: "player", collection: "players" },
  ],
  format_fun: () => {},
  getAll: {
    query: [
      { field: "player", type: "ObjectId" },
      { field: "from_team", type: "ObjectId" },
      { field: "to_team", type: "ObjectId" },
    ],
    sort: { doa: -1, _id: -1 },
    buildCustomMatch: (req) => {
      const matchStage = {};
      if (req.query.team) {
        matchStage.$or = [
          { from_team: new mongoose.Types.ObjectId(req.query.team) },
          { to_team: new mongoose.Types.ObjectId(req.query.team) },
        ];
      }
      if (req.query.form) {
        const isNegated = req.query.form.startsWith("!");
        const values = (
          isNegated ? req.query.form.slice(1) : req.query.form
        ).split(",");
        matchStage.form = isNegated ? { $nin: values } : { $in: values };
      }
      if (req.query.from_date_gte)
        matchStage.from_date = { $gte: new Date(req.query.from_date_gte) };
      if (req.query.to_date_before)
        matchStage.to_date = { $lte: new Date(req.query.to_date_before) };
      return matchStage;
    },
  },
};

module.exports = { config };
