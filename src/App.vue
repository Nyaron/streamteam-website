<template>
  <div id="app">
    <div class="logo">
      <img src="@/assets/OlympeakGaming.svg">
    </div>
    <div class="nav">
      <a href="https://twitch.tv/olympeakgaming" target="_blank">
        <font-awesome-icon :icon="['fab', 'twitch']" />
        Twitch
      </a>
      <a href="https://twitter.com/olympeakgaming" target="_blank">
        <font-awesome-icon :icon="['fab', 'twitter']" />
        Twitter
      </a>
      <a href="https://facebook.com/olympeakgaming" target="_blank">
        <font-awesome-icon :icon="['fab', 'facebook']" />
        Facebook
      </a>
    </div>
    <router-view/>
    <div class="footer">
      Réalisation : Cédric D.
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';

fontawesome.library.add(brands);

export default {
  name: 'App',
  components: {
    FontAwesomeIcon,
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

.logo {
  display: inline-block;
  height: 180px;
  overflow: hidden;
  width: 180px;

  img {
    height: 250px;
    margin-left: -39px;
    margin-top: -40px;
    width: 250px;
  }
}

a[href] {
  color: $primary;
  display: inline-block;
  margin: 8px 15px 15px;
  text-decoration: none;

  &:hover {
    color: inherit;
  }
}

.footer {
  font-size: 75%;
  font-weight: 300;
  margin-top: 10px;
  opacity: .5;
}
</style>
