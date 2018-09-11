<template>
  <div class="streamer-about">
    <img
      :src="filteredStreamer.profile_image_url"
      :alt="channel"
      :title="channel">
    <h1>{{ filteredStreamer.display_name }}</h1>
    <p>{{ filteredStreamer.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'StreamerAbout',
  data() {
    return {
      channel: this.$route.params.channel,
    };
  },
  computed: {
    filteredStreamer() {
      if (this.$streamers) {
        return this.$streamers.find(streamer => streamer.login === this.channel);
      }
      return [];
    },
  },
};
</script>

<style lang="scss">
.streamer-about {
  @media screen and (min-width: $screen-md) {
    margin-left: auto;
    margin-right: auto;
    width: 800px;
  }
  img {
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 50%;
    height: 50px;
    padding: .25rem;
    width: 50px;

    @media screen and (min-width: $screen-lg) {
      height: 100px;
      width: 100px;
    }
  }

  p {
    text-align: justify;
  }
}
</style>
