<template>
  <div class="streamer-about">
    <img
      :src="channelData.profile_image_url"
      :alt="channel"
      :title="channel">
    <h1>{{ channelData.display_name }}</h1>
    <p>{{ channelData.description }}</p>
  </div>
</template>

<script>
import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

export default {
  name: 'StreamerAbout',
  data() {
    return {
      channel: this.$route.params.channel,
      channelData: [],
    };
  },
  mounted() {
    const self = this;
    const requestOptions = {
      headers: { 'Client-ID': process.env.TWITCH_ID },
      params: {
        login: self.channel,
      },
    };

    Vue.http.get('https://api.twitch.tv/helix/users/', requestOptions).then((response) => {
      if (response.status === 200 && typeof response.body !== 'undefined') {
        self.channelData = response.body.data[0];
      }
    }, (response) => {
      window.eventBus.$emit('error', { source: 'streamerAbout', data: response });
    });
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
