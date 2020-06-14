# Twilio video Chat-Vue.js

<a name="project-setup">
## Project setup
</a>

Run `npm install` to install all dependencies from NPM.

<a name="how-to-run">
## How to run
</a>

### Running a local token server

This application requires an access token to connect to a Room. The included local token [server](server.js) provides the application with access tokens. Perform the following steps to setup the local token server:

- Create an account in the [Twilio Console](https://www.twilio.com/console).
- Click on 'Settings' and take note of your Account SID.
- Create a new API Key in the [API Keys Section](https://www.twilio.com/console/video/project/api-keys) under Programmable Video Tools in the Twilio Console. Take note of the SID and Secret of the new API key.
- Store your Account SID, API Key SID, and API Key Secret SID in a new file called `.env` in the root level of the application (example below).

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SID=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET_SID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Now the local token server (see [server.js](server.js)) can dispense Access Tokens to connect to a Room.

### Running the App locally

Run the app locally with

```
$ npm start
```

This will start the local token server and run the app in the development mode. Open http://localhost:3000 to see the application in the browser.

The page will reload if you make changes to the source code in `src/`.
You will also see any linting errors in the console. Start the token server locally with

```
$ npm run server
```

The token server runs on port 8000 and expects a `GET` request at the `/token` route with the following query parameters:

```
identity: string,  // the user's identity
roomName: string   // the room name
```

The response will be a token that can be used to connect to a room.

Try it out with this sample `curl` command:

`curl 'localhost:8000/token?identity=TestName&roomName=TestRoom'`

### Multiple Participants in a Room

If you want to see how the application behaves with multiple participants, you can simply open `localhost:3000` in multiple tabs in your browser and connect to the same room using different user names.

Additionally, if you would like to invite other participants to a room, each participant would need to have their own installation of this application and use the same room name and Account SID (the API Key and Secret can be different).

### Building

Build the app with
```
$ npm run build
```
This script will build the static assets for the application in the `build/` directory.

### Running On Multiple Devices

You can use [ngrok](https://ngrok.com/) to try your application
on different devices by creating a secure tunnel to your application server:

```bash
ngrok http 3000
```

You will get a URL of the form `https://a1b2c3d4.ngrok.io` which can be loaded on a browser from a device
different than the one where your application server is running.

## Server deployment

In webrtc apps, the domain name should be secured with https.
You can use the free SSL certificates like [Let's Encrypt](https://letsencrypt.org/)
Clone the repository in the server, and do the steps following the [Project setup](#project-setup) and [How to run](#how-to-run)

## Browser Support

See browser support table for [twilio-video.js SDK](https://github.com/twilio/twilio-video.js/tree/master/#browser-support).