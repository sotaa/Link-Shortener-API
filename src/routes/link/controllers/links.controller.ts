import { Link } from "./../../../models/entities/link.schema";
import { Response, Request } from "express";
import * as _ from "lodash";
import Messages from "../../../preferences/Messages";
//import user from "../../user";
import { User } from "../../../models/entities/user.schema";
import { Category } from "../../../models/entities/category.schema";
import { genSalt, hash } from "bcryptjs";

export class LinksController {
  // create new link shorten.
  async create(req: Request, res: Response) {
    const link = new Link(req.body);
    let user = req.user;
    let isExpired = true;
    if (user) {
      user = await User.findById(req.user._id);
      isExpired = user.isExpired();
      // add userId;
      if (req.user) link.userId = req.user._id;
    }
    //check user expire date
    if (isExpired) {
      delete link.shorten;
      delete link.password;
      delete link.private;
      delete link.categories;
    } else if (link.password) {
      // Hash Password
      const salt = await genSalt(10);
      const hashedPass = await hash(link.password, salt);
      link.password = hashedPass;
    } else if (link.categories) {
      // Log categories to category collection
      Category.findOne({ userId: req.user._id }).then(categories => {
        if (categories) {
          // find and delete common items
          let array1 = categories.data;
          let array2 = link.categories;
          let temp = this.findCommonItem(array1, array2);
          Category.updateOne(
            { userId: req.user._id },
            { $push: { data: temp } }
          ).then(result => console.log(result));
        } else {
          categories = new Category({
            userId: req.user._id,
            data: link.categories
          });
          categories.save().then(result => {
            console.log(result);
          });
        }
      });
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
      if (link.userId != user._id) {
        return res.status(401).send("User is Unauthorized.");
      }
    } catch {
      return res.status(404).send("The Link with the given ID was not found.");
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
      if (req.body.password === undefined) {
        link.password;
      }
      if (req.body.password === "") {
        link.password = null;
      }
      link.private = req.body.private;
      link.categories = req.body.categories;
      Category.findOne({ userId: req.user._id }).then(categories => {
        if (categories) {
          // find and delete common items
          let array1 = categories.data;
          let array2 = req.body.categories;
          let temp = this.findCommonItem(array1, array2);
          Category.updateOne(
            { userId: req.user._id },
            { $push: { data: temp } }
          ).then(result => console.log(result));
        } else {
          categories = new Category({
            userId: req.user._id,
            data: link.categories
          });
          categories.save().then(result => {
            console.log(result);
          });
        }
      });

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
      .select("-data -password")
      .then(links => {
        let tags = req.query.tags;
        if (tags) {
          if (typeof tags === "string") {
            tags = [tags];
          }
          links = links.filter(
            link => _.intersection(tags, link.categories).length === tags.length
          );
        }
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
        if (link.password) {
          link.password = "hasPassword";
        }
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

  findCommonItem(array1, array2) {
    let mySet = new Set();
    let temp = [];
    for (let i = 0; i < array1.length; i++) {
      if (!mySet.has(array1[i])) {
        mySet.add(array1[i]);
      }
    }
    for (let j = 0; j < array2.length; j++) {
      if (!mySet.has(array2[j])) {
        temp.push(array2[j]);
      }
    }
    return temp;
  }

  // findCommonItem2(array1: ILink[], array2) {
  //   links =  link.filter( link => _.intersection( this.selectedTags, link.categories ).length === this.selectedTags.length);
  //   }
}

// POST: /api/v1/links?apikey=743hjkfjgdpu90
// PUT: /api/v1/links/:id?apikey=743hjkfjgdpu90
// DELETE: /api/v1/links/:id?apikey=743hjkfjgdpu90
// GET: /api/v1/links/:id?apikey=743hjkfjgdpu90
