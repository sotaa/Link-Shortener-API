import { Request, Response } from "express";
import Messages from "../../../preferences/Messages";
import { Helper } from "./userHelper";

export class UserController {
  // get user information.
  async info(req: Request, res: Response) {
    const user = req.user;
    // reject the request if user is not authenticated.
    const result = {
      id: "",
      email: "",
      expireDate: "",
      remainingDays: 0,
    };
    if (!user) {
      res.status(403).send(Messages.userMessages.userIsNotAuthenticated);
      return;
    }
    // load user information.
    const userHelper = new Helper();
    const remain = await userHelper.getRemainingDays(req.user);

    result.remainingDays = remain;
    result.id = req.user.user.id;
    result.email = req.user.user.username;
    result.expireDate = req.user.expireDate;

    res.send(result);
  }
}
