<template>
  <div id="app" v-if="isReady">
    <router-link class="logo" to="/">
      <img src="@/assets/OlympeakGaming.svg">
    </router-link>
    <div class="nav">
      <a href="https://twitch.tv/olympeakgaming" target="_blank">
        <font-awesome-icon :icon="['fab', 'twitch']" />
        Twitch
      </a>
      <a href="https://twitter.com/olympeakgaming" target="_blank">
        <font-awesome-icon :icon="['fab', 'twitter']" />
        Twitter
      </a>
      <a href="https://discord.me/olympeakgaming" target="_blank">
        <font-awesome-icon :icon="['fab', 'discord']" />
        Discord
      </a>
      <a href="https://facebook.com/olympeakgaming" target="_blank">
        <font-awesome-icon :icon="['fab', 'facebook']" />
        Facebook
      </a>
    </div>
    <router-view/>
    <div class="footer">
      Réalisation : Cédric D. - Olympeak Gaming ©{{ new Date().getFullYear() }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueResource from 'vue-resource';
import db from './main';

Vue.use(VueResource);

export default {
  name: 'App',
  data() {
    return {
      isReady: false,
      streamers: [],
    };
  },
  methods: {
    checkChannelData() {
      const self = this;
      const needUpdating = [];

      self.streamers.forEach((streamer) => {
        // if streamer was never updated or it's been more than 15 days since last update
        if (typeof streamer.last_update === 'undefined' || Math.round(Math.abs(new Date() - streamer.last_update.toDate()) / 8.64e7) >= 15) {
          needUpdating.push(streamer.login);
        }
      });

      if (needUpdating.length > 0) {
        const requestOptions = {
          headers: { 'Client-ID': process.env.TWITCH_ID },
          params: {
            login: needUpdating,
          },
        };

        Vue.http.get('https://api.twitch.tv/helix/users/', requestOptions).then((response) => {
          if (response.status === 200 && typeof response.body !== 'undefined') {
            response.body.data.forEach((user) => {
              self.streamers.forEach((streamer, index) => {
                if (needUpdating.findIndex(channel => channel === streamer.login) > -1
                  && streamer.login === user.login) {
                  const data = {
                    display_name: user.display_name,
                    broadcaster_type: user.broadcaster_type,
                    description: user.description,
                    profile_image_url: user.profile_image_url,
                    user_id: user.id,
                  };

                  db.collection('streamers').doc(self.streamers[index].id).get()
                    .then((origDoc) => {
                      if (origDoc.exists) {
                        const finalDoc = Object.assign(origDoc.data(), data);
                        finalDoc.last_update = new Date();
                        db.collection('streamers').doc(self.streamers[index].id).set(finalDoc);
                      }
                    });
                }
              });
            });
          }
        }, (response) => {
          window.eventBus.$emit('error', { source: 'streamList', data: response });
        });
      }
    },
  },
  watch: {
    isReady(b) {
      if (b) {
        this.streamers = this.$streamers;
        this.checkChannelData();
      }
    },
  },
  created() {
    // Load streamers from db
    db.collection('streamers').get()
      .then((q) => {
        Vue.prototype.$streamers = [];
        q.forEach((streamer) => {
          const tmp = streamer.data();
          tmp.id = streamer.id;
          Vue.prototype.$streamers.push(tmp);
        });
        this.isReady = true;
      })
      .catch((error) => {
        window.eventBus.$emit('error', { source: 'app', data: error });
      });

    // Init error handling
    window.onerror = (error, url, line) => {
      window.eventBus.$emit('error', { source: 'console', data: `New error: ERR:${error}, URL:${url}, L:${line}` });
    };
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Oswald:300,600,700');

body {
  background: $background;
  color: #FFF;
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

  @media screen and (min-width: $screen-lg) {
    width: $screen-lg;
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

.nav a[href] {
  margin: 8px 15px 15px;

  @media screen and (min-width: $screen-md) {
    margin-top: 0;
  }
}

a.logo {
  display: inline-block;
  height: 180px;
  margin: 0 auto;
  overflow: hidden;
  width: 180px;

  img {
    height: 250px;
    margin-left: -39px;
    margin-top: -40px;
    width: 250px;
  }
}

.footer {
  font-size: 65%;
  font-weight: 300;
  margin-top: 10px;
  padding-bottom: .8rem;
  opacity: .5;
}
</style>
