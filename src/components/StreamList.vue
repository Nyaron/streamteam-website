<template>
  <div class="stream-list">
    <div class="stream-list-wrapper">
      <div class="stream-list-users">
        <button
          class="stream-list-user"
          v-for="stream in filteredStreamers"
          :key="stream.login"
          :class="[{live: liveStreams[stream.login] && liveStreams[stream.login].length > 0},
          {active: activeStream === stream.login}]"
          @click="changeStream(stream.login)">
          <img
            :src="stream.profile_image_url"
            :alt="stream.login"
            :title="stream.login">
          <font-awesome-icon :icon="['fas', 'external-link-square-alt']"></font-awesome-icon>
        </button>
      </div>
      <div class="stream-list-players">
        <single-stream
          v-for="stream in filteredStreamers"
          :key="stream.login"
          :class="{active: activeStream === stream.login}"
          :streamer-channel="stream.login"
          :is-active="activeStream === stream.login"
          >
        </single-stream>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueResource from 'vue-resource';

import db from '../main';
import SingleStream from './SingleStream';

Vue.use(VueResource);

export default {
  name: 'StreamList',
  components: { SingleStream },
  data() {
    return {
      liveStreams: [],
      activeStream: 'olympeakgaming',
    };
  },
  methods: {
    changeStream(stream) {
      if (this.activeStream !== stream) {
        this.activeStream = stream;
      } else {
        this.$router.push({ name: 'streamer-home', params: { channel: stream } });
      }
    },
    checkStreamsStatus() {
      const self = this;
      const requestOptions = {
        headers: { 'Client-ID': process.env.TWITCH_ID },
        params: {
          user_login: [],
        },
      };

      self.filteredStreamers.forEach((stream) => {
        requestOptions.params.user_login.push(stream.login);
      });

      Vue.http.get('https://api.twitch.tv/helix/streams/', requestOptions).then((response) => {
        if (response.status === 200 && typeof response.body !== 'undefined') {
          self.filteredStreamers.forEach((channel, index) => {
            const t = response.body.data.findIndex(stream =>
              stream.user_id === channel.user_id);
            if (t > -1) {
              self.liveStreams[channel.login] = response.body.data[t];
              db.collection('streamers').doc(self.filteredStreamers[index].id).get()
                .then((origDoc) => {
                  if (origDoc.exists) {
                    const finalDoc = origDoc.data();
                    finalDoc.last_live = new Date();
                    db.collection('streamers').doc(self.filteredStreamers[index].id).set(finalDoc);
                  }
                });
            } else {
              self.liveStreams[channel.login] = [];
            }
          });
        }
      }, (response) => {
        window.eventBus.$emit('error', { source: 'streamList', data: response });
      });
    },
  },
  computed: {
    filteredStreamers() {
      const self = this;
      if (self.$streamers) {
        return self.$streamers.sort((a, b) => {
          // Sort streamers per position then by last live
          if (a.position === b.position) {
            const aLive = a.last_live.toDate();
            const bLive = b.last_live.toDate();
            if (aLive < bLive) {
              return 1;
            }
            if (aLive > bLive) {
              return -1;
            }
            return 0;
          }
          return (a.position < b.position) ? 1 : -1;
        });
      }
      return [];
    },
  },
  mounted() {
    this.checkStreamsStatus();
    window.setInterval(() => {
      this.checkStreamsStatus();
    }, 600000);
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
    position: relative;

    img {
      display: block;
      filter: grayscale(100%);
      height: auto;
      max-width: 100%;
    }

    .svg-inline--fa {
      display: none;
      bottom: 50%;
      color: #FFF;
      height: auto;
      position: absolute;
      right: 50%;
      transform: translate(50%, 50%);
      width: 60%;

      @media screen and (min-width: $screen-md) {
        bottom: 8px;
        right: 8px;
        transform: none;
        width: 20%;
      }
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

      .svg-inline--fa {
        display: block;
      }

      &:hover {
        .svg-inline--fa {
          bottom: 50%;
          right: 50%;
          transform: translate(50%, 50%);
          width: 60%;
        }
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
