<template>
	<div class="orderdetail">
		<div class="header pr">
			<span class="i-search-btn pa" @click="getAnswer()">搜索</span>
			<div class="serachBox">
				<input type="text" name="" placeholder="请输入商品名" v-model="keyword" />
			</div>
		</div>


		<p class="statusTip" v-show="statusTipShow">{{answer}}</p>
		<div class="loader" v-show="loadingShow">
		    <div class="loader-inner ball-clip-rotate-multiple">
		      <div></div>
		      <div></div>
		    </div>
	  	</div>

		<div class="searchList">
	        <items  :itemlist="searchData" :addto="addto" :reduceto="reduceto" :itemWindowClick="itemWindowClick" :initdata="initDishDatas"></items>
		</div>


        <ftcart :initdata="initDishDatas"></ftcart>
	    <fullbg v-show="fullbgShow"></fullbg>
	    <itemwindow v-if="itemwindowShow" :attributesdata='attributesData' :xclosed='itemWindowClosed' :initdata="initDishDatas" :tipfn="tipfn" :initDishDataFn="initDishData"></itemwindow>
	    <globaltip v-if="tipShow" :tiptext="tiptext"></globaltip>
	</div>

</template>
<script type="text/javascript">
	  import top from './public/topHd.vue'
	  import items from './public/itemlist.vue'
	  import itemwindow from './public/itemwindow.vue'
	  import fullbg from './public/fullbg.vue'
	  import ftcart from './public/ftcart.vue'
	  import globaltip from './public/global.vue'	  
  	export default {
	  	  data() {
		    return {
		      infoShow:false,
		      itemShow:true,
		      sn:'',
		      initDishDatas:'',
		      token:'',
		      keyword:'',
		      answer: '请输入你想查找的商品',
		      searchData:'',
	          fullbgShow:false,
		     itemwindowShow:false,
		     attributesData:'',
		     tipShow:false,
		     tiptext:'',
		     loadingShow:false,
		     statusTipShow:true,
		     companyId:'',
		     wechaid:0
		    }
		  },
		  components:{
		    top,ftcart,items,fullbg,itemwindow,globaltip
		  },
  		mounted:function(){
			clearInterval(time)
			this.sn=JSON.parse(window.localStorage.getItem('SN')|| '[]')
		   	this.token=(this.$router.currentRoute.params.token)
		   	this.companyId=JSON.parse(window.localStorage.getItem('companyId')|| '[]')
			this.wechaid=JSON.parse(window.localStorage.getItem('wechaId')|| '[]')
		   	this.addoid=JSON.parse(window.localStorage.getItem('addoid')|| '[]')
			this.tableId=JSON.parse(window.localStorage.getItem('tableId')|| '[]')
		    var _this=this
		    this.getSearchData()
	       _this.initDishData();
		    time=setInterval(function(){
		      _this.initDishData();
		    },1000);
		},
		watch: {
			// 如果 question 发生改变，这个函数就会运行
			keyword: function (newKeyword) {
				this.answer = '输入停止后开始查询'
				this.loadingShow=true
				this.statusTipShow=true
				this.getAnswer()
			}
		},
	  methods:{
	    getAnswer: _.debounce(
	      function () {
	        var vm = this
	        vm.answer = '正在搜索……'
	        this.$http.get(INDEX_INIT+this.token+'&keyword='+this.keyword+'&cid='+this.companyId).then((response) => {
	        // success callback
        	console.log(response.data.err_msg)
		        if(response.data.err_msg.list==null){
			        vm.answer = '暂无此类商品，请重新搜索'
					this.loadingShow=false
					this.statusTipShow=true
		        	this.searchData=''
			        return
		        }
	        	this.searchData=response.data.err_msg
	        	console.log(this.searchData)
		        vm.answer = '搜索成功'
				this.loadingShow=false
				var ttime=null
				ttime=setTimeout(function(){
					vm.statusTipShow=false
				},1000)
		      },(response) => {
		        // error callback
		    });
	      },
	      // 这是我们为用户停止输入等待的毫秒数
	      500
	    ),
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
	    itemWindowClosed(){
	      this.fullbgShow=false
	      this.itemwindowShow=false
	    },
	    reduceAndAdd(num,item,callback){
	          var timestamp = Date.parse(new Date())/1000;
	         var dishJsons={
				"wechaid":this.wechaid,
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

	    addto(item,$event){
	      Element.prototype.hasClass = function(className){
	        var i,len,temp = this.className.split(" ");
	        for(i = 0,len = temp.length; i < len; i++){
	            if(className == temp[i]){
	                return true;
	            }
	        }
	        return false;
	      }
	 
	        var thisBoj=$event.target
	         var par=$event.target.parentNode
	         var num=par.querySelector('.num')
	         var reduceBtn=par.querySelector('.minus')
	         var disabled=thisBoj.hasClass('disabled')
	         console.log(disabled)
	      if(item.instock<1 || disabled){
	        console.log($event)
	        var textTip='商品库存告急，请查看其它商品'
	        this.tipfn(textTip)
	        return
	      }else{
	         this.reduceAndAdd(1,item,thisCall)
		       function thisCall(){
		        num.innerText=parseInt(num.innerText)+1
		         num.style.display="inline-block"
		         reduceBtn.style.display="inline-block"       
		       }
	       }
	      },
	    reduceto(item,$event){
	         var par=$event.target.parentNode
	         var num=par.querySelector('.num')
	         var reduceBtn=par.querySelector('.minus')
	        if(num.innerText<1){
	            return
	         }
	         this.reduceAndAdd(-1,item,thisCall)
	         function thisCall(){
	          num.innerText=parseInt(num.innerText)-1
	           if(num.innerText<1){
	              num.style.display="none"
	             reduceBtn.style.display="none"            
	           }
	         }  
	    },		
        back(){
			window.history.go(-1);
		},
	    getSearchData(){
        this.$http.get(INDEX_INIT+this.token).then((response) => {
        // success callback
        console.log(response);
        if(response.data.err_code==0){

          }
	      }, (response) => {
	        // error callback
	      });
      },
	    //取出初始同步数据
	    initDishData(){
	      var _this=this
	         var timestamp = Date.parse(new Date())/1000;
	        _this.$http.get(SyncDishPath+'?sn='+_this.sn+'&action=init'+'&msg='+'&timestamp='+timestamp+'&wechaid='+this.wechaid+'&addoid='+_this.addoid+'&tableid='+_this.tableId).then((response) => {
	          // success callback
	          console.log(response)
	          if(response.data.size==0){
	            this.initDishDatas='';
	            return
	          }
				response=JSON.parse(response.data)
				console.log(response)

	          // if(response.err_code==1000){
	          //   clearInterval(time)
	          //   var textTip='此餐桌已清台，你重新扫码'
	          //   _this.tipfn(textTip)
	          //   return false;
	          // }	          
	          this.initDishDatas= response
	          console.log(this.initDishDatas);
	          console.log(response);

	            if(_this.addoid!=response.orderid){
	                window.localStorage.setItem('addoid',JSON.stringify(response.orderid));//在这里更新一次订单id，防止其它页面无法跳转
	                _this.addoid=response.orderid
	               this.$router.push({ path: '/home/'+this.token+'/'+this.companyId+'/'+this.tableId+'/'+this.sn+'/'+response.orderid})
	            }	        
        	}, (response) => {
	          // error callback
	        });
	    },
	  },
	  }
</script>

<style type="text/css" scoped>
	.header{background: #f15b36;}
	.serachBox{
		position: absolute;
	    left: .5rem;
	    right: 2.5rem;
	    top: 0;
	    bottom: 0;
        z-index: 1;
	}
    .serachBox input{
		width: 100%;
	    border: 0;
	    line-height: 1.2rem;
        text-indent: .5rem;
        background: #E6E6E6;
        color: #747474;
        border-radius: .3rem;
        font-size: .6rem
    }
    .statusTip{
	    text-align: center;
	    font-size: .7rem;
	    color: #787878;
	    position: absolute;
	    top: 2.25rem;
	    background: #ffc600;
	    z-index: 9;
	    width: 100%;
	    padding: .3rem 0;
	    color: #f00;
	}

.loader {
	    position: relative;
        margin-top: 3.5rem;
}
@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg) scale(1);
            transform: rotate(0deg) scale(1); }

  50% {
    -webkit-transform: rotate(180deg) scale(0.6);
            transform: rotate(180deg) scale(0.6); }

  100% {
    -webkit-transform: rotate(360deg) scale(1);
            transform: rotate(360deg) scale(1); } }

.ball-clip-rotate-multiple {
    position: absolute;
    left: 50%;
    margin-left: -16px;
 }
  .ball-clip-rotate-multiple > div {
    -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
    position: absolute;
    left: 0px;
    top: 0px;
    border: 2px solid #f15b36;
    border-bottom-color: transparent;
    border-top-color: transparent;
    border-radius: 100%;
    height: 35px;
    width: 35px;
    -webkit-animation: rotate 1s 0s ease-in-out infinite;
            animation: rotate 1s 0s ease-in-out infinite; }
    .ball-clip-rotate-multiple > div:last-child {
      display: inline-block;
      top: 10px;
      left: 10px;
      width: 15px;
      height: 15px;
      -webkit-animation-duration: 0.5s;
              animation-duration: 0.5s;
      border-color: #f89c19 transparent #f89c19 transparent;
      -webkit-animation-direction: reverse;
              animation-direction: reverse; }


</style>