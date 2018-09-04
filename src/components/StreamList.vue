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
          <img :src="stream.channelData.logo" :alt="stream.channel" :title="stream.channel">
        </button>
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
          channel: 'name',
          channelData: [],
          streamData: [],
          isLive: false,
        },
      ],
      activeStream: 'name',
    };
  },
  methods: {
    changeStream(stream) {
      this.activeStream = stream;
    },
  },
  mounted() {
    const self = this;
    self.streamsData.forEach((item, index) => {
      self.$http.get(`https://api.twitch.tv/kraken/channels/${item.channel}?client_id=${process.env.TWITCH_ID}`).then((response) => {
        if (response.status === 200 && typeof response.body !== 'undefined') {
          self.streamsData[index].channelData = response.body;
        }
      // TODO: Error handling
      // eslint-disable-next-line
      }, (response) => {
        // eslint-disable-next-line
        console.log(response);
      });
    });
  },
  watch: {
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
    min-height: calc(100vh - 280px);
    position: relative;
    width: 75%;

    @media screen and (min-width: $screen-md) {
      margin-left: 10%;
      width: 90%;
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
