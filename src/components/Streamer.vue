<template>
  <div class="streamer">
    <streamer-nav></streamer-nav>
    <router-view v-if="isOG"></router-view>
  </div>
</template>

<script>
import StreamerNav from './StreamerNav';

export default {
  name: 'Streamer',
  components: { StreamerNav },
  computed: {
    isOG() {
      const self = this;
      if (self.$streamers) {
        if (typeof self.$streamers.find(streamer => streamer.login === self.$route.params.channel) === 'undefined') {
          self.$router.push({ path: '/' });
        }
        return true;
      }
      return false;
    },
  },
};
</script>
