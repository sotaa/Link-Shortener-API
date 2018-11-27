import { LinkPaths } from "./link.paths";
import express from "express";
import LinksController from "./controllers/links.controller";
import TokenManager from "../../business-logic/token-manager";


class LinkRouter {
  private controller: LinksController;
  router: express.Router;

  constructor() {
    this.controller = new LinksController();
    this.router = express.Router();
    this.init();
  }

  // initial the routes link managements.
  private init() {
    // add jwt to route.
    // this.router.use(TokenManager.getVerifyMiddleware());
    //create new link.
    this.router.route(LinkPaths.root).post(this.controller.create);
  }
}

export default new LinkRouter().router;
