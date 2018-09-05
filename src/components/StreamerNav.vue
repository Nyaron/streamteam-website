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
      :to="{ name: 'streamer', params: { channel: channel }}"
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
  props: {
    channel: String,
  },
  data() {
    return {
      genColor: generate(this.channel),
    };
  },
};
</script>

<style lang="scss">
.streamer-nav {
  .nav-title {
    display: inline-block;
    font-size: 125%;
    margin: 8px 15px 15px;

    @media screen and (min-width: $screen-md) {
      margin-top: 0;
    }

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
