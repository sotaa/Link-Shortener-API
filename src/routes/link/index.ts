import { LinkPaths } from "./link.paths";
import express from "express";
import LinksController from "./controllers/links.controller";

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
    //create new link.
    this.router.route(LinkPaths.root).post(this.controller.create);
  }
}

export default new LinkRouter().router;
