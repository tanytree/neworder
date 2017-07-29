<template>
		<div>
		<dialogbox v-if="inDiallog"  :title='diallogTitle' :content='diallogContent' :cancel='onDailogCancel' :enter='onDailogEnter'></dialogbox>
	    <fullbg v-show="fullbgShow"></fullbg>
	    <div class="commentBtn" id="rect" style="position: absolute;right: 1rem;top: initial;z-index: 99;width:40px;height:40px"><a  class="touchcommentBtn" :href="orderUrl"></a></div>
	    <footer class="ft_cart active">
          <div class="wrap">
                <a href="javascript:;" class="buyTextTip noGoods fr" v-if="initdata=='' || initdata.total_num==0">请选择商品</a>
                <a href="javascript:;" class="buyTextTip fr" @click="orderConfirmation()" v-if="orderConfri && initdata.total_num>0">选好了</a>
                <a href="javascript:;" class="buyTextTip fr" @click="orderSubmit()" v-if="goPay">去支付</a>
                <div class="leftInfo ofh">

                    <span class="iconfont i-cart" @click="jumpMycart()" v-if="orderConfri && initdata.total_num>0"><i v-if="initdata.total_num>0">{{initdata.total_num}}</i></span>
                    <span class="iconfont i-cart gray" v-if="initdata=='' || initdata.total_num==0"></span>

                    <p v-if="orderConfri && initdata.total_num>0"><em>￥</em>{{initdata?initdata.total_money:0.00}}</p>
                    <p class="gray" v-if="initdata=='' || initdata.total_num==0"><em>￥</em>0.00</p>
                </div>
          </div>
	</footer>

	<div class="popTip alertdiv99 bottom-side" v-if="alertShow" > <span class="text photo"><img :src="alertImg">{{alertName+alertNum}}</span></div>
	</div>
</template>

