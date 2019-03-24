<template>
  <div class="nav streamer-nav">
    <div class="nav-title" :title="streamerType | capitalize">
      {{ channel | capitalize }}
      <font-awesome-icon
        v-if="streamerType !== ''"
        :icon="
          streamerType === 'affiliate' ? 'star' : streamerType === 'partner' ? 'check-circle' : ''
        "
      >
      </font-awesome-icon>
    </div>
    <router-link to="/" :style="{ color: genColor }" exact>
      Accueil
    </router-link>
    <router-link
      :to="{ name: 'streamer-home', params: { channel: channel } }"
      :style="{ color: genColor }"
      exact
    >
      Stream
    </router-link>
    <router-link
      :to="{ name: 'about', params: { channel: channel } }"
      :style="{ color: genColor }"
      exact
    >
      À propos
    </router-link>
    <router-link
      :to="{ name: 'schedule', params: { channel: channel } }"
      :style="{ color: genColor }"
      exact
    >
      Planning
    </router-link>
  </div>
</template>

<script>
const generate = require('string-to-color');

export default {
  name: 'StreamerNav',
  data() {
    return {
      channel: this.$route.params.channel,
      genColor: generate(this.$route.params.channel),
    };
  },
  computed: {
    streamerType() {
      const self = this;
      if (self.$store.state.streamers) {
        const curr = self.$store.state.streamers.find(
          streamer => streamer.login === self.$route.params.channel
        );
        return curr.broadcaster_type ? curr.broadcaster_type : '';
      }
      return '';
    },
  },
};
</script>

<style lang="scss">
.streamer-nav {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2em;
  color: $primary;
  display: inline-block;
  margin-bottom: 15px;
  padding: 0.5em;

  a[href],
  .nav-title {
    margin: 0 15px;
  }

  .nav-title {
    cursor: default;
    display: inline-block;
  }

  .router-link-active {
    text-decoration: underline;
  }
}
</style>
