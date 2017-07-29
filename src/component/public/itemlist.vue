<template>
          <div class="rightMainList">
      <div class="ctrlContent">
          <ul>
              <li class="clearfix" v-for="item in itemlist.list">
                  <div class="i-pic fl" @click="itemdetail(item)">
                      <img src="http://www.wookmark.com/images/thumbs/627857_wookmark.jpg" :src="item.image">
                  </div>
                  <div class="descText ofh" v-if="!initdata==''">
                      <h3>{{item.name}}</h3>
                      <p class="subTit"><span>月销{{item.m_sales}}</span><i class="tag-b" v-if="item.ishot==1">推荐</i></p>
                      <p class="price">￥<em v-text="item.price"></em><i v-if="isOpts(item)">起</i></p>
                      <div class="setDiv quantity" v-if="isOpts(item)">
                           <span class="oBtn" data="p1" :class="item.instock<1?'disabled':''" @click="itemWindowClick(item)">选规格</span>
                      </div>
                      <div class="setDiv quantity"  v-else>
                          <span class="minus reduceFromCart iconfont i-reduce" @click="reduceto(item,$event)" v-show="numBtnIsShow(initdata,item.id)"></span>
                          <span class="num" v-show="numBtnIsShow(initdata,item.id)">{{initdata.list[(item.id)]?initdata.list[(item.id)].num:0}}</span>
                          <span class="plus addToCart iconfont i-add" :class="item.instock<1?'disabled':''" @click="addto(item,$event)"></span>
                      </div>
                  </div>
                  <div class="descText ofh" v-if="initdata==''">
                      <h3>{{item.name}}</h3>
                      <p class="subTit"><span>月销{{item.m_sales}}</span><i class="tag-b" v-if="item.ishot==1">推荐</i></p>
                      <p class="price">￥<em v-text="item.price"></em><i v-if="isOpts(item)">起</i></p>
                      <div class="setDiv quantity" v-if="isOpts(item)">
                           <span class="oBtn" data="p1" :class="item.instock<1?'disabled':''" @click="itemWindowClick(item)">选规格</span>
                      </div>
                      <div class="setDiv quantity"  v-else>
                          <span class="minus reduceFromCart iconfont i-reduce" @click="reduceto(item,$event)"  v-show="false"></span>
                          <span class="num" v-show="false">0</span>
                          <span class="plus addToCart iconfont i-add" :class="item.instock<1?'disabled':''" @click="addto(item,$event)"></span>
                      </div>
                  </div>
              </li>
          </ul>
      </div>
    </div>
</template>
<script type="text/javascript">
    export default {
        data() {
        return {
          token:'',
          sn:'',
        }
      },
      props:['itemlist','itemWindowClick','addto','reduceto','initdata'],
      mounted: function() {
       this.token=this.$router.currentRoute.params.token
       this.sn=this.$router.currentRoute.params.sn
        console.log(this.itemlist)
        console.log(this.initdata)
      },
      components:{
     
      },
      computed:{

      },
      methods:{
        itemdetail(item){
        //window.localStorage.setItem('ITEM_DETAIL_DATA',JSON.stringify(item));
        console.log(item)
        //this.$router.go('/'+this.token+'/itemdetail/'+this.storeInfoData.id+'/'+item.sid+'/'+item.id);
        this.$router.push({ path: '/itemdetail/'+this.token+'/'+item.cid+'/'+item.sid+'/'+item.id+'/'+this.sn})
        },

        getInitDishInfo(key){
          var obj = this.initdata;
          for(key in obj) {
              console.log(key)
              //遍历对象，k即为key，obj[k]为当前k对应的值
              console.log(obj[key]);
              return key
          }        
        },
        isOpts:function(obj){
          var flag=false;
          if(obj.opts){
            flag=true
          }
          return flag
        },
        numBtnIsShow:function(obj,id){
          var flag=false
          var thisId=obj.list[id]
          var thisNum=''
          // alert(thisId)

          if(thisId){
            thisNum=thisId.num
            if(thisNum && thisNum>0){
              flag=true
            }
          }
          return flag
        }        
      }
    }
</script>
<style type="text/css" scoped>
  .rightMainList li .oBtn{display: block!important}
  .rightMainList li .oBtnThis{display: none}
</style>