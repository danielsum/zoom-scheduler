import {sharedHeaders} from "./index";
import {differenceInMinutes, parseISO, subMinutes} from "date-fns";

export default async function handler(req, res) {

  const {id} = req.query;

  try {
    if (req.method === 'PUT') {
      const body = JSON.parse(req.body);
      let meeting = {
        timezone : "UTC"
      };

      if (body?.notes) {
        meeting.agenda = body.notes;
      }

      if (body?.title) {
        meeting.topic = body.title;
      }

      if (body?.startDate && body?.endDate) {
        meeting.start_time = body.startDate;
        meeting.duration = differenceInMinutes(parseISO(body.endDate), parseISO(body.startDate));
      } else if (body?.startDate) {
        meeting.start_time = body.startDate;
        meeting.duration = 30;
      } else if (body?.endDate) {
        meeting.start_time = subMinutes(parseISO(body.endDate), 30);
        meeting.duration = 30;
      }
      console.log('Update meeting', id, meeting);
      /**
       * This endpoint return only a response code
       */
      await fetch(`https://api.zoom.us/v2/meetings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(meeting),
        ...sharedHeaders
      });

      const response = await fetch(`https://api.zoom.us/v2/meetings/${id}`, {
        method: "GET",
        ...sharedHeaders
      });
      const data = await response.json();
      res.status(200).json(data);
    } else if (req.method === "DELETE") {
      await fetch(`https://api.zoom.us/v2/meetings/${id}`, {
        method: "DELETE",
        ...sharedHeaders
      });
      console.log('Delete meeting', id);
      res.status(204).json({});
    } else {
      const response = await fetch(`https://api.zoom.us/v2/meetings/${id}`, {
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
