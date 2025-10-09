import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    en_name: {
      type: String,
    },
    dob: {
      type: Date,
    },
    pob: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Player = mongoose.model("Player", PlayerSchema);

// import mongoose from "mongoose";
// import { zodToJsonSchema } from "zod-to-json-schema";
// import { PlayerSchema } from "../../shared/schemas/player.schema";
// import { fromJsonSchema } from "mongoose-schema-jsonschema";

// // 1️⃣ Zod → JSON Schema に変換
// const jsonSchema = zodToJsonSchema(PlayerSchema);

// // 2️⃣ JSON Schema → Mongoose Schema に変換
// const mongooseSchemaDefinition = fromJsonSchema(jsonSchema);

// // 3️⃣ Mongoose Schema を作成
// const playerMongooseSchema = new mongoose.Schema(mongooseSchemaDefinition);

// // 4️⃣ モデルを作成してエクスポート
// export const PlayerModel = mongoose.model("Player", playerMongooseSchema);
