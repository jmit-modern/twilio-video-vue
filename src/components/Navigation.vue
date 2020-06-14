<template>
   <nav class="row header-row navbar bg-dark">
    <a class="navbar-brand" href="#">
        <img src="https://www.twilio.com/docs/static/img/wordmark.06c5f14fff7c.svg" width="30" height="30" class="d-inline-block align-top" alt="" />
        <span style="margin: 0 10px">Video Chat</span>
    </a>
    <div class="room_name" v-if="room_name">
        {{room_name}}
    </div>
    <div class="settings">
        <!-- <img src="../assets/gear.png" width="25" height="25" class="d-inline-block align-top" alt="" /> -->
    </div>
   </nav>
</template>

<script>
import { EventBus } from '../Event'

export default {
 name: "Navigation", // Component name
 data() {
   return {
    room_name: "",
   }
 },
 created(){
    EventBus.$on('room_name', (name) => {
        this.room_name = name;
    });
 },
 methods: {

 }
}
</script>

<style>
.header-row{
    background: #212020;
    padding: 15px 3%;
    color: #fff;
}
</style>