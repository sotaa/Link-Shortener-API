import express from "express";
import { AuthController } from "./controllers/auth.controller";
import { UserPaths } from "./user.paths";

class AuthRoutes {
  router: express.Router;
  controller: AuthController;

  constructor() {
    this.router = express.Router();
    this.controller = new AuthController();
    this.init();
  }

  init() {
    // set register path controller.
    this.router.route(UserPaths.register).post(this.controller.register);
    // set login path controller.
    this.router.route(UserPaths.login).post(this.controller.login);
  }
}

export default new AuthRoutes().router;
