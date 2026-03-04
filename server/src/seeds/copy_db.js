import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const SRC_URI = process.env.MONGODB_URI;
const DEST_URI = process.env.MONGODB_BACKUP_URI;

async function copyCollections() {
  const srcClient = new MongoClient(SRC_URI);
  const destClient = new MongoClient(DEST_URI);

  try {
    // --- Connect both ---
    await srcClient.connect();
    await destClient.connect();
    console.log("✅ 接続成功");

    // --- Get DB objects ---
    const srcDb = srcClient.db("dashboard");
    const destDb = destClient.db("backup");

    // --- List collections from source ---
    const collections = await srcDb.listCollections().toArray();

    for (const { name } of collections) {
      console.log(`📦 コピー中: ${name}`);

      const srcCollection = srcDb.collection(name);
      const destCollection = destDb.collection(name);

      // --- Drop existing dest collection if exists ---
      const exists = await destDb.listCollections({ name }).hasNext();
      if (exists) {
        await destCollection.drop();
        console.log(`🗑️ 既存コレクション削除: ${name}`);
      }

      // --- Copy data ---
      const docs = await srcCollection.find({}).toArray();
      if (docs.length > 0) {
        await destCollection.insertMany(docs);
        console.log(`✅ コピー完了 (${docs.length} 件): ${name}`);
      } else {
        console.log(`⚠️ 空のコレクション: ${name}`);
      }
    }

    console.log("🎉 すべてのコレクションをコピーしました！");
  } catch (err) {
    console.error("❌ Error copying collections:", err);
  } finally {
    await srcClient.close();
    await destClient.close();
  }
}

copyCollections().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
