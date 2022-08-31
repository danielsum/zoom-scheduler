import {AppointmentTooltip} from "@devexpress/dx-react-scheduler-material-ui";
import {Grid} from "@mui/material";
import DuoIcon from "@mui/icons-material/Duo";

export const Tooltip = (({children, appointmentData, ...restProps}) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    <Grid container alignItems="center">
      <Grid item xs={2} sx={{textAlign: "center"}}>
        <DuoIcon />
      </Grid>
      <Grid item xs={10}>
        <a href={appointmentData.location}>{appointmentData.location}</a>
      </Grid>
    </Grid>
  </AppointmentTooltip.Content>
));
