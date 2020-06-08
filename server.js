'use strict';

/**
 * Load Twilio configuration from .env config file - the following environment
 * constiables should be set:
 * process.env.TWILIO_ACCOUNT_SID
 * process.env.TWILIO_API_KEY
 * process.env.TWILIO_API_SECRET
 */

const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
require('dotenv').config();

// Create Express webapp.
app.use(express.static(path.join(__dirname, 'build')));

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY;
const twilioApiKeySecret = process.env.TWILIO_API_SECRET;

/**
 * Generate an Access Token for a chat application user provided via the url
 */
app.get('/token', function(request, response) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  const { identity, roomName } = request.query;

  if ( !identity ) {
    response.send({
      body: "An identity is needed"
    })
  }
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  // Assign the generated identity to the token.
  token.identity = identity;

  // Grant the access token Twilio Video capabilities.
  const videoGrant = new VideoGrant();
  token.addGrant(videoGrant);

  // Serialize the token to a JWT string and include it in a JSON response.
  response.send({
    identity: identity,
    token: token.toJwt()
  });
  console.log(`issued token for ${identity} in room ${roomName}`);
});

app.listen(8000, () => console.log('token server running on 8000'));
