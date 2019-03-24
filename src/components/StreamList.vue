<template>
  <div class="stream-list">
    <div class="stream-list-wrapper">
      <div class="stream-list-users" ref="streamersList">
        <button
          class="stream-list-user"
          v-for="stream in filteredStreamers"
          :key="stream.login"
          :class="[
            { live: livestreams[stream.login] && livestreams[stream.login].length > 0 },
            { active: activeStream === stream.login },
          ]"
          @click="changeStream(stream.login)"
        >
          <img :src="stream.profile_image_url" :alt="stream.login" :title="stream.login" />
          <font-awesome-icon :icon="['fas', 'external-link-square-alt']"></font-awesome-icon>
        </button>
      </div>
      <div class="stream-list-players" ref="streamersPlayer">
        <single-stream
          v-for="stream in filteredStreamers"
          :key="stream.login"
          :class="{ active: activeStream === stream.login }"
          :streamer-channel="stream.login"
          :is-active="activeStream === stream.login"
        >
        </single-stream>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { config } from '@/config';
import SingleStream from '@/components/SingleStream';

export default {
  name: 'StreamList',
  components: { SingleStream },
  data() {
    return {
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
      axios
        .get('https://api.twitch.tv/helix/streams/', {
          headers: { 'Client-ID': config.twitch.twitchClientId },
          params: {
            user_id: self.streamers.map(streamer => streamer.user_id),
          },
        })
        .then(response => {
          if (response.status === 200 && typeof response.data !== 'undefined') {
            const responseData = response.data.data;
            self.streamers.forEach(channel => {
              const liveData = responseData.find(stream => stream.user_id === channel.user_id);
              this.$store.dispatch('updateLastLive', {
                docId: channel.id,
                login: channel.login,
                data: typeof liveData === 'undefined' ? [] : liveData,
              });
            });
          }
        });
    },
  },
  computed: {
    streamers() {
      return this.$store.state.streamers;
    },
    livestreams() {
      return this.$store.state.livestreams;
    },
    filteredStreamers() {
      const self = this;
      return self.streamers.sort((a, b) => {
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
        return a.position < b.position ? -1 : 1;
      });
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
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 60px 1fr;

    @media screen and (min-width: $screen-md) {
      grid-template-columns: 1fr 4fr;
      grid-template-rows: 480px;
    }
  }

  &-users {
    overflow-y: hidden;
    text-align: left;

    @media screen and (min-width: $screen-md) {
      overflow-y: auto;
      justify-self: end;
    }
  }

  &-user {
    box-shadow: none;
    border: 0;
    display: inline-block;
    cursor: pointer;
    max-width: 60px;
    outline: 0;
    padding: 0;
    position: relative;

    @media screen and (min-width: $screen-md) {
      display: block;
      margin-bottom: 10px;
      max-width: 80px;
    }

    img {
      display: block;
      filter: grayscale(100%);
      height: auto;
      max-width: 100%;
    }

    &:hover {
      img {
        filter: grayscale(75%);
        outline: 2px solid #fff;
        outline-offset: -4px;
      }
    }

    .svg-inline--fa {
      display: none;
      bottom: 50%;
      color: #fff;
      height: auto;
      position: absolute;
      right: 50%;
      transform: translate(50%, 50%);
      width: 60%;
      z-index: 2;

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

      &::after {
        animation: 15s infinite linear fadeInOut;
        bottom: 6px;
        color: #fff;
        content: 'Live 🔴';
        display: block;
        font-weight: bold;
        left: 50%;
        position: absolute;
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000, 1px 1px 0 #000;
        transform: translateX(-50%);
        white-space: nowrap;

        @media screen and (min-width: $screen-md) {
          font-size: 16px;
          left: 8px;
          transform: none;
        }
      }
    }

    &.active {
      img {
        outline: 2px solid $primary;
        outline-offset: -4px;
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
    position: relative;

    @media screen and (min-width: $screen-md) {
      min-height: 480px;
    }

    > div {
      bottom: 0;
      left: 0;
      opacity: 0;
      position: absolute;
      right: 0;
      top: 0;
      transition: opacity ease-in-out 0.3s;

      &.active {
        display: block;
        opacity: 1;
      }
    }
  }
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  80% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
