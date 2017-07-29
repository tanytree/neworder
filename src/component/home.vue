<template>
<section>
        <div class="homeTop">
            <top></top>
            <div class="banner">
                <div class="wrap">
                    <div class="row storeDesc clearfix">
                        <div class="fl storeLogo">
                            <img src="" :src="storeInfoData.logourl">
                        </div>
                        <h2 v-text='storeInfoData.name'></h2>
                        <p>
                            营业时间：<em v-text="storeInfoData.worktime"></em>
                        </p>
                    </div>
                    <div class="row noteText clearfix">
                        <i class="notificationIcon i-laba iconfont fl"></i>
                        <div class="scrollText ofh" id="marqueen">
                            <marquee scrolldelay="100">{{storeInfoData.notice!=''?storeInfoData.notice:'暂无公告'}}</marquee>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <div class="homeTabTit">
        <ul>
            <li @click="showItem()" :class="itemShow==true?'active':''">
                <p>
                    商品
                </p>
            </li>
            <li @click="showInfo()" :class="itemShow==true?'':'active'">
                <p>
                    商户详情
                </p>
            </li>
        </ul>
    </div>
    <div class="scrollNav" v-show="itemShow">
      <div class="ot-menu" v-if="initDishDatas" >
              <a class="" v-for="(nav,index) in itemLists" @click="navClickThis(index)" :class="active(index)">{{nav.group_name}}<i v-if="initDishDatas.catlist[nav.group_id]>0">{{initDishDatas.catlist[nav.group_id]?initDishDatas.catlist[nav.group_id]:0}}</i>
              </a>
      </div>
      <div class="ot-menu" v-else>
              <a class=""  v-for="(nav,index) in itemLists" @click="navClickThis(index)" :class="active(index)">{{nav.group_name}} <i v-if="false">0</i></a>
      </div>
    </div>
    <div class="homeList" v-show="itemShow">
        <items  :itemlist="pageData" :addto="addto" :reduceto="reduceto" :itemWindowClick="itemWindowClick" :initdata="initDishDatas"></items>
    </div>
    <storeinfo v-show="infoShow" :store="storeInfoData" ></storeinfo>
    <ftcart :initdata="initDishDatas"></ftcart>
    <fullbg v-show="fullbgShow"></fullbg>
    <itemwindow v-if="itemwindowShow" :attributesdata='attributesData' :xclosed='itemWindowClosed' :initdata="initDishDatas" :tipfn="tipfn" :initDishDataFn="initDishData"></itemwindow>
    <globaltip v-if="tipShow" :tiptext="tiptext"></globaltip>
    <loading v-if="inLoading"></loading>
</section>
</template>


