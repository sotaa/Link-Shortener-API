import { User } from "../../../models/entities/user.schema";
import { IPaymentLog } from "../../../models/interfaces/payment-log.interface.log";
import { PaymentLog } from "../../../models/entities/payment-log.schema";
import { Request, Response } from "express";
import * as _ from "lodash";
import Messages from "../../../preferences/Messages";
import { IPaymentPlan } from "../../../models/interfaces/payment-plan.interface";
import { IUser } from "../../../models/interfaces/user.interface";
import { PaymentPlan } from "../../../models/entities/payment-plan.schema";
const persianDate = require("persian-date");

const zPal = require("zarinpal-checkout");

export class PaymentController {
  checkout(req: Request, res: Response) {
    // get user object from request.
    const user = <IUser>req.user;
    // validate user.
    if (!user) {
      res.status(403).send(Messages.userMessages.userIsNotAuthenticated);
      return;
    }
    // get selected plan from request.
    const plan = _.pick<IPaymentPlan>(req.body, ["name", "price", "_id"]);
    // check plan existing.
    if (!plan) {
      res.status(400).send(Messages.paymentMessages.planIsNotDefined);
      return;
    }
    // make description.
    const description = " بابت پلن " + plan.name + " به نام : " + user.name;

    // zarinpal payment
    const myZPal = zPal.create("563baf06-2025-11ea-992d-000c295eb8fc", false);
    myZPal
      .PaymentRequest({
        Amount: plan.price, // In Tomans
        CallbackURL: "http://links.marketals.com/payment/verify",
        Description: description,
        email: user.email
      })
      .then((response: any) => {
        // create a new payment log if authority is created by gateway.
        if (response.status === 100) {
          const paymentLog = new PaymentLog({
            userId: user._id,
            plan: plan,
            authority: response.authority,
            description
          });
          paymentLog.save().then(() => {
            // redirect to payment gateway.
            res.send({ url: response.url });
          });
        } else {
          return Promise.reject(response);
        }
      })
      .catch((err: any) => {
        console.log(err);
        res.status(500).send(err);
      });
  }

  // verify payment.
  verify(req: Request, res: Response) {
    const query = _.pick(req.query, ["Status", "Authority"]);
    // return if authority is not defined.
    if (!query.Authority) {
      res.status(400).send(Messages.paymentMessages.authorityIsNotDefined);
      return;
    }

    // load payment log to make success.
    PaymentLog.findOne({ authority: query.Authority })
      .then(async paymentLog => {
        paymentLog = <IPaymentLog>paymentLog;
        // load user.
        let user = <IUser>await User.findById(paymentLog.userId);
        // load plan.
        paymentLog.plan = <IPaymentPlan>(
          await PaymentPlan.findById(paymentLog.plan._id)
        );
        if (paymentLog.isSuccess === undefined) {
          if (query.Status === "OK") {
            try {
              // make user premium according to paid plan.
              let baseDate = new persianDate();
              if (user.expireDate) {
                const expireDate = new persianDate(user.expireDate);
                // if user is premium add the date range to expiration date.
                baseDate =
                  expireDate.diff(baseDate) > 0 ? expireDate : baseDate;
              }
              // extend the expiration date.
              user.expireDate = baseDate.add("days", paymentLog.plan.dateRange);
              user.save().then(user => {
                (<IPaymentLog>paymentLog).isSuccess = true;
                (<IPaymentLog>paymentLog).save();
                res.redirect("/dashboard/link");
              });
            } catch (err) {
              return Promise.reject(err);
            }
          } else {
            // make payment log failed to couldn't use it again.
            (<IPaymentLog>paymentLog).isSuccess = false;
            (<IPaymentLog>paymentLog).save();
            res.status(400).send(Messages.paymentMessages.paymentFailed);
          }
        } else {
          return Promise.reject(
            Messages.paymentMessages.paymentHasBeenUsedBefore
          );
        }
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      });
  }
}
