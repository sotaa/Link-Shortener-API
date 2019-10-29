import { Request, Response } from "express";
import Messages from "../../../preferences/Messages";
import { User } from "../../../models/entities/user.schema";

export class UserController {
   // get user information.
   info(req: Request, res: Response) {
      const user = req.user;
      // reject the request if user is not authenticated.
      if (!user) {
         res.status(403).send(Messages.userMessages.userIsNotAuthenticated);
         return;
      }
      // load user information.
      User.findById(user._id)
         .then(user => {
            // check user existing.
            if (!user)
               return Promise.reject(Messages.userMessages.userNotFound);
            const remainingDays = user.getRemainingDays();
            user.remainingDays = +remainingDays;
            res.send(user);
         })
         .catch(err => {
            console.log(err);
            res.status(500).send(Messages.commonMessages.serverError);
         });
   }
}
