import { Request, Response } from "express";
import * as _ from "lodash";
import { User } from "../../../models/entities/user.schema";
import Messages from "../../../preferences/Messages";
import { IUser } from "../../../models/interfaces/user.interface";

export class AuthController {

  // register new user.
  register(req: Request, res: Response) {
    const data = _.pick(req.body, ["email", "password", "name"]);
    const user = new User(data);

    // save user to database.
    user
      .save()
      .then(() => {
        // generate the token.
        user.generateAuthToken().then((token: string) => {
          res.header("x-new-token",'Bearer ' +  token).send(user.toJSON());
        });
      })
      .catch(err => {
        res.status(400).send({message: err.message});
      });
  }

  // login requests handler.
  login(req: Request , res: Response) {
    const data = _.pick(req.body , ["email" , "password"]);
    User.schema.statics.findByCredentials(data).then((user: IUser) => {
      if(!user) {
        res.status(404).send({message: Messages.userMessages.loginFailed});
        return;
      }

      // generate new token for logged in user.
      user.generateAuthToken().then(token => {
        res.header('x-new-Token' , 'Bearer ' + token).send(user.toJSON());
      });
      
    }).catch((err: any) => {
      res.status(400).send(err);
    });
  }
}
