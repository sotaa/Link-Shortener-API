import express from "express";
import ShortenController from "./controllers/shorten.controller";
import { ShortenPaths } from "./shorten-paths";

class ShortenRouter {
  private controller: ShortenController;
  router: express.Router;

  constructor() {
    this.controller = new ShortenController();
    this.router = express.Router();
    this.init();
  }

  // initial the routes link managements.
  private init() {
    //create new link.
    this.router.route(ShortenPaths.code).get(this.controller.load);
  }
}

export default new ShortenRouter().router;
