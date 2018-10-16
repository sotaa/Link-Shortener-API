import { Link } from "./../../../models/entities/link.schema";
import { Request, Response } from "express";
import _ from "lodash";
import { parse as parseUserAgent } from "express-useragent";
import path from "path";
import { AnalyticsData } from "../../../models/interfaces/analytics-data.interface";
const iplocation = require("iplocation");
const PersianDate = require("persian-date");

export class ShortenController {
  // load a link by shorten code.
  load(req: Request, res: Response) {
    const params = _.pick(req.params, ["code"]);
    Link.findOne({ shorten: params.code })
      .select({ address: 1 })
      .then(link => {
        if (link) {
          // save user info.
          iplocation("5.78.186.10", (err: any, loc: any) => {
            const userData: AnalyticsData = {
              ip: "5.78.186.10", //req.ip,
              userAgent: parseUserAgent(req.headers["user-agent"] || ""),
              location: loc || err,
              date: new Date(),
              dateFa: new PersianDate(),
              referrer: req.headers.referer
            };
            Link.schema.methods.addUserData(userData, link).then();
          });
          // redirect to destination.
          res.status(301).redirect(link.address);
        } else {
          res.sendFile(
            path.resolve(__dirname, "../../../../public/index.html")
          );
        }
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
  // get link analytics information.
  info(req: Request, res: Response) {
    const params = _.pick(req.params, "code");
    Link.findOne({ shorten: params.code })
      .then(link => {
        if (!link) {
          res.json([]);
          return;
        }

        const platforms = _.countBy(link.data, "userAgent.os");
        const browsers = _.countBy(link.data, "userAgent.browser");
        const locations = _.countBy(link.data, "location.city");
        const referrers = _.countBy(link.data, l => {
          if ((<AnalyticsData>l).referrer) return l;
        });

        res.json({
          totalCount: link.data.length,
          linkInfo: {
            address: link.address,
            shorten: link.shorten,
            createDate: link.createDate,
            createDateFa: link.createDateFa
          },
          referrers,
          browsers,
          locations,
          platforms
        });
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
}