<script>
  import top from './public/topHd.vue'
  import items from './public/itemlist.vue'
  import storeinfo from './public/storeinfo.vue'
  import itemwindow from './public/itemwindow.vue'
  import fullbg from './public/fullbg.vue'
  import ftcart from './public/ftcart.vue'
  import globaltip from './public/global.vue'
  import loading from './public/loading'

  import {mapGetters, mapActions} from 'vuex';
  
  export default {
  data() {
    return {
        infoShow:false,//商家信息模块显示隐藏
        itemShow:true,//首页商品列表显示和隐藏
        storeInfoData:'',//商家信息数据
        itemLists:'',//菜品列表信息
        pageData:'',//存入分类菜品的数据，传递给菜品子组件
        classActive:0,//当前分类索引
        token:'',
        fullbgShow:false,
        itemwindowShow:false,
        attributesData:'',//单一商品的属性信息
        tipShow:false,
        tiptext:'',
        sn:'',
        companyId:'',//商家id
        companyName:'',//商家名称
        orderurl:'',//订单列表url
        initDishDatas:'',//初始化出来的数据信息
        tableId:'',//桌号
        inLoading:false,
        wechaid:0,
        adddefer:false,
        reducedefer:false
      }
  },
  components:{
    top,items,storeinfo,ftcart,itemwindow,fullbg,globaltip,loading
  },
  mounted: function() {
    clearInterval(time)
    //读取sn并存储sn
    this.sn=this.$router.currentRoute.params.sn
    this.addoid=this.$router.currentRoute.params.oid
    window.localStorage.setItem('addoid',JSON.stringify(this.addoid));
    window.localStorage.setItem('SN',JSON.stringify(this.sn))
   this.token=this.$router.currentRoute.params.token
   this.tableId=this.$router.currentRoute.params.table_id
   window.localStorage.setItem('tableId',JSON.stringify(this.tableId))
   this.companyId=this.$router.currentRoute.params.company_id
   window.localStorage.setItem('companyId',JSON.stringify(this.companyId));//将店铺id存入缓存
    this.getHomeData();
    //this.testinitDish()
  },
  methods:{
    
    showInfo(){
      this.infoShow=true
      this.itemShow=false
    },
    showItem(){
      this.infoShow=false
      this.itemShow=true
    },
    //获取首页分类信息
    getHomeData(){
      var vm=this
      this.inLoading=true
        var postData={
          "cid":this.companyId,
          "tableid":this.tableId,
          "sn_id":this.sn,
          "oid":this.addoid

        }
      this.$http.post(INDEX_INIT+this.token,postData,{emulateJSON: true}).then((response) => {
        // success callback
        // console.log(response);
        if(response.data.err_code==0){
          this.checkSn()
          this.$store.dispatch('getAllProducts',response.data.err_msg)//存进本地vuex
          //this.products 取出所有数据
          this.storeInfoData=this.products.company//店铺信息
          this.itemLists=this.products.menuList//分类目录下的所有数据
          this.pageData=this.products.menuList[0]//分类一的数据
          // this.companyId=this.storeInfoData.id;//取得店铺id
          this.companyName=this.storeInfoData.name;//取得店铺name
          this.orderurl=this.storeInfoData.orderurl;
          this.wechaid=this.products.wecha_id;
          window.localStorage.setItem('companyName',JSON.stringify(this.companyName));//将店铺name存入缓存
          window.localStorage.setItem('orderurl',JSON.stringify(this.orderurl))
          window.localStorage.setItem('wechaId',JSON.stringify(this.wechaid))
          window.localStorage.setItem('markShow',JSON.stringify(response.data.err_msg.dish_setting.fuse_offline))//存储来源是否来自融合餐饮
          window.localStorage.setItem('dishsetting',JSON.stringify(this.products.dish_setting))

          if(this.storeInfoData.isOpen=='0'){
                this.fullbgShow=true
                this.tipShow=true
                this.tiptext='不在营业时间内，请稍后再来'
            }
              console.log(this.wechaid)
          if(this.wechaid===0||this.wechaid==''){
            //window.location.href=localHost+'index.php?g=Wap&m=Repast&a=dishMenu&token='+this.token+'&cid='+this.companyId+'&tid='+this.tableId

          }
            window.setTimeout(function(){
              vm.inLoading=false
            },2000)
            time=setInterval(function(){
              vm.initDishData();
            },1000)
          }
        }, (response) => {
          window.localStorage.setItem('companyName','');//将店铺name存入缓存
          window.localStorage.setItem('orderurl','')        
          window.localStorage.setItem('wechaId','')
          window.localStorage.setItem('markShow','')//存储来源是否来自融合餐饮
      });
    },
    //检查sn
    checkSn(){
      var checkInfo={
        "tableid":this.tableId,
        "sn_id":this.sn
      }
      this.$http.post(SNCHECKAPI+this.token+'&cid='+this.companyId,checkInfo,{emulateJSON: true}).then((response) => {
          console.log(response)
          if(response.data.err_code!=1000){
             this.$router.push({ path: '/home/'+this.token+'/'+this.companyId+'/'+this.tableId+'/'+response.data.err_msg+'/'+this.addoid})
             this.sn=response.data.err_msg
             window.localStorage.setItem('SN',JSON.stringify(this.sn));//将店铺name存入缓存
          }
      }, (response) => {
        // error callback
      });    
    },
    //分类点击触发事件
    navClickThis(index){
        this.classActive=index;
        this.pageData=this.products.menuList[index]//切换分类
        document.querySelector('.homeList').scrollTop = 0;
    },
    //给当前分类添加当前状态
    active(index){
     console.log(this.classActive);
       if(index==this.classActive){
           return 'active'
       } else{
           return ''
       }
    },
    //提示弹层方法，一个参数，传字符串
    tipfn(textTip){
      var t=null
      var self=this
        this.tiptext=textTip
        this.tipShow=true;
        t=setTimeout(function(){
            self.tipShow=false;
        },3000)
        return
    },
    //多属性商品弹窗触发事件，有库存提示
    itemWindowClick(item){
      if(item.instock<1){
        var textTip='商品库存告急，请查看其它商品'
        this.tipfn(textTip)
      }else{
        this.attributesData=item
        this.fullbgShow=true
        this.itemwindowShow=true
      }
    },
    //多属性窗口关闭方法
    itemWindowClosed(){
      this.fullbgShow=false
      this.itemwindowShow=false
    },
    //减少和添加商品时需要提交的数据
    reduceAndAdd(num,item,callback){
          var timestamp = Date.parse(new Date())/1000;
         var dishJsons={
          'wechaid':this.wechaid,
          "id":item.id,
          "cid":item.cid,
          "sid":item.sid,
          "name":item.name,
          "price":item.price,
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
         console.log(dishJson);
          this.$http.post(SyncDishPath,dishJson,{emulateJSON: true}).then((response) => {
            callback()
          }, (response) => {
          });
    },
    //增加商品
    addto(item,$event){
      var vm=this
      Element.prototype.hasClass = function(className){
        var i,len,temp = this.className.split(" ");
        for(i = 0,len = temp.length; i < len; i++){
            if(className == temp[i]){
                return true;
            }
        }
        return false;
      }
      if(vm.adddefer==true){
        return
      }
      vm.adddefer=true//开启延时操作********
        var thisBoj=$event.target
         var par=$event.target.parentNode
         var num=par.querySelector('.num')
         var reduceBtn=par.querySelector('.minus')
         var disabled=thisBoj.hasClass('disabled')
         console.log(disabled)
      if(item.instock<1 || disabled){
        console.log($event)
        var textTip='商品库存告急，请查看其它商品'
        vm.tipfn(textTip)
        vm.adddefer=false
        return
      }else{         
         vm.reduceAndAdd(1,item,thisCall)
       }
       function thisCall(){
        num.innerText=parseInt(num.innerText)+1
       num.style.display="inline-block"
       reduceBtn.style.display="inline-block"
       window.setTimeout(function(){
          vm.adddefer=false
        },1000)
       }
      },
      //减少商品
    reduceto(item,$event){
      var vm=this
        if(vm.reducedefer==true){
          return
        }
        vm.reducedefer=true//开启延时操作         
        var par=$event.target.parentNode
         var num=par.querySelector('.num')
         var reduceBtn=par.querySelector('.minus')         
         if(num.innerText<1){
            num.style.display="none"
           reduceBtn.style.display="none"
            return
         }          
         vm.reduceAndAdd(-1,item,thisCall)
         function thisCall(){
          num.innerText=parseInt(num.innerText)-1
           window.setTimeout(function(){
              vm.reducedefer=false
           },1000)
           if(num.innerText<1){
            num.style.display="none"
           reduceBtn.style.display="none"
          }
         }       
    },
    //取出初始同步数据
    initDishData(){
      var _this=this
         var timestamp = Date.parse(new Date())/1000;
        _this.$http.get(SyncDishPath+'?sn='+_this.sn+'&action=init'+'&msg='+'&timestamp='+timestamp+'&wechaid='+this.wechaid+'&addoid='+_this.addoid+'&tableid='+_this.tableId).then((response) => {
          // success callback
          response=JSON.parse(response.data)
          console.log(response)
          // if(response.err_code==1000){
          //   clearInterval(time)
          //   var textTip='此餐桌已清台，你重新扫码'
          //   _this.tipfn(textTip)
          //   return false;
          // }
          if(response.total_num=='undefined'||response.pop=='undefined'){
            this.initDishDatas='';
          }else{
            this.initDishDatas= response
              console.log(_this.addoid+"----------"+response.orderid)
            if(_this.addoid!=response.orderid){
                window.localStorage.setItem('addoid',JSON.stringify(response.orderid));//在这里更新一次订单id，防止其它页面无法跳转
                _this.addoid=response.orderid
               this.$router.push({ path: '/home/'+this.token+'/'+this.companyId+'/'+this.tableId+'/'+this.sn+'/'+response.orderid})
            }
          }
        }, (response) => {
        });
    },

    testinitDish(){
      var _this=this
      var timestamp = Date.parse(new Date())/1000;
      var url=SyncDishPath+'?sn='+_this.sn+'&action=init'+'&msg='+'&timestamp='+timestamp+'&wechaid='+_this.wechaid+'&addoid';
      _this.initDish(url,function(data){
        var d=JSON.parse(data)
        console.log(d)
        if(d.total_num=='undefined'){
            _this.initDishDatas='';
          }else{
            _this.initDishDatas= d
        }
      },function(data){
        var d=JSON.parse(data)
        console.log(d)
      });
    },
    initDish(url,process,finished){
        var xhr=new XMLHttpRequest(),
        received=0;
        xhr.open('get',url,true);
        xhr.onreadystatechange=function(){
          var result;
          if(xhr.readyState==3){
              result=xhr.responseText.substring(received);
              received+=result.length;
              process(result);
          }else if(xhr.readyState==4){
            finished(xhr.responseText);
          }
        };
        xhr.send(null);
        return xhr;
    }
  },
  computed: mapGetters({
    products: 'allProducts'
  }),
}
</script>
<style type="text/css">
  .homeTop{background: url(../assets/topBg.jpg) top center no-repeat;background-size: cover;}
  .homeTop .header{position: fixed;}
  .homeTop .banner{margin-top: .7rem}
</style>
