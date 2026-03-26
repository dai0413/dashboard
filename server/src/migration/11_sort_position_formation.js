import { position, position_formation } from "@dai0413/myorg-shared";

const positions = position();
const positionIndexMap = Object.fromEntries(
  positions.map((pos, index) => [pos.key, index]),
);
const DEFAULT_INDEX = Number.MAX_SAFE_INTEGER;

export const sortPositions = (positions, { desc = true } = {}) => {
  return positions
    .filter((p) => typeof p === "string")
    .sort((a, b) => {
      const diff =
        (positionIndexMap[a] ?? DEFAULT_INDEX) -
        (positionIndexMap[b] ?? DEFAULT_INDEX);
      return desc ? -diff : diff;
    });
};

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import "../../dist/models/formation.js";

const mongoUri = process.env.MONGODB_URI;

const updateField = async () => {
  await mongoose.connect(mongoUri);
  const FormationModel = mongoose.model("Formation");

  const formations = await FormationModel.find();

  const bulkOps = formations.map((formation) => {
    const sorted = sortPositions(formation.position_formation);

    console.log("before:", formation.position_formation);
    console.log("after :", sorted);

    return {
      updateOne: {
        filter: { _id: formation._id },
        update: {
          $set: {
            position_formation: sorted,
          },
        },
      },
    };
  });

  if (bulkOps.length) {
    console.log("FormationModel update!!");

    await FormationModel.bulkWrite(bulkOps);
  }

  console.log("FormationModel migration completed!");

  await mongoose.disconnect();
  process.exit(0);
};

updateField();
