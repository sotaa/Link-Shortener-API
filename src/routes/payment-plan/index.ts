import { PaymentPlanPaths } from "./payment-plan.paths";
import * as express from "express";
import { PaymentPlanController } from "./controllers/payment-plan.controller";

class PaymentPlanRouter {
  router: express.Router;
  controller: PaymentPlanController;

  constructor() {
    this.router = express.Router();
    this.controller = new PaymentPlanController();
    this.init();
  }

  init() {
    // set create controller.
    // this.router.route(PaymentPlanPaths.default).post(this.controller.create);
    // get active payment plans.
    this.router
      .route(PaymentPlanPaths.active)
      .get(this.controller.getActivePlans);
  }
}

export default new PaymentPlanRouter().router;
