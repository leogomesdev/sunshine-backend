import express, { Router } from "express";
import { login, register } from "../../modules/auth/auth.controller";
import { validate } from "../../validate";
import * as authValidation from "../../modules/auth/auth.validation";

const authRoute: Router = express.Router();

authRoute.post("/register", validate(authValidation.register), register);

authRoute.post("/login", validate(authValidation.login), login);

export default authRoute;
