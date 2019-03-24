<template>
  <div class="stream-single"></div>
</template>

<script>
import Vue from 'vue';
import LoadScript from 'vue-plugin-load-script';

Vue.use(LoadScript);

export default {
  name: 'SingleStream',
  props: {
    streamerChannel: String,
    isActive: Boolean,
    showChat: Boolean,
  },
  data() {
    return {
      embed: null,
    };
  },
  methods: {
    loadPlayer() {
      const self = this;
      Vue.loadScript('https://embed.twitch.tv/embed/v1.js').then(() => {
        // eslint-disable-next-line no-undef
        self.embed = new Twitch.Embed(self.$el, {
          theme: 'dark',
          channel: self.streamerChannel,
          layout: self.showChat ? 'video-with-chat' : 'video',
        });

        // eslint-disable-next-line no-undef
        self.embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
          const player = self.embed.getPlayer();
          player.play();
        });
      });
    },
  },
  watch: {
    isActive(b) {
      if (b) {
        if (this.embed !== null) {
          this.embed.getPlayer().play();
        } else {
          this.loadPlayer();
        }
      } else if (this.embed !== null) {
        this.embed.getPlayer().pause();
      }
    },
  },
  mounted() {
    const self = this;
    if (self.isActive) {
      self.loadPlayer();
    }
  },
};
</script>

<style lang="scss">
.stream-single {
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;

  > iframe {
    border: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
}
</style>
