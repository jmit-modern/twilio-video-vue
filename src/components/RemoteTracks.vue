<template>
  <div id="participants" class="col-md-2 box">

  </div>
</template>

<script>
  import {
    EventBus
  } from '../Event'
  import axios from 'axios'

  export default {
    name: "RemoteTracks",
    data() {
      return {

      }
    },
    created() {

    },
  }
</script>

<style>
  .remote_video_container {
    left: 0;
    margin: 0;
  }
  #remoteTrack video{
    width: 100% !important;
  }
</style>