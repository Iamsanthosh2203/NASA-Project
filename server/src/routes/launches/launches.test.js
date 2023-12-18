const req = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("launch API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("It should respond with 200 Success", async () => {
      const response = await req(app).get("/launches");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Test POST /launch", () => {
    test("It should catch missing required properties", async () => {
      const response = await req(app)
        .post("/launches")
        .send({
          mission: "USS Enterprise",
          rocket: "NCC 1701-D",
          target: "Kepler-62 f",
          launchDate: "January 4, 2028",
        })
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body).toMatchObject({
        launchDate: expect.any(String),
        mission: expect.any(String),
        rocket: expect.any(String),
        target: expect.any(String),
      });
    });

    test("It should catch invalid dates", async () => {
      const res = await req(app)
        .post("/launches")
        .send({
          launchDate: expect.any(String),
          mission: expect.any(String),
          rocket: expect.any(String),
          target: expect.any(String),
        })
        .expect(400)
        .expect("Content-Type", /json/);

      expect(res.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
