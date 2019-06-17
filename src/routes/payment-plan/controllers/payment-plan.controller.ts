import { Request, Response } from "express";
import * as _ from "lodash";
import { PaymentPlan } from "../../../models/entities/payment-plan.schema";

export class PaymentPlanController {
  // create new plan.
  create(req: Request, res: Response) {
    // get data from request body.
    const data = _.pick(req.body, [
      "name",
      "price",
      "dateRange",
      "isActive",
      "description"
    ]);
    const paymentPlan = new PaymentPlan(data);

    paymentPlan
      .save()
      .then(result => {
        res.send(result);
      })
      .catch((err: any) => {
        res.status(400).send(err);
      });
  }

  getActivePlans(req: Request, res: Response) {
    PaymentPlan.find({ isActive: true })
      .select({ _id: 1, name: 1, price: 1, description: 1 })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }
}
