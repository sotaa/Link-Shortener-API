import * as express from "express";
import {ShortenController} from "./controllers/shorten.controller";
import { ShortenPaths } from "./shorten.paths";

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
    //load a link by shorten code.
    this.router.route(ShortenPaths.code).get(this.controller.load);
    // load analytics information about a link by shorten code.
    this.router.route(ShortenPaths.info).get(this.controller.info);
    // check the shorten value is exists.
    this.router.route(ShortenPaths.info).head(this.controller.isExists);
  }
}

export default new ShortenRouter().router;
