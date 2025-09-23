const { config } = require("../modelsConfig");

// populate 用
const getPopulateOptions = (POPULATE_PATHS) =>
  POPULATE_PATHS.map(({ path }) => ({ path }));

// aggregate 用
const getAggregateLookups = (POPULATE_PATHS) =>
  POPULATE_PATHS.flatMap(({ path, collection }) => [
    {
      $lookup: {
        from: collection,
        localField: path,
        foreignField: "_id",
        as: path,
      },
    },
    { $unwind: { path: `$${path}`, preserveNullAndEmptyArrays: true } },
  ]);

// populate か aggregate かを切り替え
const getNest = (usePopulate, POPULATE_PATHS) => {
  return usePopulate
    ? getPopulateOptions(POPULATE_PATHS)
    : getAggregateLookups(POPULATE_PATHS);
};

module.exports = { getNest };
