<template>
  <div>
    <div class="stream-list-wrapper">
      <div class="stream-list-users">
        <button
          class="stream-list-user"
          v-for="stream in streamsData"
          :key="stream.channel"
          :class="[{live: stream.isLive}, {active: activeStream === stream.channel}]"
          @click="changeStream(stream.channel)">
          <img
            :src="stream.channelData.profile_image_url"
            :alt="stream.channel"
            :title="stream.channel">
        </button>
        <router-link :to="`/streamer/${activeStream}`">
          En savoir plus sur {{ activeStream | capitalize }}
        </router-link>
      </div>
      <div class="stream-list-players">
        <single-stream
          v-for="stream in streamsData"
          :key="stream.channel"
          :class="{active: activeStream === stream.channel}"
          :streamer-channel="stream.channel"
          :is-active="activeStream === stream.channel"
          >
        </single-stream>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueResource from 'vue-resource';

import SingleStream from './SingleStream';

Vue.use(VueResource);

export default {
  name: 'StreamList',
  components: { SingleStream },
  data() {
    return {
      streamsData: [
        {
          channel: 'olympeakgaming',
          channelData: [],
          streamData: [],
          isLive: false,
        },
        {
          channel: 'nyaron',
          channelData: [],
          streamData: [],
          isLive: false,
        },
        {
          channel: 'sanctar',
          channelData: [],
          streamData: [],
          isLive: false,
        },
        {
          channel: 'julioyuki',
          channelData: [],
          streamData: [],
          isLive: false,
        },
      ],
      activeStream: 'olympeakgaming',
    };
  },
  methods: {
    changeStream(stream) {
      this.activeStream = stream;
    },
    checkStreamsStatus() {
      const self = this;
      const requestOptions = {
        headers: { 'Client-ID': process.env.TWITCH_ID },
        params: {
          user_login: [],
        },
      };

      self.streamsData.forEach((stream) => {
        requestOptions.params.user_login.push(stream.channel);
      });

      Vue.http.get('https://api.twitch.tv/helix/streams/', requestOptions).then((response) => {
        if (response.status === 200 && typeof response.body !== 'undefined') {
          self.streamsData.forEach((channel, index) => {
            const t = response.body.data.findIndex(stream =>
              stream.user_id === channel.channelData.id);
            if (t > -1) {
              self.streamsData[index].streamData = response.body.data[t];
              self.streamsData[index].isLive = true;
            } else {
              self.streamsData[index].streamData = [];
              self.streamsData[index].isLive = false;
            }
          });
        }
      }, (response) => {
        window.eventBus.$emit('error', { source: 'streamList', data: response });
      });
    },
  },
  mounted() {
    const self = this;
    const requestOptions = {
      headers: { 'Client-ID': process.env.TWITCH_ID },
      params: {
        login: [],
      },
    };

    self.streamsData.forEach((stream) => {
      requestOptions.params.login.push(stream.channel);
    });

    Vue.http.get('https://api.twitch.tv/helix/users/', requestOptions).then((response) => {
      if (response.status === 200 && typeof response.body !== 'undefined') {
        response.body.data.forEach((user) => {
          self.streamsData.forEach((channel, index) => {
            if (channel.channel === user.login) {
              self.streamsData[index].channelData = user;
            }
          });
        });
        self.checkStreamsStatus();
        setInterval(() => {
          self.checkStreamsStatus();
        }, 600000);
      }
    }, (response) => {
      window.eventBus.$emit('error', { source: 'streamList', data: response });
    });
  },
};
</script>

<style lang="scss">
.stream-list {
  &-wrapper {
    position: relative;
  }

  &-users {
    position: absolute;
    left: 0;
    top: 0;
    width: 25%;

    @media screen and (min-width: $screen-md) {
      width: 10%;
    }

    @media screen and (min-width: $screen-lg) {
      width: 8%;
    }
  }

  &-user {
    box-shadow: none;
    border:0;
    display: block;
    cursor: pointer;
    margin-bottom: 10px;
    outline: 0;
    padding: 0;

    img {
      display: block;
      filter: grayscale(100%);
      height: auto;
      max-width: 100%;
    }

    &.live {
      img {
        filter: none;
      }
    }

    &.active {
      img {
        outline: 2px solid $primary;
        outline-offset: -6px;
      }
    }
  }

  &-players {
    margin-left: 25%;
    min-height: 480px;
    position: relative;
    width: 75%;

    @media screen and (min-width: $screen-md) {
      margin-left: 10%;
      width: 90%;
    }

    @media screen and (min-width: $screen-lg) {
      margin-left: 8%;
      width: 92%;
    }

    > div {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      opacity: 0;
      transition: opacity ease-in-out .3s;

      &.active {
        opacity: 1;
        z-index: 3;
      }
    }
  }
}
</style>
