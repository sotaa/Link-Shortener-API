import { Link } from "./../../../models/entities/link.schema";
import { Request, Response } from "express";
import * as _ from "lodash";
import { parse as parseUserAgent } from "express-useragent";
import * as path from "path";
import { AnalyticsData } from "../../../models/interfaces/analytics-data.interface";
const geoip = require("geoip-lite");
import systemConsoleColors from "../../../config/colors/system-console.colors";
import { lookup } from "../../../libs/ipapi";
import { readFileSync } from "fs";
import { User } from "../../../models/entities/user.schema";
const PersianDate = require("persian-date");

const ipapiKey = readFileSync(
   path.resolve(__dirname, "../../../config/settings/ipapi.key")
).toString();

export class ShortenController {
   // load a link by shorten code.
   load(req: Request, res: Response) {
      const params = _.pick(req.params, ["code"]);
      Link.findOne({ shorten: params.code })
         .select({ address: 1 })
         .then(async link => {
            if (link) {
               // redirect to destination.
               res.status(301).redirect(link.address);

               const userIp =
                  req.ip ||
                  req.header("x-forwarded-for") ||
                  req.connection.remoteAddress ||
                  req.socket.remoteAddress;

               const userData: AnalyticsData = {
                  ip: userIp || "",
                  userAgent: parseUserAgent(req.headers["user-agent"] || ""),
                  location: "", // loc || err,
                  locationMinimalData: geoip.lookup(userIp),
                  date: new Date(),
                  dateFa: new PersianDate(),
                  referrer: req.headers.referer
               };
               try {
                  const loc = await lookup(userIp, ipapiKey);
                  userData.location = loc.data;
               } catch (e) {
                  console.log(systemConsoleColors.error, e);
                  userData.location = e;
               }

               try {
                  await (link as any).addUserData(userData, link);
               } catch (e) {
                  console.log(e);
               }
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
   async info(req: Request, res: Response) {
      try {
         const params = _.pick(req.params, "code");
         const link = await Link.findOne({ shorten: params.code });
         if (!link) {
            res.status(404).send([]);
            return;
         }
         let userIsExpired = true;
         if (req.user) {
            const user = await User.findById(req.user._id);
            userIsExpired = await user.isExpired();
         }

         const platforms = _.countBy(link.data, "userAgent.os");
         const browsers = _.countBy(link.data, "userAgent.browser");
         const locations = _.countBy(link.data, "location.country_name");
         let locationDetails;
         if (userIsExpired) {
            locationDetails = {
               continents: null,
               regions: null,
               cities: null,
               languages: null
            };
         } else {
            locationDetails = {
               continents: _.countBy(link.data, "location.continent_name"),
               regions: _.countBy(link.data, "location.region_name"),
               cities: _.countBy(link.data, "location.city"),
               languages: _.countBy(link.data, "location.location.languages")
            };
         }

         const referrers = _.countBy(link.data, l => {
            if ((<AnalyticsData>l).referrer) return l.referrer;
         });
         const clicksByDate = _.countBy(link.data, l => {
            const pdate = new PersianDate((<AnalyticsData>l).dateFa);
            return pdate.year() + "/" + pdate.month() + "/" + pdate.day();
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
            locationDetails,
            platforms,
            clicksByDate,
            userIsExpired
         });
      } catch (err) {
         res.status(400).json(err);
      }
   }

   // check shorten is exists.
   isExists(req: Request, res: Response) {
      const params = _.pick(req.params, "code");
      Link.findOne({ shorten: params.code }).then(link => {
         if (!link) {
            res.status(404).end();
         } else {
            res.end();
         }
      });
   }
}
