# Zoom Scheduler simplest and minimal example

This is an example of making a Zoom Scheduler with minimal lines of codes (it was a test to apply as CTO @eFounders).

## How to use

Download the example [or clone the repo](https://github.com/danielsum/zoom-scheduler):

```sh
git clone git@github.com:danielsum/zoom-scheduler.git
cd zoom-scheduler
```

ADD your .env.local: 

```dotenv
# SEE : https://developers.zoom.us/
API_KEY=XXXX
API_SECRET=XXXX
ZOOM_EMAIL=XXXX
```

Install it and run:

```sh
npm install
npm run dev
```

## The idea behind the example : minimal coding

The project uses [Next.js](https://github.com/vercel/next.js), which is a framework for server-rendered React apps.
It includes `@mui/material` and its peer dependencies, including `emotion`, the default style engine in MUI v5.

If you have a very limited scope (i.e. for a side project or a simple microservice), it proves that you might won't need to overkill your infrastructure resulting in a lighter codebase and less CPU/Storage CO2 friendly app project!

Of course, if you are working on a big project, using a modern monorepos or jamstack technologies and refactoring is still mandatory :-).
