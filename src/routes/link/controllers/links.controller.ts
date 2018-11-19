import { Link } from "./../../../models/entities/link.schema";
import { Response, Request } from "express";
import _ from "lodash";

export default class LinksController {
  
  // create new link shorten.
  create(req: Request, res: Response) {

    const body = _.pick(req.body, ["address"]);
    const link = new Link(body);

    // add userId;
    if(req.user) link.userId = req.user._id;

    // save the generated link.
    link.save().then(savedLink => {

      // pick the properties that needed to response to client.
      const linkToResponse = _.pick(savedLink , ["shorten"]);
      // send shorten url key back.
      res.json({shorten: linkToResponse.shorten});
      
    }).catch(err => {
      res.status(400).json(err);
    });
  }
}
