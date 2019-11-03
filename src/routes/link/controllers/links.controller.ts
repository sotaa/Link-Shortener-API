import { Link } from "./../../../models/entities/link.schema";
import { Response, Request } from "express";
import * as _ from "lodash";
import Messages from "../../../preferences/Messages";
//import user from "../../user";
import { User } from "../../../models/entities/user.schema";
import { genSalt, hash } from "bcryptjs";

export default class LinksController {
   // create new link shorten.
   async create(req: Request, res: Response) {
      const link = new Link(req.body);
      if (link.password) {
         const salt = await genSalt(10);
         const hashedPass = await hash(link.password, salt);
         link.password = hashedPass;
      }
      let user = req.user;
      if (user) {
         user = await User.findById(req.user._id);
         // add userId;
         if (req.user) link.userId = req.user._id;
         //check user expire date
         const isExpired = user.isExpired();
         if (isExpired) {
            delete link.shorten;
            // TODO: delete every property that is premium.
         }
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
      let link;
      let isExpired;
      if (!user) {
         res.send(403).send(Messages.userMessages.userIsNotAuthenticated);
         return;
      }
      try {
         user = await User.findById(req.user._id);
         isExpired = user.isExpired();
         if (isExpired) {
            return res.status(403).end();
         }
      } catch (err) {
         return res.send(err.json());
      }
      // save the updated link.
      const params = _.pick(req.params, "id");
      try {
         link = await Link.findById(params.id);
      } catch {
         return res
            .status(404)
            .send("The Link with the given ID was not found.");
      }
      try {
         link.address = req.body.address;
         if (req.body.shorten) {
            link.shorten = req.body.shorten;
         }
         if (req.body.password) {
            const salt = await genSalt(10);
            const hashedPass = await hash(req.body.password, salt);
            link.password = hashedPass;
         }
         await link.save();
      } catch (err) {
         return res.status(400).send(err);
      }
      return res.send(link);
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
         .select("-data")
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
         .select("-data")
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
   async deleteUserLink(req: Request, res: Response) {
      let user = req.user;
      let isExpired;
      if (!user) {
         res.send(403).send(Messages.userMessages.userIsNotAuthenticated);
         return;
      }
      try {
         user = await User.findById(req.user._id);
         isExpired = user.isExpired();
         if (isExpired) {
            return res.status(403).end();
         }
      } catch (err) {
         return res.send(err.json());
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
