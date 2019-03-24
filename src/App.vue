<template>
  <div id="app" v-cloak>
    <h1 class="title">
      <router-link class="logo" to="/">
        <img src="@/assets/og-logo.svg" />
      </router-link>
      Olympeak Gaming
    </h1>
    <router-view />
    <div class="nav">
      <a href="https://twitch.tv/olympeakgaming" target="_blank" rel="noopener">
        <font-awesome-icon :icon="['fab', 'twitch']" />
        Twitch
      </a>
      <a href="https://twitter.com/olympeakgaming" target="_blank" rel="noopener">
        <font-awesome-icon :icon="['fab', 'twitter']" />
        Twitter
      </a>
      <a href="https://discord.me/olympeakgaming" target="_blank" rel="noopener">
        <font-awesome-icon :icon="['fab', 'discord']" />
        Discord
      </a>
      <a href="https://facebook.com/olympeakgaming" target="_blank" rel="noopener">
        <font-awesome-icon :icon="['fab', 'facebook']" />
        Facebook
      </a>
    </div>
    <footer class="footer">
      Réalisation : Cédric D. pour Olympeak Gaming ©{{ new Date().getFullYear() }}
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
import { config } from './config';

export default {
  name: 'App',
  methods: {
    checkChannelData() {
      const needUpdating = [];

      this.$store.state.streamers.forEach(streamer => {
        // if streamer was never updated or it's been more than 15 days since last update
        if (
          typeof streamer.last_update === 'undefined' ||
          Math.round(Math.abs(new Date() - streamer.last_update.toDate()) / 8.64e7) >= 15
        ) {
          needUpdating.push(streamer.login);
        }
      });

      if (needUpdating.length > 0) {
        axios
          .get('https://api.twitch.tv/helix/users/', {
            headers: { 'Client-ID': config.twitch.twitchClientId },
            params: {
              login: needUpdating,
            },
          })
          .then(response => {
            if (response.status === 200 && typeof response.data !== 'undefined') {
              response.body.data.forEach(user => {
                this.$store.state.streamers.forEach(streamer => {
                  if (
                    needUpdating.findIndex(channel => channel === streamer.login) > -1 &&
                    streamer.login === user.login
                  ) {
                    const data = {
                      display_name: user.display_name,
                      broadcaster_type: user.broadcaster_type,
                      description: user.description,
                      profile_image_url: user.profile_image_url,
                      user_id: user.id,
                    };

                    this.$store.dispatch('updateLastUpdate', { docId: streamer.id, data: data });
                  }
                });
              });
            }
          });
      }
    },
  },
  created() {
    this.$store.dispatch('checkStreamers');
  },
  mounted() {
    this.checkChannelData();

    // Init kb shortcuts handling
    document.onkeyup = event => {
      if (event.ctrlKey && event.shiftKey && event.which === 76) {
        // Ctrl + Shift + L
        this.$router.push({ name: 'login' });
      }
    };
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Oswald:300,600,700');

body {
  background: $background;
  color: #fff;
  font-family: Oswald, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 18px;
  margin: 0;
  padding: 0;
}

#app {
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;

  @media screen and (min-width: $screen-md) {
    width: $screen-md;
  }
}

a[href] {
  color: $primary;
  display: inline-block;
  text-decoration: none;

  &:hover {
    color: inherit;
  }
}

.title {
  color: $primary;
  font-weight: 700;
}

.nav a[href] {
  margin: 8px 15px 15px;
}

a.logo {
  display: inline-block;
  margin: 0 auto;
  vertical-align: middle;

  img {
    height: 80px;
    width: 80px;

    @media screen and (min-width: $screen-md) {
      height: 120px;
      width: 120px;
    }
  }
}

.footer {
  font-size: 80%;
  font-weight: 300;
  margin-top: 10px;
  padding-bottom: 0.8rem;
  opacity: 0.5;
}
</style>
