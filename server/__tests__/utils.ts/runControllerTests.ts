import request from "supertest";
import app from "../../../server/app.ts";
import { validateParsedData } from "../utils.ts/validateParsedData.ts";
import { ControllerConfig } from "../../modelsConfig/types/type.ts";
import z from "zod";

const ROUTE_BASE = process.env.ROUTE_BASE;

export function runControllerTests<TDoc, TType extends object>(
  config: ControllerConfig<TDoc, TType>
) {
  const {
    name,
    SCHEMA: { FORM, RESPONSE },
    bulk,
    download,
    TEST: { sampleData, updatedData, testDataPath },
  } = config;

  const route: string = `${ROUTE_BASE}${name}`;

  describe(`${name.toUpperCase()} API`, () => {
    it(`POST ${route} should create a new ${name}`, async () => {
      const formData = FORM.parse(sampleData[0]);

      const res = await request(app).post(route).send(formData);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("data");
      expect(res.body.message).toBe("追加しました");

      const parsedData = RESPONSE.parse(res.body.data);
      validateParsedData(parsedData, sampleData[0]);
    });
    it(`GET ${route} should get all ${name}s`, async () => {
      const res = await request(app).get(route);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");

      const parsedDataArray = z.array(RESPONSE).parse(res.body.data);
      validateParsedData(parsedDataArray, sampleData);
    });
    it(`GET ${route}/:id should get a ${name}`, async () => {
      const created = await request(app).post(route).send(sampleData[0]);
      const id = created.body.data._id;

      const res = await request(app).get(`${route}/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");

      const parsedData = RESPONSE.parse(res.body.data);
      validateParsedData(parsedData, sampleData[0]);
    });
    it(`PUT ${route}/:id should update a ${name}`, async () => {
      const created = await request(app).post(route).send(sampleData[0]);
      const id = created.body.data._id;

      const res = await request(app).patch(`${route}/${id}`).send(updatedData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("data");
      expect(res.body.message).toBe("編集しました");

      const expected = { ...sampleData[0], ...updatedData };
      const parsedData = RESPONSE.parse(res.body.data);
      validateParsedData(parsedData, expected);
    });
    it(`DELETE ${route}/:id should delete a ${name}`, async () => {
      const created = await request(app).post(route).send(sampleData[0]);
      const id = created.body.data._id;

      const res = await request(app).delete(`${route}/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("削除しました");
    });

    testDataPath &&
      it(`POST ${route}/upload should create new ${name}s`, async () => {
        const res = await request(app)
          .post(`${route}/upload`)
          .attach("file", testDataPath);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(Array.isArray(res.body.data)).toBe(true);
      });

    download &&
      it(`GET ${route}/download should create new ${name}s`, async () => {
        await request(app).post(route).send(sampleData);

        const res = await request(app).get(`${route}/download`);
        expect(res.statusCode).toBe(200);
        expect(res.header["content-type"]).toMatch(/text\/csv/);
        expect(res.header["content-disposition"]).toContain(`${name}s.csv`);
        expect(res.text).toContain("test");
        expect(res.text.startsWith("\uFEFF")).toBe(true);
      });

    bulk &&
      it(`POST ${route} should create new ${name}s `, async () => {
        const res = await request(app).post(route).send(sampleData);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");
        expect(res.body.message).toBe("追加しました");

        const parsedDataArray = z.array(RESPONSE).parse(res.body.data);
        validateParsedData(parsedDataArray, sampleData);
      });
  });
}
