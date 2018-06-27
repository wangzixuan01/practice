<template>
  <div class="tab">
    <el-menu :default-active="activeIndex === '/' ? '1' : activeIndex" class="el-menu-demo" mode="horizontal">

      <router-link to="/work" tag="span">
        <el-menu-item index="2">
          作业调度
        </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeIndex: location.href.substr(-1, 1)
      };
    }
  };
</script>

<style lang="scss" scoped>
  .tab {
    text-align: center;
    .el-menu-demo {
      display: inline-block;
    }
  }
  .is-active {
    border-bottom: 2px solid #409eff;
    color: #2d2f33;
  }
</style>


