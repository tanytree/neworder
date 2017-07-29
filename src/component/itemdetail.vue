<template>
	<div class="itemdetail">
		<div class="swiper-container swiperTop">
            <div class="swiper-wrapper">
            <!--如果只有封面图就取封面图，如果没有就取菜品图-->
                <div class="swiper-slide" v-if="itemdetailData.image_1">
					<img :src="itemdetailData.image_1"/>
				</div>
                <div class="swiper-slide" v-else>
					<img :src="itemdetailData.image"/>
				</div>
            </div>

        </div>

        <div class="itemDesc itemText" v-if="initdata!=''">
        	<div class="wrap pr">
        		<h2>{{itemdetailData.name}}</h2>
        		<p><span>月销：{{itemdetailData.m_sales}}</span><!-- <span>库存：{{itemdetailData.instock}}</span> --></p>
        		<p class="price"><em>￥</em>{{itemdetailData.price}}<em>起</em></p>

        		<div class="singelAddCart" v-if="itemdetailData.opts==undefined">
					<div class="setDiv quantity">
						<span class="minus reduceFromCart iconfont i-reduce" @click="reduceto(itemdetailData,$event)" v-show="numBtnIsShow(initdata,itemdetailData.id)"></span><span class="num" v-show="numBtnIsShow(initdata,itemdetailData.id)">{{initdata.list[(itemdetailData.id)]?initdata.list[(itemdetailData.id)].num:0}}</span><span class="plus addToCart iconfont i-add" :class="itemdetailData.instock<1?'disabled':''" @click="addto(itemdetailData,$event)"></span>
					</div>
        		</div>
        		<button class="addCart" :class="itemdetailData.instock<1?'disabled':''" v-if="itemdetailData.opts!=undefined" @click="itemWindowClick(itemdetailData)">选规格</button>
        	</div>
        </div>
        <div class="itemDesc itemText" v-if="initdata==''">
        	<div class="wrap pr">
        		<h2>{{itemdetailData.name}}</h2>
        		<p><span>月销：{{itemdetailData.m_sales}}</span><!-- <span>库存：{{itemdetailData.instock}}</span> --></p>
        		<p class="price"><em>￥</em>{{itemdetailData.price}}</p>
        		<div class="singelAddCart" v-if="itemdetailData.opts==undefined">
					<div class="setDiv quantity">
						<span class="minus reduceFromCart iconfont i-reduce" @click="reduceto(itemdetailData,$event)" v-show="false"></span><span class="num" v-show="false">0</span><span class="plus addToCart iconfont i-add" :class="itemdetailData.instock<1?'disabled':''" @click="addto(itemdetailData,$event)"></span>
					</div>
        		</div>
        		<button class="addCart" :class="itemdetailData.instock<1?'disabled':''" v-if="itemdetailData.opts!=undefined" @click="itemWindowClick(itemdetailData)">选规格</button>
        	</div>
        </div>

        <div class="itemInfos itemText">
        	<div class="wrap">
        		<h2>商品信息</h2>
        		<p>	{{itemdetailData.des}}
        		</p>
        	</div>
        </div>
		<!--  <div class="itemRanks itemText">
        	<div class="wrap">
        		<h2>商品评价</h2>
        		<p class="rankValue">好评度<em>65%</em></p>
        		<div class="ranktipe pr">
        			<span class="o-good o-good-left"><i class="iconfont i-good"></i>17</span>
        			<span class="o-good o-good-right">18<i class="iconfont i-nogood"></i></span>
        			<p class="goodtipe"></p>
        		</div>

        	</div>
        </div> -->
            <ftcart :initdata="initdata"></ftcart>
		    <fullbg v-show="fullbgShow"></fullbg>
		    <itemwindow v-if="itemwindowShow" :attributesdata='attributesData' :xclosed='itemWindowClosed' :initdata="initdata" :tipfn="tipfn" :initDishDataFn="initDishData"></itemwindow>
			<globaltip v-if="tipShow" :tiptext="tiptext"></globaltip>
		    <loading v-if="inLoading"></loading>
	</div>