<script type="text/javascript">
	import fullbg from './../public/fullbg'
	import dialogbox from './../public/diallogbox'
	import {mapGetters, mapActions } from 'vuex'
	import wx from 'weixin-js-sdk'
  	export default{
		props:['itemlist','itemWindowClick','addto','reduceto','initdata','confriNow'],
		components:{
		fullbg,dialogbox
		},		  
		data(){
			return{
				token:'',
				sn:'',
				companyId:'',
				tableId:'',
				goPay:false,
				orderConfri:true,
				fullbgShow:false,
				inDiallog:false,
				diallogTitle:'',
				diallogContent:'',
				diallEnterCall:'',
				diallCancelCall:'',
				shareData:'',
				orderUrl:'',
			    wechaid:0,

				//pop
				alertShow:false,
				alertImg:'',
				alertName:'',
				alertNum:'',
				total_num:'',
				timer:null,
				intimeOid:'',
				addoid:''

				}
		},
		created:function(){
			this.intimeOid=this.$router.currentRoute.params.oid
		},
		beforeMount:function(){

		},
		  mounted: function() {
		  	var self=this
	       this.token=this.$router.currentRoute.params.token
	       this.sn=this.$router.currentRoute.params.sn
			if(this.$router.currentRoute.params.company_id){
			this.companyId=this.$router.currentRoute.params.company_id
			}else{
			this.companyId=JSON.parse(window.localStorage.getItem('companyId')|| '[]')
			}
			//500毫秒后去查找订单地址,执行弹窗方法
			setTimeout(function(){
				self.$nextTick(function () {
					self.wechaid=JSON.parse(window.localStorage.getItem('wechaId')|| '[]')
					self.tableId=JSON.parse(window.localStorage.getItem('tableId')|| '[]')
					self.addoid=JSON.parse(window.localStorage.getItem('addoid')|| '[]')
					if(self.addoid!=='0'){
						self.orderUrl=localHost+'index.php?g=Wap&m=Repast&a=myOrderDetail&cid='+self.companyId+'&orid='+self.addoid
					}else{
						self.orderUrl=JSON.parse(window.localStorage.getItem('orderurl')|| '[]')
					}
				})			
			},2000)

		   //如果是确认订单页面，则显示去支付按钮

		   if(this.confriNow){
				this.goPay=true,
				this.orderConfri=false	
		   }

		    window.setTimeout(function(){
			self.getShareData()
			    self.wxinit(self.shareData)
		    },1000)	

		    this.rectMove()
	      },
		  watch: {
		    initdata: function (val, oldVal) {
		      this.total_num=this.initdata.total_num
		      this.intimeOid=this.initdata.orderid
		    },
		    total_num: {
		      handler: function (val, oldVal) { 
		      	console.log(val+'--'+oldVal)
		  		this.alertShow=false
		  		var self=this;
		  		var alertData=this.initdata.pop
		  		var pWechaId=alertData.people?alertData.people:[]
		  		var thiswechaid=JSON.parse(window.localStorage.getItem('wechaId')|| '[]')

		  		clearTimeout(this.timer)
		      	if(val!=oldVal &&(oldVal!=[]|| oldVal=='0')){
		      		console.log(val)
		  		for(let i=0;i<pWechaId.length;i++){
		  			//alert(pWechaId[i]+'-----------my:'+thiswechaid)
		  			if(pWechaId[i]===thiswechaid){
		  				this.alertShow=true
		  				this.alertImg=alertData.info.portrait
		  				this.alertName=alertData.dish.name
		  				this.alertNum=alertData.dish.num>0?'+1':'-1'
		  				break;
		  			}
		  		}
  				this.timer=setTimeout(function(){
  					self.alertShow=false
  				},4000)
		      	}
		       },
		      deep: true
		    }
		  },
		  methods:{

			rectMove(){
				var rect = document.getElementById('rect');
				var w=parseInt(rect.offsetWidth);
				var h=parseInt(rect.offsetHeight);
				var sreenw=document.documentElement.clientWidth;
				var sreenh=document.documentElement.clientHeight;
				rect.addEventListener('touchmove', function(event) {
				event.preventDefault();
				if (event.targetTouches.length == 1) {//手指为1
				var touch = event.targetTouches[0];  
				// console.log(touch.pageX);
				console.log(sreenw);
				console.log(sreenh);
				console.log(w);
				console.log(h);
				if(touch.pageY>sreenh-h ||touch.pageX>sreenw-w || touch.pageX<0 || touch.pageY<0 ){//超出屏幕宽高，将不作处理
				return false
				}else{
				  rect.style.left = touch.pageX + 'px';
				  rect.style.top = touch.pageY + 'px';
				}
				}
				}, false);
		  	},
			onDailogEnter(){
				this.diallEnterCall();
			},
			onDailogCancel(){
				this.diallCancelCall();
			},
			jumpMycart(){
				this.addoid=JSON.parse(window.localStorage.getItem('addoid')|| '[]')
		  		this.$router.push({ path: '/mycart/'+this.token+'/'+this.companyId+'/'+this.sn})
		  	},
		  // 	orderConfirmation(){
				// this.diallEnterCall=()=>{
  		// 	          	this.$store.dispatch('saveMyorder',this.initdata)//存进本地vuex					
			 //  			this.inDiallog=false
				// 		this.addoid=JSON.parse(window.localStorage.getItem('addoid')|| '[]')
				//   		this.$router.push({ path: '/orderconfirmation/'+this.token+'/'+this.companyId+'/'+this.sn+'/'+this.addoid})
				// },
				// this.diallCancelCall=()=>{
				// 	this.inDiallog=false
				// },
				// this.inDiallog=true;

				// this.diallogContent='您是否确定下单?'					
		  // 	},
		  	orderConfirmation(){
  			          	this.$store.dispatch('saveMyorder',this.initdata)//存进本地vuex					
			  			this.inDiallog=false
						this.addoid=JSON.parse(window.localStorage.getItem('addoid')|| '[]')
				  		this.$router.push({ path: '/orderconfirmation/'+this.token+'/'+this.companyId+'/'+this.sn+'/'+this.addoid})
					
		  	},
		  	orderSubmit(){
				this.diallEnterCall=()=>{
					this.inDiallog=false
				},
				this.diallCancelCall=()=>{
					this.inDiallog=false
				},
				this.inDiallog=true;
				this.diallogContent='您是否确定已到店进行入住?'			  	
              },

			getShareData(){
				this.shareData=this.products.share_data
			},
		  	 wxinit(shareobj) {
		      wx.config({
		        debug: false,
		        appId: shareobj.appId,
		        timestamp: shareobj.timestamp,
		        nonceStr: shareobj.nonceStr,
		        signature: shareobj.signature,
		        jsApiList: [
		          'onMenuShareTimeline',
		          'onMenuShareAppMessage', 
		          'onMenuShareQQ',
		          'onMenuShareWeibo',
		          'onMenuShareQZone'
		        ]
		      });
		      		        console.log(shareobj)

		      wx.ready(function() {
		        var shareObj = { // 
		          title: shareobj.share_title,
		          desc: shareobj.share_content,
		          link: shareobj.url,
		          imgUrl: shareobj.share_img,
		        };


		        wx.onMenuShareTimeline({
		          title: shareObj.title, // 
		            desc: shareObj.desc, // 描述
		          link: shareObj.link, // 
		          imgUrl: shareObj.imgUrl, // 
		          success: function(res) {},
		          cancel: function(res) {}
		        });
		      //分享到好友
		        wx.onMenuShareAppMessage({
		            title: shareObj.title, // 标题
		            desc: shareObj.desc, // 描述
		            link: shareObj.link, // 链接
		            imgUrl: shareObj.imgUrl, // 图片
		            success: function(res) {},
		            cancel: function(res) {},
		        });        //
		        wx.onMenuShareQQ({
		          title: shareObj.title,
		          desc: shareObj.desc,
		          link: shareObj.link,
		          imgUrl: shareObj.imgUrl,
		          success: function(res) {},
		          cancel: function(res) {}
		        });

		        //
		        wx.onMenuShareWeibo({
		          title: shareObj.title,
		          desc: shareObj.desc,
		          link: shareObj.link,
		          imgUrl: shareObj.imgUrl,
		          success: function(res) {},
		          cancel: function(res) {}
		        });

		        //
		        wx.onMenuShareQZone({
		          title: shareObj.title,
		          desc: shareObj.desc,
		          link: shareObj.link,
		          imgUrl: shareObj.imgUrl,
		          success: function(res) {},
		          cancel: function(res) {}
		        });
		      });
		      wx.error(function(res) {
		        // 
		        console.log(res)
		      });
		    }			  
		},
		  computed: mapGetters({
		    cartOrder: 'checkoutMyOrder',//订单数据
			products: 'allProducts'		  
		  }),		
}
</script>

