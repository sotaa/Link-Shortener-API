import { Link } from "./../../../models/entities/link.schema";
import { Response, Request } from "express";
import * as _ from "lodash";
import Messages from "../../../preferences/Messages";
//import user from "../../user";
import { User } from "../../../models/entities/user.schema";

export default class LinksController {
   // create new link shorten.
   async create(req: Request, res: Response) {
      const link = new Link(req.body);
      const user = await User.findById(req.user._id);

      // add userId;
      if (req.user) link.userId = req.user._id;
      if (user.schema.methods.isExpired()) {
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

   // update link shorten.
   async update(req: Request, res: Response) {
      let user = req.user;
      if (!user) {
         res.send(403).send(Messages.userMessages.userIsNotAuthenticated);
         return;
      }
      const params = _.pick(req.params, "id");
      // user = await User.findById(req.user._id);

      // // add userId;
      // if (user.schema.methods.isExpired()) {
      //    delete req.body.shorten;
      //    // TODO: delete every property that is premium.
      // }
      // save the updated link.
      const link = await Link.findByIdAndUpdate(
         params.id,
         {
            address: req.body.address,
            shorten: req.body.shorten
         },
         { new: true }
      );
      if (!link)
         return res
            .status(404)
            .send("The Link with the given ID was not found.");
      res.send(link);
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

   // get user created link.
   getUserLink(req: Request, res: Response) {
      // get user that sends request.
      const user = req.user;
      if (!user) {
         res.send(403).send(Messages.userMessages.userIsNotAuthenticated);
         return;
      }
      // find the link that belong to the user.
      const params = _.pick(req.params, "id");
      Link.findById(params.id)
         .then(link => {
            res.send(link);
         })
         .catch(err => {
            //TODO: Handle the error.
            console.error(err);
            res.status(400).send(Messages.commonMessages.badRequest);
         });
   }

   // delete user link.
   deleteUserLink(req: Request, res: Response) {
      const user = req.user;
      if (!user) {
         res.send(403).send(Messages.userMessages.userIsNotAuthenticated);
         return;
      }
      const params = _.pick(req.params, "id");
      Link.findByIdAndDelete(params.id)
         .then(result => {
            res.end();
         })
         .catch(err => {
            console.error(err);
            res.status(400).send(Messages.commonMessages.badRequest);
         });
   }
}
