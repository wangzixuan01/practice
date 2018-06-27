<template>
  <div>
    {{$store.state.count}}
    {{count1}}
    {{count2}}
    <!--<button @click="$store.commit('add',10)">add</button>
    <button @click="$store.commit('reduce')">reduce</button>-->
    <button @click="addAction">add</button>
    <button @click="reduceAction">reduce</button>
  </div>
</template>

<script>
  import ComponentB from "./ComponentB.vue"
  import ComponentC from "./ComponentC.vue"
  import  {mapState,mapMutations,mapGetters,mapActions} from 'vuex';
  export default {
    data(){
      return{
        c:'1111'
      }
    },
    methods:{
      /*change(arg){
        this.c = arg;
      }*/
      ...mapMutations(['add','reduce']),
      ...mapActions(['addAction','reduceAction'])
    },
    computed:{
      ...mapState(["count","count1"]),
      ...mapGetters(['count2'])
    },
    components:{
      ComponentB,
      ComponentC
    }
  }
</script>
