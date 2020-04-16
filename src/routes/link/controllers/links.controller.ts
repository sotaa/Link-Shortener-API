import { Link } from "./../../../models/entities/link.schema";
import { Response, Request } from "express";
import * as _ from "lodash";
import Messages from "../../../preferences/Messages";
import { Helper } from "../../user/controllers/userHelper";
import { Category } from "../../../models/entities/category.schema";
import { genSalt, hash } from "bcryptjs";

export class LinksController {
  // create new link shorten.
  async create(req: Request, res: Response) {
    const link = new Link(req.body);
    let user = req.user;
    let isExpired = true;
    if (user) {
      link.userId = user.user.id;
      const userHelper = new Helper();
      const remain = await userHelper.getRemainingDays(req.user);
      remain && remain > 0 ? (isExpired = false) : (isExpired = true);
    }
    //check user expire date
    if (isExpired) {
      delete link.shorten;
      delete link.password;
      delete link.private;
      delete link.categories;
    } else {
      if (link.password) {
        if (link.password.length < 3) {
          return res
            .status(400)
            .send(Messages.linkMessages.passwordMustBeAtLeast3Character);
        }
        // Hash Password
        const salt = await genSalt(10);
        const hashedPass = await hash(link.password, salt);
        link.password = hashedPass;
      }
      if (link.categories) {
        // Log categories to category collection
        Category.findOne({ userId: user.user.id })
          .then((categories) => {
            if (categories) {
              // find and delete common items
              let array1 = categories.data;
              let array2 = link.categories;
              let temp = this.findCommonItem(array1, array2);
              Category.updateOne(
                { userId: user.user.id },
                { $push: { data: temp } },
              ).then((result) => console.log(result));
            } else {
              categories = new Category({
                userId: user.user.id,
                data: link.categories,
              });
              categories.save().then((result) => {
                console.log(result);
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    // save the generated link.
    link
      .save()
      .then((savedLink) => {
        // pick the properties that needed to response to client.
        const linkToResponse = _.pick(savedLink, ["_id", "shorten"]);
        // send shorten url key back.
        res.json(linkToResponse);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

  // update link shorten.
  async update(req: Request, res: Response) {
    let user = req.user;
    let link;
    let isExpired;
    if (!user) {
      return res.status(403).send(Messages.userMessages.userIsNotAuthenticated);
    }
    const userHelper = new Helper();
    const remain = await userHelper.getRemainingDays(req.user);
    if (remain && remain > 0) {
      isExpired = false;
    } else {
      isExpired = true;
      return res.status(403).end();
    }
    // save the updated link.
    const params = _.pick(req.params, "id");
    try {
      link = await Link.findById(params.id);
      if (link.userId != user.user.id) {
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
        if (req.body.password.length < 3) {
          return res
            .status(400)
            .send(Messages.linkMessages.passwordMustBeAtLeast3Character);
        } else if (req.body.password == "hasPassword") {
          delete link.password;
        } else {
          const salt = await genSalt(10);
          const hashedPass = await hash(req.body.password, salt);
          link.password = hashedPass;
        }
      }
      if (req.body.password === "") {
        link.password = null;
      }
      link.private = req.body.private;
      link.categories = req.body.categories;
      Category.findOne({ userId: user.user.id }).then((categories) => {
        if (categories) {
          // find and delete common items
          let array1 = categories.data;
          let array2 = req.body.categories;
          let temp = this.findCommonItem(array1, array2);
          Category.updateOne(
            { userId: req.user._id },
            { $push: { data: temp } },
          ).then((result) => console.log(result));
        } else {
          categories = new Category({
            userId: user.user.id,
            data: link.categories,
          });
          categories.save().then((result) => {
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
      res.status(403).send(Messages.userMessages.userIsNotAuthenticated);
      return;
    }
    // find the links that belong to the user.
    Link.find({ userId: user.user.id })
      .select("-data -password")
      .then((links) => {
        let tags = req.query.tags;
        if (tags) {
          if (typeof tags === "string") {
            tags = [tags];
          }
          links = links.filter(
            (link) =>
              _.intersection(tags, link.categories).length === tags.length,
          );
        }
        res.send(links);
      })
      .catch((err) => {
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
      res.status(403).send(Messages.userMessages.userIsNotAuthenticated);
      return;
    }
    // find the link that belong to the user.
    const params = _.pick(req.params, "id");
    Link.findById(params.id)
      .select("-data")
      .then((link) => {
        if (link.password) {
          link.password = "hasPassword";
        }
        res.send(link);
      })
      .catch((err) => {
        //TODO: Handle the error.
        console.error(err);
        res.status(400).send(Messages.commonMessages.badRequest);
      });
  }

  // delete user link.
  async deleteUserLink(req: Request, res: Response) {
    let user = req.user;
    let isExpired: boolean;
    if (!user) {
      res.status(403).send(Messages.userMessages.userIsNotAuthenticated);
      return;
    }
    const userHelper = new Helper();
    const remain = await userHelper.getRemainingDays(req.user);

    if (remain && remain > 0) {
      isExpired = false;
    } else {
      isExpired = true;
      return res.status(403).end();
    }

    const params = _.pick(req.params, "id");
    try {
      let link = await Link.findById(params.id);
      // check if user is allowed for deleting user.
      if (link.userId != user.user.id) {
        return res.status(401).send("User is Unauthorized.");
      } else {
        Link.findByIdAndDelete(params.id)
          .then((result) => {
            res.end();
          })
          .catch((err) => {
            console.error(err);
            res.status(400).send(Messages.commonMessages.badRequest);
          });
      }
    } catch {
      return res.status(404).send("The Link with the given ID was not found.");
    }
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
}
