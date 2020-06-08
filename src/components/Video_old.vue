<template>
  <div id="active-participant" class="col-md-10 box">
    <div class="participant main">
      <video autoplay playsinline muted></video>
    </div>
  </div>
</template>

<script>
  import { EventBus } from '../Event'
  import Twilio, {
    createLocalVideoTrack
  } from 'twilio-video'
  import axios from 'axios'

  export default {
    name: "Video",
    data() {
      return {
        loading: false,
        data: {},
        localTrack: false,
        remoteTrack: '',
        activeRoom: '',
        previewTracks: '',
        identity: '',
        roomName: null,
      }
    },
    props: ['username', 'room'], // props that will be passed to this component
    created() {

      this.createChat(this.room);
      // When a user is about to transition away from this page, 
      // disconnect from the room, if joined.
      window.addEventListener('beforeunload', this.leaveRoomIfJoined);
    },
    methods: {
      // Generate access token
      async getAccessToken() {
        return await axios.get(`http://localhost:8000/token?identity=${this.username}&roomName=${this.room}`);
      },

      // Trigger log events 
      dispatchLog(message) {
        EventBus.$emit('new_log', message);
      },

      sendRoomName(name) {
        EventBus.$emit('room_name', name);
      },

      // attachParticipants(participants){
      //   EventBus.$emit('participants', participants);
      // },

      // // Attach the Tracks to the DOM.
      attachTracks(tracks, container) {
        tracks.forEach((track) => {
           container.appendChild(track.attach());
       });
      },

      // // Attach the Participant's Tracks to the DOM.
      attachParticipantTracks(participant, container, isLocal) {
        let tracks = this.getTracks(participant);
        this.attachTracks(tracks, container, isLocal);
      },

      // Detach the Tracks from the DOM.
      detachTracks(tracks) {

        for (let track of tracks) {
          const htmlElements = track.detach();
          for (let htmlElement of htmlElements) {
              htmlElement.remove();
            }
        }
      },

      // Detach the Participant's Tracks from the DOM.
      detachParticipantTracks(participant) {
        let tracks = Array.from(participant.tracks.values());
        this.detachTracks(tracks);
      },

      // Leave Room.
      leaveRoomIfJoined() {
        if (this.activeRoom) {
          this.activeRoom.disconnect();
        }
      },

      getTracks(participant) {
        return Array.from(participant.tracks.values()).filter(function (publication) {
            return publication.track;
        }).map(function (publication) {
            return publication.track;
        });
      },

      // Create a new chat
      createChat(room_name) {
        this.loading = true;
        const VueThis = this;

        this.getAccessToken().then( (data) => {
          let room_owner = data.data.identity;
          VueThis.roomName = null;
          const token = data.data.token;
          let connectOptions = {
              name: room_name,
              // logLevel: 'debug',
              audio: true,
              video: { width: 500, height:450 }
          };
          // before a user enters a new room,
          // disconnect the user from they joined already
          this.leaveRoomIfJoined();
        
          // remove any remote track when joining a new room
          document.getElementById('remoteTrack').innerHTML = "";

          Twilio.connect(token, connectOptions).then((room) => {
            // console.log('Successfully joined a Room: ', room);
            VueThis.dispatchLog('Successfully joined a Room: '+ room_name);
            VueThis.sendRoomName(room_name);

            // set active toom
            VueThis.activeRoom = room;
            VueThis.roomName = room_name;
            VueThis.loading = false;

            // // Attach the Tracks of all the remote Participants.
            room.participants.forEach((participant) => {
              console.log(participant)
              let previewContainer = document.getElementById('remoteTrack');
              VueThis.attachParticipantTracks(participant, previewContainer);
            });

            // When a Participant joins the Room, log the event.
            room.on('participantConnected', (participant) => {
              VueThis.dispatchLog("Joining: '" + participant.identity + "'");
            });

            // When a Participant adds a Track, attach it to the DOM.
            room.on('trackAdded', (track, participant) => {
              console.log(participant)
              VueThis.dispatchLog(participant.identity + " added track: " + track.kind);
              let previewContainer = document.getElementById('remoteTrack');
              VueThis.attachTracks([track], previewContainer);
            });
            // When a Participant removes a Track, detach it from the DOM.
            room.on('trackRemoved', (track, participant) => {
              VueThis.dispatchLog(participant.identity + " removed track: " + track.kind);
              VueThis.detachTracks([track]);
            });
            // When a Participant leaves the Room, detach its Tracks.
            room.on('participantDisconnected', (participant) => {
              VueThis.dispatchLog("Participant '" + participant.identity + "' left the room");
              VueThis.detachParticipantTracks(participant);
            });
            // if local preview is not active, create it
            if(!VueThis.localTrack) {
              createLocalVideoTrack({
                dominantSpeakerPriority: 'high',
                mode: 'collaboration',
                renderDimensions: {
                  high: { height: 720, width: 1280 },
                  standard: { height: 90, width: 160 }
                }
              }).then(track => {
                let localMediaContainer = document.getElementById('localTrack');
                let participant_wrapper = document.createElement('div');
                participant_wrapper.className = "participant_name";
                participant_wrapper.innerHTML = room_owner;
                localMediaContainer.appendChild(participant_wrapper);
                localMediaContainer.appendChild(track.attach());
                VueThis.localTrack = true;
              });
              }
           });
        })
      },
    }
  }
</script>

<style>
  #localTrack{
    margin: auto;
  }
  #localTrack video {
    margin: 0px;
    max-width: 100% !important;
    background-repeat: no-repeat;
    width:960px;
  }

  .spacing {
    padding: 20px;
    width: 100%;
  }

  .roomTitle {
    border: 1px solid rgb(124, 129, 124);
    padding: 4px;
    color: dodgerblue;
  }
  .participant_name{
    position: absolute;
    background: #000;
    padding: 0 15px;
    color: #fff;
  }
</style>