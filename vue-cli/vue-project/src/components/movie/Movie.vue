<template>
  <div class="movie">
    <common-header title="movie" bgColor="rgb(33,150,243)"></common-header>
    <common-top></common-top>
    <router-view></router-view>
    <div class="loading" v-show="isShow">
      <img src="/static/img/loading.gif" alt="">
    </div>
    <common-footer bgColor="rgb(33,150,243)"></common-footer>
  </div>
</template>
<script>
  import CommonHeader from "../common/CommonHeader.vue"
  import CommonFooter from "../common/CommonFooter.vue"
  import CommonTop from "../common/CommonTop.vue"
  import CommonList from "../common/CommonList.vue"
  import Axios from  "axios"
  export  default {
    data () {
      return{
        movieList:[],
        isShow :false
      }
    },
    mounted(){
      let _this = this;
      window.onscroll = function () {
        let clientHeight = document.documentElement.clientHeight;
        let scrollTop = document.documentElement.scrollTop;
        let scrollHeight = document.documentElement.scrollHeight;
        if(clientHeight + scrollTop >= scrollHeight){
          _this.isShow = true;
          _this.loadData();
            }
        };
      this.loadData();
    },
    methods:{
      loadData(){
        Axios.get(API_PROXY+"http://m.maoyan.com/movie/list.json?type=hot&offset=\"+this.movieList.length+\"&limit=10")
          .then((res)=>{
          this.movieList = this.movieList.concat(res.data.data.movies);
          this.isShow = false;
          });
      }
    },
    components:{
      CommonHeader,
      CommonFooter,
      CommonTop,
      CommonList
    }
  }
</script>
<style scoped=>
  .loading{
    margin-bottom: 2rem;
    text-align: center;
  }
</style>
