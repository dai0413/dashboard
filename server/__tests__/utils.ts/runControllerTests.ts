import request from "supertest";
import app from "../../../server/app.ts";
import { validateParsedData } from "../utils.ts/validateParsedData.ts";
import {
  ControllerConfig,
  DependencyRefs,
} from "../../modelsConfig/types/type.ts";
import z from "zod";

import { team as teamConfig } from "../../../shared/models-config/team.ts";
import { player as playerConfig } from "../../../shared/models-config/player.ts";
import { country as countryConfig } from "../../../shared/models-config/country.ts";
import { nationalMatchSeries as nationalMatchSeriesConfig } from "../../../shared/models-config/national-match-series.ts";
import { competition as competitionConfig } from "../../../shared/models-config/competition.ts";
import { season as seasonConfig } from "../../../shared/models-config/season.ts";
import { competitionStage as competitionStageConfig } from "../../../shared/models-config/competition-stage.ts";

import mongoose from "mongoose";

const ROUTE_BASE = process.env.ROUTE_BASE;

export async function setupDependencies(): Promise<DependencyRefs> {
  let deps: Record<string, any> = {};

  const postAndGetData = async <
    TDoc extends object,
    TType extends object,
    TForm extends object,
    TRes extends { _id: string },
    TPop extends object
  >(
    config: ControllerConfig<TDoc, TType, TForm, TRes, TPop>
  ) => {
    const sample =
      typeof config.TEST.sampleData === "function"
        ? config.TEST.sampleData(deps as DependencyRefs)
        : config.TEST.sampleData;
    const res = await request(app)
      .post(`${ROUTE_BASE}${config.name}`)
      .send(sample[0]);

    if (res.statusCode !== 201 || !res.body?.data) {
      throw new Error(`Failed to create ${config.name}: ${res.text}`);
    }

    deps[config.name] = res.body.data;
    return res.body.data;
  };

  const team = await postAndGetData(teamConfig);
  const player = await postAndGetData(playerConfig);
  const country = await postAndGetData(countryConfig);
  const nationalMatchSeries = await postAndGetData(nationalMatchSeriesConfig);
  const competition = await postAndGetData(competitionConfig);
  const season = await postAndGetData(seasonConfig);
  const competitionStage = await postAndGetData(competitionStageConfig);

  return {
    team,
    player,
    country,
    nationalMatchSeries,
    competition,
    season,
    competitionStage,
  };
}

export function runControllerTests<
  TDoc extends object,
  TType extends object,
  TForm extends object,
  TRes extends { _id: string },
  TPop extends object
>(config: ControllerConfig<TDoc, TType, TForm, TRes, TPop>) {
  let deps: DependencyRefs;

  const {
    name,
    SCHEMA: { FORM, RESPONSE },
    bulk,
    download,
    POPULATE_PATHS,
    TEST: { sampleData, updatedData, testDataPath },
  } = config;

  const route: string = `${ROUTE_BASE}${name}`;
  const populateKeys = POPULATE_PATHS.map((path) => path.path);
  let created: TRes;
  let sample: TForm[];

  describe(`${name.toUpperCase()} API`, () => {
    beforeAll(async () => {
      // ✅ モデルごとに完全リセット
      if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
          await collection.deleteMany({});
        }
      }

      // ✅ 外部キー処理のためのデータ
      if (typeof sampleData === "function") {
        deps = await setupDependencies();
        if (!deps) {
          throw new Error("❌ setupDependencies() failed to initialize deps");
        }

        sample = sampleData(deps);
      } else {
        sample = sampleData as TForm[];
      }

      // これから追加のDBをリセット
      if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
        const target = config.name.split("-").join(""); // 対象の1コレクション名

        for (const collection of collections) {
          if (collection.collectionName.startsWith(target)) {
            // console.log(
            //   `🧹 Deleting documents in: ${collection.collectionName}`
            // );
            await collection.deleteMany({});
            break;
          }
        }
      }
    });

    it(`POST ${route} should create a new ${name}`, async () => {
      const formData = FORM.parse(sample[0]);

      const res = await request(app).post(route).send(formData);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("data");
      expect(res.body.message).toBe("追加しました");

      const parsedData = RESPONSE.parse(res.body.data);
      validateParsedData(parsedData, sample[0], populateKeys);

      created = parsedData;
    });
    it(`GET ${route} should get all ${name}s`, async () => {
      const res = await request(app).get(route);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");

      const parsedDataArray = z.array(RESPONSE).parse(res.body.data);

      validateParsedData(parsedDataArray, sample, populateKeys);
    });
    it(`GET ${route}/:id should get a ${name}`, async () => {
      const id = created._id;

      const res = await request(app).get(`${route}/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");

      const parsedData = RESPONSE.parse(res.body.data);
      validateParsedData(parsedData, sample[0], populateKeys);
    });
    it(`PUT ${route}/:id should update a ${name}`, async () => {
      const id = created._id;

      const res = await request(app).patch(`${route}/${id}`).send(updatedData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("data");
      expect(res.body.message).toBe("編集しました");

      const expected = { ...sample[0], ...updatedData } as TForm;
      const parsedData = RESPONSE.parse(res.body.data);
      validateParsedData(parsedData, expected, populateKeys);
    });
    it(`DELETE ${route}/:id should delete a ${name}`, async () => {
      const id = created._id;

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
      it(`GET ${route}/download should download ${name}s`, async () => {
        const formData = FORM.parse(sample[0]);

        await request(app).post(route).send(formData);

        const res = await request(app).get(`${route}/download`);
        expect(res.statusCode).toBe(200);
        expect(res.header["content-type"]).toMatch(/text\/csv/);
        expect(res.header["content-disposition"]).toContain(`${name}`);
        expect(res.text.startsWith("\uFEFF")).toBe(true);
      });

    bulk &&
      it(`POST ${route} should create new ${name}s `, async () => {
        const res = await request(app).post(route).send(sample);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");
        expect(res.body.message).toBe("追加しました");

        const parsedDataArray = z.array(RESPONSE).parse(res.body.data);
        validateParsedData(parsedDataArray, sample, populateKeys);
      });
  });
}
