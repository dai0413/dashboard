const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Player = require("../models/player");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Player.deleteMany();
});

describe("Player Routes", () => {
  test("GET /players - should return empty array initially", async () => {
    const res = await request(app).get("/players");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("POST /players - should create a player", async () => {
    const res = await request(app)
      .post("/players")
      .send({ name: "John Doe", en_name: "John" });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("John Doe");
    expect(res.body.en_name).toBe("John");
  });

  test("GET /players/:id - should get a player by id", async () => {
    const player = await Player.create({ name: "Alice" });
    const res = await request(app).get(`/players/${player._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Alice");
  });

  test("PATCH /players/:id - should update a player", async () => {
    const player = await Player.create({ name: "Bob" });
    const res = await request(app)
      .patch(`/players/${player._id}`)
      .send({ pob: "Germany" });

    expect(res.statusCode).toBe(200);
    expect(res.body.pob).toBe("Germany");
  });

  test("DELETE /players/:id - should delete a player", async () => {
    const player = await Player.create({ name: "Charlie" });
    const res = await request(app).delete(`/players/${player._id}`);

    expect(res.statusCode).toBe(200);
    const found = await Player.findById(player._id);
    expect(found).toBeNull();
  });
});
