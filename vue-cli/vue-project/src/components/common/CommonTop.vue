<template>
  <div class="footer">
    <ul>
      <li>top150</li>
      <li>正在上映</li>
      <li>即将上映</li>
    </ul>
  </div>
</template>

<script>

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .footer{
    height    : 1rem;
    background: rgb(33, 150, 243);
    position  : fixed;
    top    : 1rem;
    width     : 100%;
  }
  .footer ul{
    display: flex;
  }
  .footer li{
    flex       : 1;
    color      : #fff;
    line-height: 1rem;
    text-align : center;
  }
  </style>
