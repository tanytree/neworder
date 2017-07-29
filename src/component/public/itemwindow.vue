<template>
  <section class="window itemInfo" date="p3">
    <div class="autoWidth">
        <div class="wrap">
            <div class="hd pr">
                <h2>{{attributesdata.name}}</h2><a href="javascript:;" class="windowXclosed pa iconfont i-closed" @click="xclosed()"></a>
            </div>


            <div class="bd" v-if="initdata!=''">
                <div class="tags">
                    <div class="cell" v-if="attributesdata.opts">
                        <h4>规格</h4>
                        <div class="t-list gg"><a href="javascript:;" v-for="(a,index) in attributesdata.opts" @click="clickgg(index)" :class="activegg(index)">{{a.name}}</a></div>
                    </div>
                    <div class="cell" v-if="attributesdata.attr">
                        <h4>属性</h4>
                        <div class="t-list sx"><a href="javascript:;" v-for="(a,index) in multi"  @click="clicksx(index)" :class="activesx(index)">{{a}}</a></div>
                    </div>
                </div>
<!--                 <div class="addPadding  stock stock-row">
                    <div class="fr">
                        <span>{{thisData!=null?thisData.num:singleStock}} 份</span>
                        <span>份</span>
                    </div>
                    <strong>库存</strong>
                </div> -->
                <div class="clearfix addPadding addToCart">
                    <button class="fr addToCartBtn" @click="addNum()" v-if="defaultNum<1 && singleStock>0">加入购物车</button>
                    <button style="background: #a5a5a5;color: #fcfcfc;" class="fr addToCartBtn" v-if="singleStock<1">库存告急</button>
                    <div class="calculate  quantity quantity-row fr" v-show="defaultNum>0">
                      <div class="fr">
                      <span class="minus iconfont i-reduce disable" @click="reduceNum($event)"></span><span class="num">{{defaultNum}}</span><span class="plus iconfont i-add" @click="addNum()"></span>
                      </div>
                    </div>
                    <div class="fl price">
                        ￥<span>{{defaultNum<='0'?attributesdata.opts[ggActive].price:singlePrice}}</span>
                    </div>
                </div>
            </div>


            <div class="bd" v-if="initdata==''">
                <div class="tags">
                    <div class="cell" v-if="attributesdata.opts">
                        <h4>规格</h4>
                        <div class="t-list gg"><a href="javascript:;" v-for="(a,index) in attributesdata.opts" @click="clickgg(index)" :class="activegg(index)">{{a.name}}</a></div>
                    </div>
                    <div class="cell" v-if="attributesdata.attr">
                        <h4>属性</h4>
                        <div class="t-list sx"><a href="javascript:;" v-for="(a,index) in multi"  @click="clicksx(index)" :class="activesx(index)">{{a}}</a></div>
                    </div>
                </div>
<!--                 <div class="calculate  stock stock-row">
                    <div class="fr">
                        <span>{{singleStock}} 份</span>
                    </div>
                    <strong>库存</strong>
                </div> -->
                <div class="clearfix addPadding addToCart">
                    <button class="fr addToCartBtn" @click="addNum()" v-if="defaultNum<1 && singleStock>0">加入购物车</button>
                    <button style="background: #a5a5a5;color: #fcfcfc;" class="fr addToCartBtn" v-if="singleStock<1">库存告急</button>
                    <div class="calculate  quantity quantity-row fr" v-show="defaultNum>0">
                      <div class="fr">
                      <span class="minus iconfont i-reduce" @click="reduceNum($event)"></span><span class="num">{{defaultNum}}</span><span class="plus iconfont i-add" @click="addNum()"></span>
                      </div>
                    </div>
                    <div class="fl price">
                        ￥<span>{{defaultNum<='0'?attributesdata.opts[ggActive].price:singlePrice}}</span>
                    </div>
                </div>
            </div>
<!--             <div class="btn">
                <a href="##">
                    加入购物车
                </a>
            </div> -->

        </div>
    </div>
    <globaltip v-if="tipShow" :tiptext="tiptext"></globaltip>
