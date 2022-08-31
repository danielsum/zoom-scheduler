import jwt from "jsonwebtoken";
import {differenceInMinutes, parseISO} from "date-fns";
import {utcToZonedTime, zonedTimeToUtc} from "date-fns-tz";

/**
 * Generate a JWT token
 *
 * @type {{iss:string, exp: number}}
 */
const payload = {
  iss: process.env.API_KEY,
  exp: new Date().getTime() + 5000,
};
export const token = jwt.sign(payload, process.env.API_SECRET);
export const sharedHeaders = {
  headers: {
    "User-Agent": "Zoom-api-Jwt-Request",
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  }
}

export default async function handler(req, res) {
  const email = process.env.ZOOM_EMAIL;

  try {
    if (req.method === 'POST') {
      const body = JSON.parse(req.body);
      let formData = {
        agenda: body?.notes || "",
        topic: body.title,
        start_time: body.startDate,
        type: 2,
        timezone: "UTC",
        duration: differenceInMinutes(parseISO(body.endDate), parseISO(body.startDate)),
        settings: {
          host_video: "true",
          participant_video: "true",
        },
      };
      const response = await fetch(`https://api.zoom.us/v2/users/${email}/meetings`, {
        method: "POST",
        body: JSON.stringify(formData),
        ...sharedHeaders
      });
      const data = await response.json();
      res.status(201).json(data);
    } else {
      const response = await fetch(`https://api.zoom.us/v2/users/${email}/meetings`, {
        method: "GET",
        ...sharedHeaders
      });
      const data = await response.json();
      res.status(200).json(data);
    }
  } catch (e) {
    res.status(500).json({"msg": e.message, "errors": e.errors || []});
  }
}
