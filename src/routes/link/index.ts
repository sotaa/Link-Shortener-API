import { LinkPaths } from "./link.paths";
import express from "express";
import LinksController from "./controllers/links.controller";
import { CategoryController } from "./controllers/category.controller";


class LinkRouter {
  private controller: LinksController;
  private categoryController: CategoryController;

  router: express.Router;

  constructor() {
    this.controller = new LinksController();
    this.categoryController = new CategoryController();
    this.router = express.Router();
    this.init();
  }

  // initial the routes link managements.
  private init() {
    this.router.route(LinkPaths.root).post(this.controller.create);
    this.router.route(LinkPaths.root).get(this.controller.getUserLinks);
    // init category actions.
    this.router.route(LinkPaths.category).post(this.categoryController.create);
    this.router.route(LinkPaths.category).get(this.categoryController.get);
  }
}

export default new LinkRouter().router;