</section>
</template>
<script type="text/javascript">
  import globaltip from './../public/global.vue'

      export default {
          data() {
            return {
              multi:'',//
              attrText:'',
              ggActive:0,
              sxActive:0,
              defaultNum:0,
              singlePrice:0,
              singleStock:0,
              tipShow:false,
              tiptext:'',
              ggText:'',//规格文字
              sxText:'',//属性文字
              id:'',
              thisData:'',
              sn:'',
              wechaid:0,
              adddefer:false,
              reducedefer:false
            }
          },
          props: ['attributesdata','xclosed','initdata','tipfn','initDishDataFn'],
          mounted: function() {
            if(this.attributesdata.attr!=''){
             this.multi = (this.attributesdata.attr).split(",")
             // console.log(( this.attributesdata))
            }

            // console.log(this.initdata)

            this.id=this.attributesdata.id

          this.sn=JSON.parse(window.localStorage.getItem('SN')|| '[]')
          this.wechaid=JSON.parse(window.localStorage.getItem('wechaId')|| '[]')
            //this.findProduct(this.id,this.initdata.list)
            this.tableId=JSON.parse(window.localStorage.getItem('tableId')|| '[]')

          },          
          components:{
            globaltip
          },
          methods:{
            reduceAndAdd(num,item,callback){
                  var timestamp = Date.parse(new Date())/1000;
                 var dishJsons={
                  "wechaid":this.wechaid,
                  "id":item.id,
                  "cid":item.cid,
                  "sid":item.sid,
                  "name":item.name,
                  "price":item.opts[this.ggActive].price,
                  "image":item.image,
                  "desc":'',
                  "creattime":timestamp,
                  "sort":item.sort,
                  "istakeout":item.istakeout,
                  "isdiscount":item.isdiscount,
                  "instock":item.instock,
                  "refreshstock":item.refreshstock,
                  "kitchen_id":item.kitchen_id,
                  "tmpinstock":item.tmpinstock,
                  "locktime":item.locktime,
                  "m_sales":item.m_sales,
                  "m_name":item.m_name,
                  "is_meal":item.is_meal,
                  "spec":this.ggText,
                  "attr":this.sxText,
                  "num":num
                 }

                 dishJsons=JSON.stringify(dishJsons)
                 var dishJson={
                  sn:this.sn,
                  action:'sync',
                  tableid:this.tableId,
                  timestamp:timestamp,
                  msg:dishJsons
                 }
                 // console.log(dishJson);
                  this.$http.post(SyncDishPath,dishJson,{emulateJSON: true}).then((response) => {
                    callback()
                  }, (response) => {
                  });
            },            
            clickgg(index){
                this.ggActive=index;
                this.defaultNum=0
            },
             clicksx(index){
                this.sxActive=index;
                this.defaultNum=0
            },
            activegg(index){
             // console.log(this.ggActive);
               if(index==this.ggActive){
                    this.singleStock=this.attributesdata.opts[index].inventory
                    this.ggText=this.attributesdata.opts[index].name
                    this.findProduct(this.id,this.ggText,this.sxText,this.initdata.list)
                    if(this.thisData!=null){
                      this.defaultNum=this.thisData.num
                    }else{
                      this.defaultNum=0
                    }
                    this.totalPrice()
                    // console.log(this.thisData)
                   return 'on'
               } else{
                   return ''
               }
            },            
            activesx(index){
             // console.log(this.sxActive);
               if(index==this.sxActive){
                    this.sxText=this.multi[index]
                    this.findProduct(this.id,this.ggText,this.sxText,this.initdata.list)
                    if(this.thisData!=null){
                      this.defaultNum=this.thisData.num
                    }else{
                      this.defaultNum=0
                    }
                    // console.log(this.thisData)
                   return 'on'
               } else{
                   return ''
               }
            },

            totalPrice(){
                this.singlePrice=((this.attributesdata.opts[this.ggActive].price)*this.defaultNum).toFixed(2)
            },
            addNum(){
                var vm=this;
                if(vm.adddefer==true){
                  return
                }
                vm.adddefer=true//开启延时操作********                
                this.totalPrice()
                this.reduceAndAdd(1,this.attributesdata,thisCall)
                 function thisCall(){
                    vm.defaultNum+1
                    window.setTimeout(function(){
                      vm.adddefer=false
                    },1000)
                   console.log(vm.defaultNum)
                 }
            },
            reduceNum($event){
              var vm=this
                if(vm.reducedefer==true){
                  return
                }
                vm.reducedefer=true//开启延时操作              
              if(this.defaultNum<=0){
                var textTip='请添加商品'
                this.tipfn(textTip)
                return
              }else{
                this.totalPrice()
                this.reduceAndAdd(-1,this.attributesdata,thisCall)
                this.initDishDataFn()
              }
             function thisCall(){
                vm.defaultNum-1
                 window.setTimeout(function(){
                    vm.reducedefer=false
                 },1000)              
               console.log(vm.defaultNum)
             }

                Element.prototype.hasClass = function(className){
                  var i,len,temp = this.className.split(" ");
                  for(i = 0,len = temp.length; i < len; i++){
                    if(className == temp[i]){
                    return true;
                    }
                  }
                  return false;
                }
              //   console.log($event)
              //   var thisBoj=$event.target
              //  var disabled=thisBoj.hasClass('disabled')
              // if(!disabled){
              //   console.log($event)
              //   var textTip='请从购物车内减少商品'
              //   this.tipfn(textTip)
              //   return
              // }
            },

        findProduct(id,spec,attr,data){
            // console.log(spec+attr)
            for(var key in data){
              // console.log(data[key].info.spec)
                if(data[key].info.id==id &&data[key].info.spec==spec && data[key].info.attr==attr){
                    // console.log(key)
                    return this.thisData= data[key];
                }
            }
            return this.thisData=null;
        },
      }
      }
