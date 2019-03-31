import { Link } from "./../../../models/entities/link.schema";
import { Response, Request } from "express";
import _ from "lodash";
import Messages from "../../../preferences/Messages";
import user from "../../user";

export default class LinksController {
  // create new link shorten.
  create(req: Request, res: Response) {
    const link = new Link(req.body);

    // add userId;
    if (req.user) link.userId = req.user._id;
    if(!req.user.remainingDayes) {
      delete link.shorten;
      // TODO: delete every property that is premium.
    }
    // save the generated link.
    link
      .save()
      .then(savedLink => {
        // pick the properties that needed to response to client.
        const linkToResponse = _.pick(savedLink, ["_id", "shorten"]);
        // send shorten url key back.
        res.json(linkToResponse);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }

  // get user created links.
  getUserLinks(req: Request, res: Response) {
    // get user that sends request.
    const user = req.user;
    if (!user) {
      res.send(403).send(Messages.userMessages.userIsNotAuthenticated);
      return;
    }
    // find the links that belong to the user.
    Link.find({ userId: user._id })
      .then(links => {
        res.send(links);
      })
      .catch(err => {
        //TODO: Handle the error.
        console.error(err);
        res.status(400).send(Messages.commonMessages.badRequest);
      });
  }
}
