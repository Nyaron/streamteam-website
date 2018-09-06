<template>
  <div class="streamer">
    <streamer-nav></streamer-nav>
    <router-view></router-view>
  </div>
</template>

<script>
import StreamerNav from './StreamerNav';

export default {
  name: 'Streamer',
  components: { StreamerNav },
};
</script>