</script>

<style type="text/css" scoped>
.window{width: 100%;position: fixed;left: 0;right: 0;z-index: 1009;display: block;top: 25%;}
.window .autoWidth{width: 90%;background: #fff;margin: 0 auto;border-radius: 5px;}
.window .wrap{padding: .5rem .9rem}
.window .hd{border-bottom: 1px solid #eee;padding-bottom: .25rem}
.window .hd h2{font-size: .7rem;font-weight: normal;text-align: center}
.window .hd a.windowXclosed{    
    width: 1.5rem;
    height: 1.5rem;
    right: -.65rem;
    top: -.35rem;
    text-align: center;
    line-height: 1.5rem;
    font-size: 1rem;
  }
.window .bd{}
.window .bd .tags{border-bottom: 1px solid #eee}
.window .bd .tags h4{font-size: .6rem;color: #666;padding: .4rem 0;font-weight: normal}
.window .bd .tags .t-list{}
.window .bd .tags .t-list a{display: inline-block;width: 3rem;height: 1rem;line-height: 1rem;text-align: center;margin-bottom: .25rem;white-space: nowrap;margin-right: .5rem;font-size: .6rem;border-radius: .25rem;overflow: hidden;color: #333;border: 1px solid #eee}
.window .bd .tags .t-list a.on{color: #fff;background: #ff6043}
.window .bd .addPadding{padding: .4rem 0;}
.window .bd .stock  strong{font-weight: normal;color: #666;font-size: .6rem;}
.window .bd .price {color: #f60;font-size: .5rem}
.window .bd .price span{font-size: .6rem}
.window .bd .addToCart{}
.addToCartBtn{    font-size: 0.5rem;
    color: #fff;
    background: #ff6633;
    padding: 0.2rem 0.4rem;
    border-radius: 0.5rem;
    vertical-align: middle;
    line-height: 100%;border:0;}
.window .bd .intro h4{font-size: .74rem;font-weight: normal;color: #666;padding: .4rem 0}
.window .bd .intro .desc{max-height: 5rem;min-height: 2.5rem;overflow: auto}
.window .bd .intro .desc p{line-height: .9rem;font-size: .5rem}
.window .btn{margin-top: .5rem}
.window .btn a{display: block;line-height: 1.75rem;text-align: center;font-size: .7rem;color: #fff;background: #eb4d30;border-radius: .25rem;}
.window .btn a:active{background: #EB3C16}
.window .btn a.disable{    background: #666;
    color: #a9a9a9;}
.window .btn a.disable:active{background: #666;color: #a9a9a9}
.window .pp{padding: .5rem 0;min-height: 2.5rem;max-height: 10rem;overflow: auto}
.window .pp p{padding-bottom: .5rem;line-height: .9rem;font-size: .5rem}
@media screen and (max-height: 480px) {
    .intro{display: none}
    .window .bd {
        max-height: 10rem;
        overflow: auto;
    }
}
</style>