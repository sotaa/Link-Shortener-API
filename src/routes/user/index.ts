import { UserController } from './controllers/user.controller';
import * as express from "express";
import { AuthController } from "./controllers/auth.controller";
import { UserPaths } from "./user.paths";

class AuthRoutes {
  router: express.Router;
  controller: AuthController;
  userController: UserController;

  constructor() {
    this.router = express.Router();
    this.controller = new AuthController();
    this.userController = new UserController();
    this.init();
  }

  init() {
    // set register path controller.
    this.router.route(UserPaths.register).post(this.controller.register);
    // set login path controller.
    this.router.route(UserPaths.login).post(this.controller.login);
    // set info path controller.
    this.router.route(UserPaths.info).get(this.userController.info);
  }
}

export default new AuthRoutes().router;
