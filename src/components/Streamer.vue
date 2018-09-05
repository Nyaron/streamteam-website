<template>
  <div class="streamer">
    <streamer-nav :channel="channel"></streamer-nav>
    <single-stream
      :streamer-channel="channel"
      is-active
      show-chat
      >
    </single-stream>
  </div>
</template>

<script>
import StreamerNav from './StreamerNav';
import SingleStream from './SingleStream';

export default {
  name: 'Streamer',
  components: { StreamerNav, SingleStream },
  data() {
    return {
      channel: this.$route.params.channel,
    };
  },
};
</script>
