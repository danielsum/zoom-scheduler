import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../components/Link';
import Copyright from '../components/Copyright';

export default function About() {
  return (
    <Container maxWidth="sm">
      <Box sx={{my: 4}}>
        <Typography variant="h4" component="h1" gutterBottom>
          Schedule a zoom meeting with me :-)
        </Typography>
        <Typography>
          <p>I'm a Senior Full Stack developer specialized in customized Web development solutions (Intranet, Extranet), SaaS platforms, ERP integration, Webservices, and Jam Stack Technologies.</p>

          <p>I accumulated many experiences on different project types for customers like Unicef, National Lottery, Groupon, Mini, Engie, ING and for different agencies like TBWA Group.</p>
          <p>I've founded a digital agency Cherry Pulp in 2013 which became a team of more than 18 people. After 10 years in a web agency, I want to work on a product to bring him to the next level.</p>

          <p>I'm able to work closely with the product team, customers and I can lead a big tech team. I'm often called the Swiss-Knife.</p>
          <p>My way of life : <strong>D.R.Y., be S.O.L.I.D. and T.D.D</strong>.</p>
        </Typography>
        <Button variant="contained" component={Link} noLinkStyle href="/">
          Go to the Meeting Scheduler
        </Button>
        <Box sx={{mt:2}}>
          <Copyright />
        </Box>
      </Box>
    </Container>
  );
}
