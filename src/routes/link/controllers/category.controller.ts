import { Request, Response } from "express";
import { Category } from "./../../../models/entities/category.schema";
import Messages from "../../../preferences/Messages";

export class CategoryController {

  // create or update categories.
  create(req: Request, res: Response) {
    // pick retrieved data.
    const body = req.body;

    // load the users categories if exist.
    Category.findOne({ userId: req.user._id }).then(categories => {
      // update user categories if exists.
      if (categories) {
        Category.updateOne({userId: req.user._id},{ data: body }).then(result => res.send(result));
      } else {
        // make new categories object.
        categories = new Category({ userId: req.user._id, data: body });
        // save the categories.
        categories
          .save()
          .then(result => {
            res.send(result);
          })
          .catch(err => {
            res.status(500).send(Messages.commonMessages.serverError);
          });
      }
    });
  }

  // get users categories.
  get(req: Request , res: Response) {
    Category.findOne({userId: req.user._id}).then(categories => {
      res.send(categories ? categories.data : null);
    }).catch(err => {
      console.log(err);
      res.status(500).send(Messages.commonMessages.serverError);
    })
  }
}
