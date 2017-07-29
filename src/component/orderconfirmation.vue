<template>
	<div class="orderdetail">
		<div class="orderItems">
			<div class="hd">
				<div class="wrap">
					<a @click="backHome()">
						<i class="iconfont icon-arrow-right fr"></i>
						<h2><i class="iconfont i-store"></i>{{companyName}}</h2>
					</a>
				</div>
			</div>
			<div class="itemList" v-if="cartOrder!=null">
				<ul>
					<li class="clearfix" v-for="item in cartOrder.list" v-if="item.num>0">
						<span class="fr price">￥{{item.info.price}}</span>
						<span class="fl itemTit">{{item.info.name}}<em class="spec" v-if="item.info.spec">[{{item.info.spec}}]</em><em class="flav" v-if="item.info.attr">[{{item.info.attr}}]</em></span>
						<p>×{{item.num}}</p>
					</li>
				</ul>
			</div>
			<div class="t_price">
				<div class="wrap clearfix">
					<span class="fr p">总价：<em>{{cartOrder.total_money}}</em> 元</span>
					<span class="fl t">总数量：<em>{{cartOrder.total_num}}</em> 份</span>
				</div>
			</div>
			<div class="remarks">
				<div v-if="needinfo!=1">
				<div class="row">
					<div class="wrap box">
					<span class="tit b-flex">姓名：</span>
					<div class="b-flex">
						<input type="text" placeholder="请输入姓名" name="u_name" v-model="userInfo.u_name"/>
					</div>
					</div>
				</div>
<!-- 				<div class="row">
					<div class="wrap box">
					<span class="tit b-flex">性别：</span>
					<div class="b-flex">
						<span class="s_span"><input type="radio" name="u_sex" value="1" id="s_male" v-model="userInfo.u_sex"><label for="s_male">先生</label></span>
						<span class="s_span"><input type="radio" name="u_sex" value="0" id="s_female" v-model="userInfo.u_sex"><label for="s_female">女士</label></span>
					</div>
					</div>
				</div> -->
				<div class="row">
					<div class="wrap box">
					<span class="tit b-flex">电话：</span>
					<div class="b-flex">
						<input type="tel" placeholder="请输入联系电话" name="u_phone" v-model="userInfo.u_phone"/>
					</div>
					</div>
				</div>				
				</div>
				<div class="row">
					<div class="wrap box">
					<span class="tit b-flex">就餐人数：</span>
					<div class="b-flex">
						<input type="tel" placeholder="请输入就餐人数" name="u_nums" v-model="userInfo.u_nums" maxlength="5" />
					</div>
					</div>
				</div>
				<div class="row" v-if="markShow">
					<div class="wrap box">
					<span class="tit b-flex">备注：</span>
					<div class="b-flex">
						<input type="text" placeholder="添加备注" name="u_mark" maxlength="6" v-model="userInfo.u_mark"/>
					</div>
					</div>
				</div>
				<div class="row" v-else>
					<div class="wrap box">
					<span class="tit b-flex">备注：</span>
					<div class="b-flex">
						<input type="text" placeholder="添加备注" name="u_mark" v-model="userInfo.u_mark"/>
					</div>
					</div>
				</div>
			</div>

		</div>
			<div class="myOrderBtnGroup">
				<span class="payNow" @click="orderSubmit()">立即下单</span>
			</div>
		    <fullbg v-show="fullbgShow"></fullbg>
		    <globaltip v-if="tipShow" :tiptext="tiptext"></globaltip>
		    <whopay></whopay>
    		<dialogbox v-if="inDiallog"  :title='diallogTitle' :content='diallogContent' :cancel='onDailogCancel' :enter='onDailogEnter'></dialogbox>
	</div>
