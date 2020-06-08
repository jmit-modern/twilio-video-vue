<template>
  <div class="container-fluid chat_container" id="app">
    <div class="header">
      <Navigation />
    </div>
    <div class="row" id="room" v-if="authenticated">
      <RemoteTracks />
      <Video :username="username" :room="room"/>
    </div>
    <div class="row" v-else>
      <div class="username">
        <form class="form" @submit.prevent="submitForm(username, room)">
          <div class="form-group mb-2">
            <input type="text" id="screen-name" class="form-control" v-model.lazy="username" placeholder="Name">
          </div>
          <div class="form-group mb-2">
            <input type="text" id="room-name" class="form-control" v-model.lazy="room" placeholder="Room">
          </div>
          <button type="submit" id="submit" class="btn btn-primary mb-2 Button">Submit</button>
        </form>
      </div>
    </div>

    <div id="modals">
      <div class="modal fade" id="select-mic" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="select-mic-label" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="select-mic-label">Microphone</h5>
            </div>
            <div class="modal-body" style="text-align: center">
              <select style="width: 100%"></select>
              <svg focusable="false" viewBox="0 0 100 100" aria-hidden="true" height="100" width="100" style="margin: 10px 0">
                <defs>
                  <clipPath id="level-indicator">
                    <rect x="0" y="100" width="100" height="100" />
                  </clipPath>
                </defs>
                <path fill="rgb(220, 220, 220)" d="m52 38v14c0 9.757-8.242 18-18 18h-8c-9.757 0-18-8.243-18-18v-14h-8v14c0 14.094 11.906 26 26 26v14h-17v8h42v-8h-17v-14c14.094 0 26-11.906 26-26v-14h-8z"></path>
                <path fill="rgb(220, 220, 220)" d="m26 64h8c5.714 0 10.788-4.483 11.804-10h-11.887v-4h12.083v-4h-12.083v-4h12.083v-4h-12.083v-4h12.083v-4h-12.083v-4h12.083v-4h-12.083v-4h12.083v-4h-12.083v-4h11.887c-1.016-5.517-6.09-10-11.804-10h-8c-6.393 0-12 5.607-12 12v40c0 6.393 5.607 12 12 12z"></path>
                <path fill="#080" clip-path="url(#level-indicator)" d="m52 38v14c0 9.757-8.242 18-18 18h-8c-9.757 0-18-8.243-18-18v-14h-8v14c0 14.094 11.906 26 26 26v14h-17v8h42v-8h-17v-14c14.094 0 26-11.906 26-26v-14h-8z"></path>
                <path fill="#080" clip-path="url(#level-indicator)" d="m26 64h8c5.714 0 10.788-4.483 11.804-10h-11.887v-4h12.083v-4h-12.083v-4h12.083v-4h-12.083v-4h12.083v-4h-12.083v-4h12.083v-4h-12.083v-4h12.083v-4h-12.083v-4h11.887c-1.016-5.517-6.09-10-11.804-10h-8c-6.393 0-12 5.607-12 12v40c0 6.393 5.607 12 12 12z"></path>
              </svg>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary">Apply</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="select-camera" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="select-camera-label" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="select-camera-label">Camera</h5>
            </div>
            <div class="modal-body" style="text-align: center">
              <select style="width: 100%"></select>
              <video autoplay muted playsInline style="margin: 10px 0; width: 60%"></video>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary">Apply</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Navigation from './components/Navigation'
import Rooms from './components/Rooms'
import Video from './components/Video'
import RemoteTracks from './components/RemoteTracks'
import AddRoom from './components/AddRoom'
import {addUrlParams, getUrlParams} from './helpers/browser'
import $ from 'jquery'

export default {
  name: 'App',
  data() {
    return {
      username: "",
      room: "",
      authenticated: false
    }
  },
  computed: {
    console: () => console,
    window: () => window
  },
  created() {

  },
  mounted(){
    //Preset username and roomname
    const { roomName } = getUrlParams();
    if(roomName){
      document.getElementById("room-name").value = roomName;
      this.room = document.getElementById('room-name').value;
    }
    const identity = localStorage.getItem('userName');
    if(identity){
      document.getElementById("screen-name").value = identity;
      this.username = document.getElementById('screen-name').value;
    }
  },
  components: {
    Navigation,
    Rooms,
    Video,
    RemoteTracks,
    AddRoom
  },
  methods: {
    submitForm(username, room) {
      if (!username) {
        return alert('please provide a username');
      }
      if (!room) {r
        return alert('please provide a Room');
      }
      this.authenticated = true;

      // Add roomName params to the url
      addUrlParams({roomName: room});
      // Save the user name.
      localStorage.setItem('userName', username);
    }
  }
}
</script>

<style>
  @import './assets/style.css';
</style>