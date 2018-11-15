import { Request, Response } from "express";
import _ from "lodash";
import { User } from "../../../models/entities/user.schema";

export class AuthController {
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
}
