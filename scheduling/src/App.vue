<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <transition name="slide-fade">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header.vue';
  import Tab from 'components/tab/tab.vue';
  export default {
    components: {
      MHeader,
      Tab
    }
  };
</script>

<style lang="scss" scoped>
  .slide-fade-enter-active, .slide-fade-leave-active  {
    transition: all 0.3s ease;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
</style>

