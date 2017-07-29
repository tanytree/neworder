<template>
	<div class="orderdetail">
		<div class="orderItems">
			<div class="hd">
				<div class="wrap">
					<h2><i class="iconfont i-store"></i>徽宴楼农家菜</h2>
				</div>
			</div>
			<div class="itemList">
				<ul>
					<li class="clearfix">
						<span class="fr price">￥10</span>
						<span class="fl itemTit">水煮肉片</span>
						<p>×4</p>
					</li>
					<li class="clearfix">
						<span class="fr price">￥10</span>
						<span class="fl itemTit">水煮肉片</span>
						<p>×4</p>
					</li>
					<li class="clearfix">
						<span class="fr price">￥10</span>
						<span class="fl itemTit">水煮肉片</span>
						<p>×4</p>
					</li>
				</ul>
			</div>
			<div class="remarks">
				<div class="row">
					<div class="wrap box">
					<span class="tit b-flex"><i class="iconfont i-remark"></i>备注</span>
					<div class="b-flex">
						<input type="text" placeholder="添加备注" name="remark"/>
					</div>
					</div>
				</div>
			</div>
			<div class="whoPay remarks">
				<div class="row">
					<div class="wrap box">
					<span class="tit b-flex"><i class="iconfont i-pay"></i>选择其他人支付</span>
					<div class="b-flex">
						<input type="text" placeholder="可选付款人" name="whopay" readonly />
					</div>
					</div>
				</div>
			</div>
		</div>
	        <ftcart :initdata="initDishDatas"></ftcart>
		    <fullbg v-show="fullbgShow"></fullbg>
		    <globaltip v-if="tipShow" :tiptext="tiptext"></globaltip>
		    <whopay></whopay>
	</div>

</template>
<script type="text/javascript">
	  import top from './public/topHd.vue'
	  import ftcart from './public/ftcart.vue'
	  import fullbg from './public/fullbg.vue'
	  import globaltip from './public/global.vue'	  
	  import whopay from './public/whopay.vue'  
	  export default {
	  	  data() {
		    return {
				fullbgShow:false,
				tipShow:false,
				sn:'',
				token:'',
				initDishDatas:'',
				tiptext:'',
				wechaid:0
		    }
		  },
		  components:{
		    top,ftcart,fullbg,globaltip,whopay
		  },
	  		mounted:function(){
				clearInterval(time)
				this.sn=JSON.parse(window.localStorage.getItem('SN')|| '[]')
			   	this.token=(this.$router.currentRoute.params.token)
				this.wechaid=JSON.parse(window.localStorage.getItem('wechaId')|| '[]')
			    var _this=this
		       _this.initDishData();
			    time=setInterval(function(){
			      _this.initDishData();
			    },5000);
			},
			methods:{
			    //取出初始同步数据
			    initDishData(){
			      var _this=this
			         var timestamp = Date.parse(new Date())/1000;
			        _this.$http.get(SyncDishPath+'?sn='+_this.sn+'&action=init'+'&msg='+'&timestamp='+timestamp+'&wechaid='+this.wechaid).then((response) => {
			          // success callback
			          console.log(response)
			          if(response.data.size==0){
			            this.initDishDatas='';
			            return
			          }
			          this.initDishDatas= JSON.parse(response.data)
			          console.log(this.initDishDatas);
			          console.log(response);
			        }, (response) => {
			          // error callback
			        });
			    },






			},	  
	}
</script>

<style type="text/css" scoped>
	.orderdetail .header{background: #f15b36}
	.orderItems .hd {border-bottom: 1px solid #e5e5e5}
	.orderItems .hd .wrap{padding:.5rem .8rem;}
	.orderItems .hd h2{font-weight: normal;font-size: 0.65rem}
	.orderItems .hd h2 i{font-size: 1rem;margin-right: .2rem;color: #f89c19}

	.orderItems .itemList{padding: 0 .8rem;    margin-bottom: 1rem;}
	.orderItems .itemTit{    font-size: .7rem;width: 5rem;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
    .orderItems ul{overflow: hidden;}
    .orderItems ul li{padding-top: 1rem;margin-top: -1px;border-top: 1px dotted #f5f5f5;border-bottom: 1px dotted #f5f5f5}
	.orderItems  .price{font-size: .65rem;width: 4rem;text-align: right;}
	.orderItems  p{text-align: center;font-size: .6rem}
	.remarks{margin-top: -1px}
	.remarks .row{border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;}
	.remarks .tit{color: #666;font-size: .6rem;margin-right: .5rem}
	.remarks .wrap{padding: .5rem .5rem;}
	.remarks input{border:0;text-align: right;width: 100%;    font-size: .5rem;}
	.remarks .row .i-remark,.remarks .row .i-pay{font-size: 1rem;margin-right: .2rem;color: #f89c19;    vertical-align: middle;}
	.remarks .row .i-pay{color: #f5809b}
	.whoPay .row input{color: #f63;font-size: .6rem}

</style>