</template>
<script type="text/javascript">
	import top from './public/topHd.vue'
	import ftcart from './public/ftcart.vue'
	import fullbg from './public/fullbg.vue'
	import globaltip from './public/global.vue'
	import whopay from './public/whopay.vue'
	import dialogbox from './public/diallogbox'
	import {mapGetters, mapActions } from 'vuex'
	  export default {
	  	  data() {
		    return {
		      fullbgShow:false,
		      tipShow:false,
		      sn:'',
		      token:'',
		      initDishDatas:'',
		      tiptext:'',
		      confriNow:true,
		      companyId:'',
		      companyName:'',
				inDiallog:false,
				diallogTitle:'',
				diallogContent:'',
				diallEnterCall:'',
				diallCancelCall:'',	
				myOrderData:null,
				submitData:null,
				tableid:'',
				markShow:false,
				userInfo:{
					u_name:'',
					u_sex:'',
					u_phone:'',
					u_nums:'',
					u_mark:'',
				},
		    }
		  },
		  components:{
		    top,ftcart,fullbg,globaltip,whopay,dialogbox
		  },
		  created:function(){
		  	var dishSetting=JSON.parse(window.localStorage.getItem('dishsetting')|| '[]')
		  		this.needinfo=dishSetting.need_info
		  		this.userInfo.u_name=dishSetting.wechaname
		  		this.userInfo.u_phone=dishSetting.tel
		  		// this.userInfo.u_sex=dishSetting.sex
		  		this.userInfo.u_nums=dishSetting.number>0?dishSetting.number:''
		  		this.userInfo.u_mark=dishSetting.allmark
		  		console.log(dishSetting.tel)
		  },
	  		mounted:function(){
				clearInterval(time)
				this.sn=JSON.parse(window.localStorage.getItem('SN')|| '[]')
			   	this.token=this.$router.currentRoute.params.token
			   	this.addoid=this.$router.currentRoute.params.oid
			   	this.companyId=JSON.parse(window.localStorage.getItem('companyId')|| '[]')
			   	this.companyName=JSON.parse(window.localStorage.getItem('companyName')|| '[]')
			   	this.tableid=JSON.parse(window.localStorage.getItem('tableId')|| '[]')
			   	var fuse_offline=JSON.parse(window.localStorage.getItem('markShow')|| '[]')

			   	if(fuse_offline!=0){
			   		this.markShow=true
			   	}else{
			   		this.markShow=false
			   	}

			   if(this.cartOrder==null){
				  		this.$router.push({ path: '/mycart/'+this.token+'/'+this.companyId+'/'+this.sn})
			   }else{
			   		this.myOrderData=this.cartOrder
			   		console.log(this.myOrderData)
			   }			
			},
		  	computed: {
		  	},			
	  		methods:{
			onDailogEnter(){
				this.diallEnterCall();
			},
			onDailogCancel(){
				this.diallCancelCall();
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
			backHome(){
	             this.$router.push({ path: '/home/'+this.token+'/'+this.companyId+'/'+this.tableid+'/'+this.sn+'/'+this.addoid})
			},
			//属性值为空字符串、null、undefined的属性
			//支持递归删除，即有些空属性是由于代码执行中产生的，这些属性也要删除
			deleteEmptyProperty(object){
				var vm=this
			    for (var i in object) {
			        var value = object[i];
			        
			        // console.log('typeof object[' + i + ']', (typeof value));
			        if (typeof value === 'object') {
			            if (Array.isArray(value)) {
			                if (value.length == 0) {
			                    delete object[i];
			                    console.log('delete Array', i);
			                    continue;
			                }
			            }
			            vm.deleteEmptyProperty(value);
			            if (vm.isEmpty(value)) {
			                console.log('isEmpty true', i, value);
			                delete object[i];
			                console.log('delete a empty object');
			            }
			        } else {
			            if (value === '' || value === null || value === undefined) {
			                delete object[i];
			                console.log('delete ', i);
			            } else {
			                console.log('check ', i, value);
			            }
			        }
			    }
			},
			//删除为空的json字段
			isEmpty(object) {
			    for (var name in object) {
			        return false;
			    }
			    return true;
			},			
			orderSubmit(){
				var self=this
				this.diallEnterCall=()=>{
					this.inDiallog=false
					if(this.needinfo==0){
			  			if(this.userInfo.u_name==''||this.userInfo.u_name==null){
			  				this.tipfn('请填写姓名')
			  				return
			  			}
			  			if(this.userInfo.u_phone=='' || this.userInfo.u_phone==null){
			  				this.tipfn('请填写联系方式')
			  				return
			  			}
						if(!this.userInfo.u_phone.match(/^[0-9]{6,12}$/gi)){
							///^[0-9]{6,12}$/gi
							///^(1\d{10}||\d{8})$/gi
			               	this.tipfn('手机号格式不正确')
			                return
			            }		  			
		        	}

		  			if(this.userInfo.u_nums==''|| this.userInfo.u_nums==null){
		  				this.tipfn('请填写就餐人数')
		  				return
		  			}
					if(!this.userInfo.u_nums.match(/^\+?[1-9][0-9]*$/)){
		               	this.tipfn('就餐人数请填写数字')
		                return
		            }
		  			this.submitData=this.myOrderData
				  			console.log(this.submitData.list)
							var jsonLength = 0
							var myList=[]
							for(var i in this.submitData.list){
							jsonLength++;
							var single
				  			single={
				  				pro_ids:this.submitData.list[i].info.id,
				  				pro_num:this.submitData.list[i].num,
				  				// pro_num:this.submitData.list[i].num,
				  				pro_spec:this.submitData.list[i].info.spec==undefined?'':this.submitData.list[i].info.spec,
				  				pro_attr:this.submitData.list[i].info.attr==undefined?'':this.submitData.list[i].info.attr,
				  			}
				  			console.log(single)
				  			if(this.submitData.list[i].num>0){
					  			myList.push(single)
				  			}
							}
			  			console.log(myList)
			  			var myOrder={
			  				"addoid":this.addoid,
			  				"tableid":this.tableid,
			  				"takeaway":2,
			  				"sn":this.sn,
			  				"from":'Repast',
			  				"list":myList,
			  				"youname":this.userInfo.u_name,
			  				"youtel":this.userInfo.u_phone,
			  				// "yousex":this.userInfo.u_sex,
			  				"youremark":this.userInfo.u_mark,
			  				"nums":this.userInfo.u_nums
			  			}
			  			this.deleteEmptyProperty(myOrder)
						//var string = JSON.stringify(myOrder);
						console.log(myOrder);

	                  this.$http.post(ORDERSUBMIT+this.token+"&cid="+this.companyId,myOrder,{emulateJSON: true}).then((response) => {
		                   console.log(response)

							this.tiptext='下单成功'
							this.tipShow=true;
							window.setTimeout(function(){
								self.tipShow=false;
								if(response.data.err_code==1000){
					               	self.tipfn(response.data.err_msg)
								}else{
			                   		location.href=response.data.err_msg.pay_url
								}
							},500)		                   
	                  }, (response) => {
	                  });				
              },
				this.diallCancelCall=()=>{
					this.inDiallog=false
				},
				this.inDiallog=true;
				this.diallogContent='是否确定下单'
              }
		},
		  computed: mapGetters({
		    cartOrder: 'checkoutMyOrder'//订单数据
		  }),	
		}
</script>

<style type="text/css" scoped>
	.orderdetail .header{background: #f15b36}
	.orderItems{padding-bottom: 2.5rem}
	.orderItems .hd {border-bottom: 1px solid #e5e5e5}
	.orderItems .hd .wrap{padding:.8rem .5rem;    line-height: 100%;}
	.orderItems .hd h2{font-weight: normal;font-size: 0.65rem}
	.orderItems .hd h2 i{font-size: 1rem;margin-right: .2rem;color: #f89c19}
	.orderItems .itemList{padding: 0 .5rem; margin-bottom: 1rem}
	.orderItems .itemTit{    font-size: .5rem;width: 7rem;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
	.orderItems .itemTit em {color: #f60;font-size: .5rem;}
    .orderItems ul{overflow: hidden;}
    .orderItems ul li{padding-top: 1rem;margin-top: -1px;border-top: 1px dotted #f5f5f5;border-bottom: 1px dotted #f5f5f5}
	.orderItems  .price{font-size: .65rem;width: 4rem;text-align: right;}
	.orderItems  p{text-align: center;font-size: .6rem}
	.remarks{margin-top: -1px;border-top:1px solid #e5e5e5;}
	.remarks .row{border-bottom:1px solid #e5e5e5}
	.remarks .tit{color: #666;font-size: .6rem;margin-right: .5rem}
	.remarks .wrap{padding: .5rem .5rem}
	.remarks input[type=text],.remarks input[type=tel]{border:0;text-align: left;width: 100%;    font-size: .5rem;}
	.remarks .row .i-remark,.remarks .row .i-pay{font-size: 1rem;margin-right: .2rem;color: #f89c19;    vertical-align: middle;}
	.remarks .row .i-pay{color: #f5809b}
	.remarks span.s_span{float: left;width: 50%}
	.remarks span.s_span label{margin-left: .5rem}
	.t_price{border-top: 1px solid #e5e5e5}	
	.t_price .wrap{padding: .5rem .5rem}
	.t_price .t{font-size: .7rem}
	.t_price .p{font-size: .7rem}
	.t_price  span em{color: #f60}
	.global-tip .tipRect{margin-top: 60%;}
	</style>