/* eslint-disable */
'use strict';
const axios = require('axios');
const { isSupported } = require('twilio-video');

const { isMobile } = require('./browser');
const { micLevel } = require('./miclevel');
const { selectMedia } = require('./selectmedia');
// const selectRoom = require('./selectroom');
const { showError } = require('./showerror');
global.jQuery = require('jquery');
var $ = global.jQuery;
window.$ = $;

import joinRoom from './joinroom';

const $modals = $('#modals');
const $selectMicModal = $('#select-mic', $modals);
const $selectCameraModal = $('select-camera', $modals);
const $showErrorModal = $('#show-error', $modals);
const $joinRoomModal = $('#join-room', $modals);

function modalElements(){
  const $modals = $('#modals');
  const $selectMicModal = $('#select-mic', $modals);
  const $selectCameraModal = $('select-camera', $modals);
}

// ConnectOptions settings for a video web application.
const connectOptions = {
  // Available only in Small Group or Group Rooms only. Please set "Room Type"
  // to "Group" or "Small Group" in your Twilio Console:
  // https://www.twilio.com/console/video/configure
  bandwidthProfile: {
    video: {
      dominantSpeakerPriority: 'high',
      mode: 'collaboration',
      renderDimensions: {
        high: { height: 720, width: 1280 },
        standard: { height: 90, width: 160 }
      }
    }
  },

  // Available only in Small Group or Group Rooms only. Please set "Room Type"
  // to "Group" or "Small Group" in your Twilio Console:
  // https://www.twilio.com/console/video/configure
  dominantSpeaker: true,

  // Comment this line to disable verbose logging.
  // logLevel: 'debug',

  // Comment this line if you are playing music.
  maxAudioBitrate: 16000,

  // VP8 simulcast enables the media server in a Small Group or Group Room
  // to adapt your encoded video quality for each RemoteParticipant based on
  // their individual bandwidth constraints. This has no utility if you are
  // using Peer-to-Peer Rooms, so you can comment this line.
  preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],

  // Capture 720p video @ 24 fps.
  video: { height: 720, frameRate: 24, width: 1280 }
};

// For mobile browsers, limit the maximum incoming video bitrate to 2.5 Mbps.
if (isMobile) {
  connectOptions
    .bandwidthProfile
    .video
    .maxSubscriptionBitrate = 2500000;
}

// On mobile browsers, there is the possibility of not getting any media even
// after the user has given permission, most likely due to some other app reserving
// the media device. So, we make sure users always test their media devices before
// joining the Room. For more best practices, please refer to the following guide:
// https://www.twilio.com/docs/video/build-js-video-application-recommendations-and-best-practices
const deviceIds = {
  audio: isMobile ? null : localStorage.getItem('audioDeviceId'),
  video: isMobile ? null : localStorage.getItem('videoDeviceId')
};

/**
 * Select your Room name, your screen name and join.
 * @param [error=null] - Error from the previous Room session, if any
 */
async function selectAndJoinRoom(identity, roomName, error = null) {
  // const formData = await selectRoom($joinRoomModal, error);
  // if (!formData) {
  //   // User wants to change the camera and microphone.
  //   // So, show them the microphone selection modal.
  //   deviceIds.audio = null;
  //   deviceIds.video = null;
  //   return selectMicrophone();
  // }
  // const { identity, roomName } = formData;

  try {

    const response = await axios.get(`/token?identity=${identity}&roomName=${roomName}`);
    
    // Extract the AccessToken from the Response.
    const token = response.data.token;

    // Add the specified audio device ID to ConnectOptions.
    connectOptions.audio = { deviceId: { exact: deviceIds.audio } };

    // Add the specified Room name to ConnectOptions.
    connectOptions.name = roomName;

    // Add the specified video device ID to ConnectOptions.
    connectOptions.video.deviceId = { exact: deviceIds.video };
    

    // Join the Room.
    return await joinRoom(token, connectOptions);

    // After the video session, display the room selection modal.
    // return selectAndJoinRoom();
  } catch (error) {
    console.log(error)
    return selectAndJoinRoom(error);
  }
}

/**
 * Select your camera.
 */
async function selectCamera(modals) {
  const $modals = $(modals);
  const $selectCameraModal = $('#select-camera', $modals);
  if (deviceIds.video === null) {
    try {
      deviceIds.video = await selectMedia('video', $selectCameraModal, stream => {
        const $video = $('video', $selectCameraModal);
        $video.get(0).srcObject = stream;
      });
    } catch (error) {
      alert(error)
      // showError($showErrorModal, error);
    }
  }
  // return selectAndJoinRoom();
}

/**
 * Select your microphone.
 */
async function selectMicrophone(modals) {
  const $modals = $(modals);
  const $selectMicModal = $('#select-mic', $modals);
  if (deviceIds.audio === null) {
    try {
      deviceIds.audio = await selectMedia('audio', $selectMicModal, stream => {
        const $levelIndicator = $('svg rect', $selectMicModal);
        const maxLevel = Number($levelIndicator.attr('height'));
        micLevel(stream, maxLevel, level => $levelIndicator.attr('y', maxLevel - level));
      });
    } catch (error) {
      alert(error)
      console.log(error)
    }
  }
  return selectCamera(modals);
}

// If the current browser is not supported by twilio-video.js, show an error
// message. Otherwise, start the application.
// window.addEventListener('load', isSupported ? selectMicrophone : () => {
//   showError($showErrorModal, new Error('This browser is not supported.'));
// });

export { selectAndJoinRoom, selectMicrophone }
