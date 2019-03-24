<template>
  <div class="dashboard" v-cloak>
    <img class="pp" :src="user.photoURL" :alt="user.displayName" />
    Bienvenue {{ user.displayName }} ({{ user.channel }}) !
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
};
</script>

<style lang="scss">
.pp {
  border-radius: 50%;
  display: inline-block;
  height: 30px;
  vertical-align: middle;
  width: 30px;
}
</style>
