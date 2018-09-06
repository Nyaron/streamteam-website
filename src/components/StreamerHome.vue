<template>
  <div class="streamer-home">
    <single-stream
      :streamer-channel="channel"
      is-active
      show-chat
      >
    </single-stream>
  </div>
</template>

<script>
import SingleStream from './SingleStream';

export default {
  name: 'StreamerHome',
  components: { SingleStream },
  data() {
    return {
      channel: this.$route.params.channel,
    };
  },
};
</script>
