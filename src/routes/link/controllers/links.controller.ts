import { Link } from "./../../../models/entities/link.schema";
import { Response, Request } from "express";
import _ from "lodash";

export default class LinksController {
  
  create(req: Request, res: Response) {

    const body = _.pick(req.body, ["address"]);
    const link = new Link(body);

    link.save().then(savedLink => {
      res.json(savedLink);
    }).catch(err => {
      res.status(400).json(err);
    });
  }
}
