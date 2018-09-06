<template>
  <div class="nav streamer-nav">
    <div class="nav-title">{{ channel | capitalize }}</div>
    <router-link
      to="/"
      :style="{ color: genColor }"
      exact>
      Accueil
    </router-link>
    <router-link
      :to="{ name: 'streamer-home', params: { channel: channel }}"
      :style="{ color: genColor }"
      exact>
      Stream
    </router-link>
    <router-link
      :to="{ name: 'about', params: { channel: channel }}"
      :style="{ color: genColor }"
      exact>
      À propos
    </router-link>
    <router-link
      :to="{ name: 'schedule', params: { channel: channel }}"
      :style="{ color: genColor }"
      exact>
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
};
</script>

<style lang="scss">
.streamer-nav {
  background-color: rgba(255, 255, 255, .1);
  border-radius: 2em;
  color: $primary;
  display: inline-block;
  margin-bottom: 15px;
  padding: .5em;

  a[href],
  .nav-title {
    margin: 0 15px;
  }

  .nav-title {
    display: inline-block;

    &::after {
      content: "⚡";
      display: inline-block;
      margin-left: .5em;
    }
  }

  .router-link-active {
    text-decoration: underline;
  }
}
</style>
