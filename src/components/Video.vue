<template>
  <div id="active-participant" class="col-md-10 box">
    <div class="participant main">
      <video autoplay playsinline muted></video>
      <div class="controls d-flex flex-row">
        <span class="audio_control control" v-on:click="medialControl('audio')" v-bind:class="{muted: audioMuted}">
          <svg class="audio mute" width="1.5em" focusable="false" viewBox="0 0 24 24" aria-hidden="false" role="presentation">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path>
          </svg>
          <svg class="audio unmute" width="1.5em" focusable="false" viewBox="0 0 24 24" aria-hidden="false" role="presentation">
            <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"></path>
          </svg>
        </span>
        <span class="video_control control" v-on:click="medialControl('video')" v-bind:class="{muted: videoMuted}">
          <svg class="video mute" width="1.5em" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"></path>
          </svg>
          <svg class="video unmute" width="1.5em" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
            <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"></path>
          </svg>
        </span>
        <span id="leave-room" class="endcall_control control">
          <svg class="endcall" width="1.5em" focusable="true" viewBox="0 0 24 24" aria-hidden="true" role="presentation" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"></path>
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import { EventBus } from '../Event'
  import Twilio, {
    createLocalVideoTrack
  } from 'twilio-video'
  import axios from 'axios'
  import { selectAndJoinRoom, selectMicrophone } from '../helpers/videoTrack'
  import { participantMutedOrUnmutedMedia, muteYourAudio, unmuteYourAudio } from '../helpers/localmediacontrols/helpers'

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
        audioMuted: false,
        videoMuted: false
      }
    },
    props: ['username', 'room'], // props that will be passed to this component
    created() {
      // When a user is about to transition away from this page, 
      // disconnect from the room, if joined.
      window.addEventListener('beforeunload', this.leaveRoomIfJoined);
    },
    async mounted(){
      // this.createChat(this.room);
      let modals = document.getElementById('modals');
      await selectMicrophone(modals);

      let chatRoom = await selectAndJoinRoom(this.username, this.room);
      
    },
    methods: {
      medialControl(media){
        if(media == 'audio'){
          this.audioMuted = !this.audioMuted;
        }else if( media == 'video' ){
          this.videoMuted = !this.videoMuted;
        }
      },
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
  .controls{
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99;
  }
  .control {
    height: 24px;
    box-sizing: content-box;
    padding: 10px;
    background: #cecece;
    border-radius: 50%;
    flex: 1 1 auto;
    margin: 5px;
    transition: all 0.3s;
  }
  .control:hover{
    opacity: 0.9;
  }
  .endcall_control {
    background:red;
  }  
  .unmute{
    display: none;
  }
  .audio_control.muted svg.mute{
    display: none;
  }
  .audio_control.muted svg.unmute{
    display: block;
  }
  .video_control.muted svg.mute{
    display: none;
  }
  .video_control.muted svg.unmute{
    display: block;
  }
</style>