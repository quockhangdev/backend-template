import mongoose from "mongoose";
import app from "./app";
import request from "supertest";

describe("GET /healthcheck", () => {
  beforeAll((done) => {
    mongoose.connection.on("connected", () => {
      done();
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
    mongoose.disconnect();
    app.closeServer();
  });

  it("should return 200 OK", async () => {
    const res = await request(app).get("/healthcheck");
    expect(res.status).toBe(200);
  });
});
