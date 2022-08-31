import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../components/ProTip';
import Link from '../components/Link';
import Copyright from '../components/Copyright';
import Paper from '@mui/material/Paper';
import {utcToZonedTime} from 'date-fns-tz';
import {addMinutes, format, parseISO} from 'date-fns';
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  DateNavigator,
  AppointmentForm,
  AppointmentTooltip,
  DragDropProvider,
  TodayButton,
  Toolbar,
} from '@devexpress/dx-react-scheduler-material-ui';
import {useEffect, useState} from "react";
import {Tooltip} from "../components/Scheduler";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, Grid,
  LinearProgress
} from "@mui/material";
import DuoIcon from "@mui/icons-material/Duo";
import {EventAvailable} from "@mui/icons-material";

export default function Index() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({visible: false, title: null, content: null, actions: null});
  const [currentDate] = useState();

  // Load meetings from api
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Handle Create, Update and Delete from the Scheduler
   *
   * @param added
   * @param changed
   * @param deleted
   */
  const handleChange = ({added, changed, deleted}) => {
    console.log("Schedule change", added, changed, deleted);
    if (added) {
      setLoading(true);
      fetch('/api/meetings', {
        method: "POST",
        body: JSON.stringify(added),
      }).then((res) => {
        res.json().then((meeting) => {
          showDialog(meeting, "created");
          fetchData();
        });
      }).catch((e) => {
        showDialog(null, "error");
      });
    }
    if (changed) {
      setLoading(true);
      Object.keys(changed).map((id) => {
        fetch('/api/meetings/' + id, {
          method: "PUT",
          body: JSON.stringify(changed[id]),
        }).then((res) => {
          res.json().then((meeting) => {
            showDialog(meeting, "updated");
            fetchData();
          });
        });
      });
    }
    if (deleted !== undefined) {
      setLoading(true);
      fetch('/api/meetings/' + deleted, {
        method: "DELETE",
      }).finally(() => {
        showDialog(null, "deleted");
        fetchData();
      });
    }
  }

  /**
   * Fetch meetings from api
   */
  const fetchData = () => {
    setLoading(true);
    fetch('/api/meetings')
      .then((res) => res.json())
      .then((data) => {
        setData(data.meetings.map((meeting) => {
          // Zoom Date is always saved as UTC date so we must adapt to the user timezone
          const startTime = utcToZonedTime(parseISO(meeting.start_time), Intl.DateTimeFormat().resolvedOptions().timeZone);
          return {
            title: meeting.topic,
            startDate: startTime,
            endDate: addMinutes(startTime, meeting.duration),
            id: meeting.id,
            key: meeting.id,
            location: meeting.join_url,
          };
        }));
        setLoading(false);
      });
  };

  /**
   * Handle the dialog output on created, updated or deleted event
   *
   * @param meeting
   * @param status
   */
  function showDialog(meeting, status) {
    let title, content;
    function renderMeetingInfo(meeting){
      return <Grid container alignItems={"center"}>
        <Grid item xs={12}>
          <Typography variant={'h6'}>{meeting.topic}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={'body2'} sx={{mb:2}}>{meeting.agenda}</Typography>
        </Grid>
        <Grid item xs={1} sx={{textAlign: "center"}}>
          <EventAvailable />
        </Grid>
        <Grid item xs={11}>
          {format(parseISO(meeting.start_time), "MM/dd/yyyy h:mm")}
        </Grid>
        <Grid item xs={1} sx={{textAlign: "center"}}>
          <DuoIcon />
        </Grid>
        <Grid item xs={11}>
          <a href={meeting.join_url}>Zoom link</a>
        </Grid>
      </Grid>
    }

    switch (status) {
      case "updated":
        title = "Meeting updated";
        content = <>
          <Box sx={{mb:2}}>Yay, you're meeting has been updated !</Box>
          {renderMeetingInfo(meeting)}
        </>;
        break
      case "created":
        title = "Meeting Created";
        content = <>
          <Box sx={{mb:2}}>Yay, you're meeting has been created !</Box>
          {renderMeetingInfo(meeting)}
        </>;
        break
      case "deleted":
        title = "Meeting deleted";
        content = "You're meeting has been deleted";
        break
    }
    setDialog({
      title,
      content,
      visible: true,
      actions: <>
        <Button onClick={closeDialog}>Ok</Button>
      </>
    });
  }

  function closeDialog() {
    setDialog({...dialog, visible: false});
  }

  return (
    <Container>
      <Box sx={{my: 2}}>
        <Box sx={{mb: 2}}>
          <Typography variant="h5" component="h1" gutterBottom>
            Zoom Scheduler
          </Typography>
          <Link href="/about" color="secondary">
            About
          </Link>
        </Box>
        <Paper>
          {loading && <LinearProgress/>}
          <Scheduler
            firstDayOfWeek={1}
            data={data}
            height={660}
          >
            <ViewState
              defaultCurrentDate={currentDate}
            />
            <Toolbar/>
            <DateNavigator/>
            <TodayButton/>
            <EditingState
              onCommitChanges={handleChange}
            />
            <IntegratedEditing/>
            <WeekView
              startDayHour={9}
              endDayHour={17}
            />
            <Appointments/>
            <AppointmentTooltip
              contentComponent={Tooltip}
              showCloseButton
              showOpenButton
              showDeleteButton
            />
            <AppointmentForm/>
            <DragDropProvider/>
          </Scheduler>
        </Paper>
        <ProTip/>
        <Copyright/>
      </Box>
      <Dialog open={dialog.visible} onClose={closeDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
        <DialogTitle id={"alert-dialog-title"}>{dialog.title}</DialogTitle>
        <DialogContent>
          <Box id="alert-dialog-description">
            {dialog.content}
          </Box>
        </DialogContent>
        <DialogActions>
          {dialog.actions}
        </DialogActions>
      </Dialog>
    </Container>
  );
}
