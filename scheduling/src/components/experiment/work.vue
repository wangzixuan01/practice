<template>
  <div class="main">
    <h3>说明：该实验作业提交的时间不同，为了便于展示设置为0、1、2、3...</h3>
    <queue class="mg"></queue>
    <short class="mg"></short>
    <response class="mg"></response>
    <compare class="mg"></compare>
  </div>
</template>
<script>
  import Queue from '../work/queue.vue';
  import Short from '../work/short.vue';
  import Response from '../work/response.vue';
  import Compare from '../work/compare.vue';
  export default {
    components: {
      Queue,
      Short,
      Response,
      Compare
    }
  };
</script>
<style lang="scss" scoped>
  .main {
    padding: 10px 50px;
  }
  .mg {
    margin: 30px 0;
  }
</style>




