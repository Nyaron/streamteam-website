<template>
  <div class="home">
    <stream-list></stream-list>
  </div>
</template>

<script>
import StreamList from './StreamList';

export default {
  name: 'Home',
  components: { StreamList },
};
</script>
