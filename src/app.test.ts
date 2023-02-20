import httpStatus from "http-status";
import request from "supertest";
import { describe, expect } from "@jest/globals";
import { app } from "./app";
import setupTestDatabase from "./tests/setupTestDatabase";

setupTestDatabase();

describe("app", () => {
  describe("GET /health", () => {
    it("responds with status 200", async () => {
      const response = await request(app).get("/health");
      expect(response.status).toBe(httpStatus.OK);
    });
  });

  describe("GET /invalid", () => {
    it("responds with status 404", async () => {
      const response = await request(app).get("/invalid");
      expect(response.status).toBe(httpStatus.NOT_FOUND);
      expect(response.body.message).toBe("Not found");
    });
  });
});
