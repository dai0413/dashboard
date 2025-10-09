import request from "supertest";
import path from "path";
import { z } from "zod";
import { WithId } from "mongodb";
import app from "../../server/app.js";

const route: string = "/api/v1/player";
const sampleData = {
  name: "test_name",
  en_name: "test",
  dob: "2025/08/01",
};
const sampleDataArray = [
  {
    name: "test_name",
    en_name: "test",
  },
  {
    name: "test_name_2",
    en_name: "test_2",
    dob: "2025/08/01",
  },
  {
    name: "test_name_3",
    en_name: "test_3",
    dob: "2025/08/01",
    pob: "東京都",
  },
];
const updatedData = { name: "updated_name" };
const csvPath = path.resolve(__dirname, "../test_data/player.csv");

const Player = z.object({
  name: z.string().nonempty(),
  en_name: z.string().optional(),
  dob: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    )
    .optional(),
  pob: z.string().optional(),
  createdAt: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    )
    .optional(),
  updatedAt: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    )
    .optional(),
});

type Player = z.infer<typeof Player>;
type PlayerWithId = WithId<Player>;

describe("Player API", () => {
  it(`POST ${route} should create a new player`, async () => {
    const res = await request(app).post(route).send(sampleData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("data");
    expect(res.body.message).toBe("追加しました");

    const parsedData = Player.parse(res.body.data);
    expect(parsedData.name).toBe("test_name");
    expect(parsedData.en_name).toBe("test");
  });
  it(`POST ${route} should create new players`, async () => {
    const res = await request(app).post(route).send(sampleDataArray);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.message).toBe("追加しました");
  });
  it(`GET ${route} should get all players`, async () => {
    const res = await request(app).get(route);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });
  it(`GET ${route}/:id should get a player`, async () => {
    const created = await request(app).post(route).send(sampleData);
    const id = created.body.data._id;

    const res = await request(app).get(`${route}/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Object);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data).toHaveProperty("name");
  });
  it(`PUT ${route}/:id should update a player`, async () => {
    const created = await request(app).post(route).send(sampleData);
    const id = created.body.data._id;

    const res = await request(app).patch(`${route}/${id}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("data");
    expect(res.body.message).toBe("編集しました");
    expect(res.body.data).toBeInstanceOf(Object);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data).toHaveProperty("name");
    expect(res.body.data.name).toBe(updatedData.name);
  });
  it(`DELETE ${route}/:id should delete a player`, async () => {
    const created = await request(app).post(route).send(sampleData);
    const id = created.body.data._id;

    const res = await request(app).delete(`${route}/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("削除しました");
  });
  it(`POST ${route}/upload should create new players`, async () => {
    const res = await request(app)
      .post(`${route}/upload`)
      .attach("file", csvPath);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
  it(`GET ${route}/download should create new players`, async () => {
    await request(app).post(route).send(sampleDataArray);

    const res = await request(app).get(`${route}/download`);
    expect(res.statusCode).toBe(200);
    expect(res.header["content-type"]).toMatch(/text\/csv/);
    expect(res.header["content-disposition"]).toContain("players.csv");
    expect(res.text).toContain("test");
    expect(res.text.startsWith("\uFEFF")).toBe(true);
  });
});
