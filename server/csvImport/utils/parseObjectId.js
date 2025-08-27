const parseObjectId = (val) => {
  return val ? new mongoose.Types.ObjectId(val) : null;
};

module.exports = { parseObjectId };
