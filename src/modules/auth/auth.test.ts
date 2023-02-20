import httpStatus from "http-status";
import request, { Response } from "supertest";
import { describe, expect, test } from "@jest/globals";
import { app } from "../../app";
import { IUser } from "../user/user.interfaces";
import { registerUser } from "../user/user.service";
import User from "../user/user.model";
import setupTestDatabase from "../../tests/setupTestDatabase";

setupTestDatabase();

describe("auth", () => {
  describe("POST /api/v1/auth/register", () => {
    const endpointUrl: string = "/api/v1/auth/register";
    const newUser: IUser = {
      name: "Leo",
      email: "leo@gmail.com",
      password: "password123456789!A",
      passwordConfirmation: "password123456789!A",
    };

    test("returns status 201 if request data is ok", async () => {
      const response: Response = await request(app)
        .post(endpointUrl)
        .send(newUser)
        .expect(httpStatus.CREATED);

      expect(response.body).toHaveProperty("token");
    });

    test("creates user if request data is ok", async () => {
      await request(app)
        .post(endpointUrl)
        .send(newUser)
        .expect(httpStatus.CREATED);

      const userFromDb: IUser = await User.findOne({
        email: newUser.email,
      });
      expect(userFromDb).toBeDefined();
      expect(userFromDb).toMatchObject({
        name: newUser.name,
        email: newUser.email,
      });
    });

    test("returns 400 error if name is empty", async () => {
      const userInvalidName = { ...newUser, name: "" };

      await request(app)
        .post(endpointUrl)
        .send(userInvalidName)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("returns error 409 if email is already used", async () => {
      await request(app)
        .post(endpointUrl)
        .send(newUser)
        .expect(httpStatus.CREATED);

      const response: Response = await request(app)
        .post(endpointUrl)
        .send(newUser)
        .expect(httpStatus.CONFLICT);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toMatchObject({
        message: "Email already taken",
      });
    });

    test("returns error 400 if password does not contain all required items", async () => {
      const userInvalidPassword = { ...newUser, password: "123456789012345" };

      const response: Response = await request(app)
        .post(endpointUrl)
        .send(userInvalidPassword)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toMatchObject({
        message:
          "password must contain at least 1 uppercase letter, 1 number, and 1 special character",
      });
    });

    test("returns error 400 if password is too short", async () => {
      const userInvalidPassword = {
        ...newUser,
        password: "1234",
      };

      const response: Response = await request(app)
        .post(endpointUrl)
        .send(userInvalidPassword)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toMatchObject({
        message: "password must be at least 12 characters long",
      });
    });

    test("returns error 400 if passwordConfirmation does not match password", async () => {
      const userInvalidPasswordConfirmation = {
        ...newUser,
        passwordConfirmation: newUser.passwordConfirmation + "xpto",
      };

      const response: Response = await request(app)
        .post(endpointUrl)
        .send(userInvalidPasswordConfirmation)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toMatchObject({
        message: "passwordConfirmation must match password",
      });
    });

    describe("POST /api//v1/auth/login", () => {
      const endpointUrl: string = "/api/v1/auth/login";
      const newUser: IUser = {
        name: "Leo",
        email: "leo@gmail.com",
        password: "password123456789!A",
        passwordConfirmation: "password123456789!A",
      };

      beforeEach(async () => {
        await registerUser({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        });
      });

      test("returns 200 if email and password match", async () => {
        const loginCredentials = {
          email: newUser.email,
          password: newUser.password,
        };

        const response: Response = await request(app)
          .post(endpointUrl)
          .send(loginCredentials)
          .expect(httpStatus.OK);

        expect(response.body).toHaveProperty("token");
      });

      test("returns error 401 if there is no user with the email", async () => {
        const loginCredentials = {
          email: "abc@abc.com",
          password: newUser.password,
        };

        const response: Response = await request(app)
          .post(endpointUrl)
          .send(loginCredentials)
          .expect(httpStatus.UNAUTHORIZED);

        expect(response.body).toEqual({
          message: "Incorrect email or password",
        });
      });

      test("returns error 401 if password does not match the provided email", async () => {
        const loginCredentials = {
          email: newUser.email,
          password: "wrong",
        };

        const response: Response = await request(app)
          .post(endpointUrl)
          .send(loginCredentials)
          .expect(httpStatus.UNAUTHORIZED);

        expect(response.body).toEqual({
          message: "Incorrect email or password",
        });
      });
    });
  });
});
