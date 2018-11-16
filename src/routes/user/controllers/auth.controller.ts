import { Request, Response } from "express";
import _ from "lodash";
import { User } from "../../../models/entities/user.schema";
import Messages from "../../../preferences/Messages";

export class AuthController {

  // register new user.
  register(req: Request, res: Response) {
    const data = _.pick(req.body, ["email", "password"]);
    const user = new User(data);

    // save user to database.
    user
      .save()
      .then(() => {
        // generate the token.
        user.generateAuthToken().then((token: string) => {
          res.header("x-auth", token).send(user.toJSON());
        });
      })
      .catch(err => {
        res.status(400).send({message: err.message});
      });
  }

  // login requests handler.
  login(req: Request , res: Response) {
    const data = _.pick(req.body , ["email" , "password"]);
    User.findOne(data).then(user => {
      if(!user) {
        res.status(404).send({message: Messages.userMessages.loginFailed})
      }
    }).catch(err => {
      res.status(400).send(err);
    });
  }
}