</template>
<script type="text/javascript">
	import swiper from './../js/swiper-3.3.1.min.js'
	import top from './public/topHd.vue'
	import ftcart from './public/ftcart.vue'
	import fullbg from './public/fullbg.vue'
	import globaltip from './public/global.vue'
	import itemwindow from './public/itemwindow.vue'
	import loading from './public/loading'
  export default{
		data(){
			return{
				msg:false,
				itemdetailData:'',
				token:'',
				dishId:'',
				tipShow:false,
				tiptext:'',
				fullbgShow:false,
				itemwindowShow:false,
			    attributesData:'',
				sn:'',
				initdata:'',
			    inLoading:false,
			    companyId:'',
	            wechaid:0
			 }
		},
		props: [],
		  components:{
		    top,ftcart,globaltip,fullbg,itemwindow,loading
		  },

		mounted:function(){
			clearInterval(time)
			this.sn=JSON.parse(window.localStorage.getItem('SN')|| '[]')
			this.token=this.$router.currentRoute.params.token
			this.dishId=this.$router.currentRoute.params.item_id
			this.companyId=this.$router.currentRoute.params.company_id
			this.wechaid=JSON.parse(window.localStorage.getItem('wechaId')|| '[]')
			this.addoid=JSON.parse(window.localStorage.getItem('addoid')|| '[]')
			this.tableId=JSON.parse(window.localStorage.getItem('tableId')|| '[]')
			this.getDetails()
		},
		methods:{
		    itemWindowClosed(){
		      this.fullbgShow=false
		      this.itemwindowShow=false
		    },
			getDetails(){
				var vm=this;
				this.inLoading=true
		        this.$http.get(DETAILS_INIT+this.token+'&dishid='+this.dishId+'&cid='+this.companyId).then((response) => {
		        // success callback
		        console.log(response);
		        if(response.data.err_code==0){
		        	this.itemdetailData=response.data.err_msg
		          }
		          console.log(this.itemdetailData)
		          window.setTimeout(function(){
		          	vm.inLoading=false
					vm.initDishData();
					time=setInterval(function(){
						vm.initDishData();
					},1000)
		          },2000)
		      }, (response) => {
		        // error callback
		      });
			},
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
		    hideFullBg(){
		      this.fullbgShow=false
		      this.itemwindowShow=false
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
				var thisBoj=$event.target
		         var par=$event.target.parentNode
		         var num=par.querySelector('.num')
		         var reduceBtn=par.querySelector('.minus')
		         var disabled=thisBoj.hasClass('disabled')
		         console.log(disabled)
			      if(disabled){
			        var textTip='商品库存告急，请查看其它商品'
			        vm.tipfn(textTip)
			        return
			      }		         
				num.style.display="inline-block"
				reduceBtn.style.display="inline-block"

		         this.reduceAndAdd(1,item,thisCall)
		       function thisCall(){
		        num.innerText=parseInt(num.innerText)+1
		         num.style.display="inline-block"
		         reduceBtn.style.display="inline-block"       
		       }
		    },
		    reduceto(item,$event){
		         var par=$event.target.parentNode
		         var num=par.querySelector('.num')
		         var reduceBtn=par.querySelector('.minus')
	      		if(num.innerText<1){
			        var textTip='请添加商品'
			        this.tipfn(textTip)		         
			        return
			      }else{
			         this.reduceAndAdd(-1,item,thisCall)
			         function thisCall(){
			          num.innerText=parseInt(num.innerText)-1
			           if(num.innerText<1){
			              num.style.display="none"
			             reduceBtn.style.display="none"            
			           }
			         }       
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
			          }
						response=JSON.parse(response.data)
						console.log(response)

			          // if(response.err_code==1000){
			          //   clearInterval(time)
			          //   var textTip='此餐桌已清台，你重新扫码'
			          //   _this.tipfn(textTip)
			          //   return false;
			          // }
			        this.initdata= response
			        console.log(this.initdata);
			        console.log(response);
			        console.log(_this.addoid+"----------"+response.orderid)
		            if(_this.addoid!=response.orderid){
		                window.localStorage.setItem('addoid',JSON.stringify(response.orderid));//在这里更新一次订单id，防止其它页面无法跳转
		                _this.addoid=response.orderid
		               this.$router.push({ path: '/home/'+this.token+'/'+this.companyId+'/'+this.tableId+'/'+this.sn+'/'+response.orderid})
		            }			        

			      }, (response) => {
			        // error callback
			      });
			  },		
		}
	}

</script>
<style>
    @import './../css/swiper.min.css';
    .swiper-container {
        width: 100%;
        height: 9rem;
    }
    .swiper-container .swiper-slide {height:9rem}  
    .swiper-container .swiper-slide img{height:100%;width:100%}
	.itemdetail .swiper-container-horizontal>.swiper-pagination{    background: rgba(0,0,0,.5);
		border-radius: 5rem;
		overflow: hidden;
		right: .8rem;
		left: inherit;
		width: auto;
		padding: .1rem .3rem;
		font-size: .5rem;
		color: #fff;
		font-weight: normal;
	}
		.itemdetail {margin-bottom: 4rem;}
		.itemdetail .header{position: fixed;left: 0;right: 0;top: 0}

		.itemText {border-bottom: 1px solid #e3e3e3}
		.itemText .wrap{margin:0 1.25rem }
		.itemDesc h2{font-size: .7rem;color: #333;padding: .4rem 0}
		.itemDesc p{font-size: .5rem;color: #999}
		.itemDesc p span{margin-right: .5rem}
		.itemDesc p.price{color: #f63;font-size: .8rem;padding: .4rem 0}
		.itemDesc p.price em{font-size: .6rem} 
		.itemInfos .wrap,.itemRanks .wrap{margin: .8rem 1.25rem}
		.itemInfos h2,.itemRanks h2{font-size: .65rem;line-height: 100%;padding-left: .2rem;border-left: 2px solid #f89c19;font-weight: normal;margin-bottom: .5rem}
		.itemInfos p{font-size: .6rem;color: #333;padding-left: .2rem;    line-height: .9rem;}
		.itemRanks .rankValue{text-align: center;font-size: .7rem;color: #333}
		.itemRanks .rankValue em{color: #f89c19}
		.ranktipe{width: 100%;border-radius: .5rem;background: #b4b4b4;    height: .4rem;    margin-top: 1rem}
		.ranktipe .o-good i{    font-size: .8rem;
    vertical-align: middle;}
		.ranktipe .o-good{position: absolute;    top: -1rem;font-size: .55rem}
		.ranktipe .o-good-left{left: 0;color: #f89c19}

		.ranktipe .o-good-right{right: 0}
		.goodtipe{position: absolute;background:#f89c19;left: 0;top:0;width: 50%;height: .4rem;border-radius: .5rem;}
		.addCart{position: absolute;right:0;bottom: .5rem;border:0;background: #ff6633;color: #fff;border-radius: .4rem;padding: .1rem .2rem;}
		.addCart.disabled {background: #666;color: #ddd;}
		.singelAddCart{position: absolute;right: 0;bottom: .5rem;}
		.addToCartBtn{
			    font-size: 0.5rem;
			    color: #fff;
			    background: #ff6633;
			    padding: 0.2rem 0.4rem;
			    border-radius: 0.5rem;
			    vertical-align: middle;
			    line-height: 100%;
			    border: 0;
			}
</style>