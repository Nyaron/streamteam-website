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
      options: {
        height: 480,
        width: 940,
      },
    };
  },
  methods: {
    loadPlayer() {
      const self = this;
      Vue.loadScript('https://embed.twitch.tv/embed/v1.js').then(() => {
        // eslint-disable-next-line no-undef
        self.embed = new Twitch.Embed(self.$el, {
          width: self.options.width,
          height: self.options.height,
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
