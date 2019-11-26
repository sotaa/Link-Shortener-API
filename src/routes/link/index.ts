import { LinkPaths } from "./link.paths";
import * as express from "express";
import { LinksController } from "./controllers/links.controller";
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
    this.router
      .route(LinkPaths.root)
      .post(this.controller.create.bind(this.controller));
    this.router
      .route(LinkPaths.singleLink)
      .put(this.controller.update.bind(this.controller));
    this.router.route(LinkPaths.root).get(this.controller.getUserLinks);
    this.router
      .route(LinkPaths.singleLink)
      .delete(this.controller.deleteUserLink);
    // init category actions.
    this.router
      .route(LinkPaths.category)
      .post(this.categoryController.create.bind(this.categoryController));
    this.router
      .route(LinkPaths.category)
      .get(this.categoryController.get.bind(this.categoryController));
    this.router.route(LinkPaths.singleLink).get(this.controller.getUserLink);
  }
}

export default new LinkRouter().router;