<style type="text/css">
	
.ft_cart{position: fixed;bottom: 0;height: 2rem;left: 0;right: 0;z-index: 9}
.ft_cart .wrap{border-top: 1px solid #acacac;background-color: #fff}
.buyTextTip{width: 6.3rem;text-align: center;;background-color: #acacac;color: #fff;line-height: 2rem}
.leftInfo{color: #acacac}
.leftInfo p{padding-left: 3.5rem;line-height: 2rem;font-size: 0.9rem;height: 2rem;}
.leftInfo p em{font-size: .4rem}
.leftInfo .i-cart{width: 1.85rem;height: 1.85rem;line-height: 1.85rem;background-color: #acacac;color: #fff;position: absolute;left: 1.35rem;top: -0.925rem;border-radius: 100%;text-align: center;font-size: 1.25rem}
.leftInfo .i-cart i{position: absolute;width: 0.75rem;height: 0.75rem;line-height: 0.75rem;overflow: hidden;text-align: center;font-size: 0.45rem;background-color: #f89c19;border-radius: 100%;right: -0.25rem;top: -0.2rem;display: none}

.ft_cart.active .buyTextTip{background: #f89c19}
.ft_cart.active .leftInfo .i-cart{background: #ff6633}
.ft_cart.active .leftInfo .i-cart i{display: block;}
.ft_cart.active .leftInfo p{color:#ff6633 }
.ft_cart.active .leftInfo p.gray{color:#ABABAB }
.commentBtn {
    position: fixed;
    right: 15px;
    bottom: 60px;
    z-index: 9999;
}
.commentBtn a {
    float: right;
    height: 100%;
    width: 100%;
    border-radius: 100%;
    text-align: center;
    background: url(../../assets/an@3x.png) no-repeat;
    background-size: cover;
}
.ft_cart.active .noGoods{
	background: #ABABAB
}
.ft_cart.active .leftInfo .i-cart.gray{
		background: #ABABAB

}
</style>