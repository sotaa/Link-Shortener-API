import path from "path";
import { AppPaths } from "./app.paths";
import LinkRoutes from "./link";
import ShortenRoutes from "./shorten";
import AuthRoutes from "./user";
import PaymentPlanRoutes from "./payment-plan";
import { Request, Response } from "express";
import { Express as IExpress } from "express";
import PaymentRoutes from "./payment";
import tokenManager from "../business-logic/token-manager";
import { RequestHandler } from 'express-jwt';

class AppRoutes {
  private authMiddleware: RequestHandler;

  constructor() {
    this.authMiddleware = tokenManager.getVerifyMiddleware();
  }
  init(app: IExpress) {
    // link routes.
    app.use(AppPaths.link,this.authMiddleware, LinkRoutes);
    // shorten routes.
    app.use(AppPaths.shorten,this.authMiddleware, ShortenRoutes);
    // auth routes.
    app.use(AppPaths.auth, AuthRoutes);
    // payment plans.
    app.use(AppPaths.paymentPlans,this.authMiddleware, PaymentPlanRoutes);
    // payments like checkout and verify controllers.
    app.use(AppPaths.payment,this.authMiddleware, PaymentRoutes);


    // use front end to handle routes of unknown routes.
    app.get("/*", (req: Request, res: Response) => {
      res.sendFile(path.resolve("public/index.html"));
    });
  }
}

export default new AppRoutes();
