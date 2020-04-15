import { UserController } from "./controllers/user.controller";
import * as express from "express";
import { UserPaths } from "./user.paths";

class AuthRoutes {
  router: express.Router;
  userController: UserController;

  constructor() {
    this.router = express.Router();
    this.userController = new UserController();
    this.init();
  }

  init() {
    this.router.route(UserPaths.info).get(this.userController.info);
  }
}

export default new AuthRoutes().router;
