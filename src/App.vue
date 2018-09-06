<template>
  <div id="app">
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
export default {
  name: 'App',
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
