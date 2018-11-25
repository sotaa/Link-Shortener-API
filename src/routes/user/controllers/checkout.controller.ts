import { Request, Response } from "express";

const zPal = require('zarinpal-checkout');

export class CheckoutController {

    pay(req: Request , res: Response) {
        
        const plan = 'silver';
        const plans = {silver: 1000}
        const phoneNumber = '';
        // zarinpal payment
      const myZPal = zPal.create("74abbf8e-e756-11e8-8339-005056a205be", true);
      myZPal
        .PaymentRequest({
          Amount: plans[plan], // In Tomans
          CallbackURL: "http://shopping.tad-group.ir/successful",
          Description:
            name + " بابت پلن فروشگاهی " + plan + " شماره تلفن: " + phoneNumber,
          Mobile: phoneNumber
        })
        .then((response: any) => {
          console.log(response);
          if (response.status === 100) {
            // data.newOrder(
            //   name,
            //   phoneNumber,
            //   plan,
            //   description,
            //   response.authority
            // );
            res.redirect(response.url);
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
}