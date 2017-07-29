<template>
	<div class="mycart">
		<div class="cartList">
			<ul>
				<li class="useritem">
					<div class="hd">
						<em class="fr clearAll" @click="clearMyCart()">清空</em>
						<h2>
							菜品清单
						</h2>
					</div>
					<ol v-if="initdata!=''">
						<li class="clearfix quantity" v-for="item in initdata.list" v-if="item.num>0">
							<div class="liHd clearfix">
								<span class="fl itemTit">
									{{item.info.name}}<em class="spec" v-if="item.info.spec">[{{item.info.spec}}]</em><em class="flav" v-if="item.info.attr">[{{item.info.attr}}]</em>
								</span>
								<div class="ofh tr whoOrder"><i v-for='img in avatarFn(item.portrait_list)'><img :src="img.portrait"></i> <i class="whoOrderDot" v-if="getJsonObjLength(item.portrait_list)>3" @click="avartarListShowFn(item.portrait_list)">...</i></div>
								</div>

		                    <div class="fr iconGroup">
		                        <span class="minus iconfont i-reduce"  @click="reduceto(item.info,$event)"></span><span class="num">{{item.num}}</span><span class="plus iconfont i-add" @click="addto(item.info,$event)"></span>
		                    </div>
		                    <p>￥{{(item.info.price*item.num).toFixed(2)}}</p>
						</li>
					</ol>
				</li>
			</ul>
		</div>
		<div class="avartarList window" v-if="avartarListShow">
			<div class="wrap pr">
			<span class="iconfont i-closed pa" @click="avartarListhideFn()"></span>
				<div class="hd">
					点餐人员
				</div>
				<ul>
					<li v-for="avatar in avatarData" class="clearfix">
						<div class="i-pic fl">
							<img :src="avatar.portrait">
						</div>
						<h3 class="ofh">{{avatar.name}}</h3>
					</li>
				</ul>
			</div>
		</div>
        <ftcart :initdata="initdata"></ftcart>
		<globaltip v-if="tipShow" :tiptext="tiptext"></globaltip>
		<dialogbox v-if="inDiallog" :title='diallogTitle' :content='diallogContent' :cancel='onDailogCancel' :enter='onDailogEnter'></dialogbox>
	    <fullbg v-show="fullbgShow"></fullbg>
	    <loading v-if="inLoading"></loading>
	</div>
</template>


<script type="text/javascript">
	  import top from './public/topHd.vue'
	  import ftcart from './public/ftcart.vue'
	  import fullbg from './public/fullbg.vue'
	  import globaltip from './public/global.vue'
	  import dialogbox from './public/diallogbox'
	  import loading from './public/loading'
	  export default {
	  	data() {
	  		return {
	  			sn: '',
	  			token: '',
	  			companyId: '',
	  			tableId: '',
	  			//桌号
	  			initdata: '',
	  			fullbgShow:false,
	  			tipShow: '',
	  			tiptext: '',
	  			inDiallog: false,
	  			diallogTitle: '',
	  			diallogContent: '',
	  			diallEnterCall: '',
	  			diallCancelCall: '',
	  			wechaid: 0,
	  			avartarListShow:false,
	  			avatarData:'',
	  			inLoading:true,
		        adddefer:false,
		        reducedefer:false
    	  		}
	  	}, 
	  	create:function(){
	  	},
	  	mounted: function() {
			clearInterval(time)
			this.sn = JSON.parse(window.localStorage.getItem('SN') || '[]')
			this.token = this.$router.currentRoute.params.token
			this.addoid = JSON.parse(window.localStorage.getItem('addoid') || '[]')
			this.companyId = JSON.parse(window.localStorage.getItem('companyId') || '[]')
			this.tableId = JSON.parse(window.localStorage.getItem('tableId') || '[]')
			this.wechaid = JSON.parse(window.localStorage.getItem('wechaId') || '[]')

	  		var _this = this
	  		_this.initDishData();
	  		time = setInterval(function() {
	  			_this.initDishData();
	  		}, 1000);

	  		if (this.initdata != '') {
	  			var text = '请添加商品'
	  			this.tipfn(text)
	  		}

	  		console.log(this.initdata);
	  	},
	  	components: {
	  		top, ftcart, fullbg, globaltip, dialogbox,loading
	  	},
	  	computed: {
	  		numFn(){
	  			var num=this.initdata.total_num
 	  				return num
		  		}
	  	},
		watch: {
		    numFn: {
		      handler: function (val, oldVal) { 
		      	if(val==0){
					 this.$router.push({ path: '/home/'+this.token+'/'+this.companyId+'/'+this.tableId+'/'+this.sn+'/'+this.addoid})
		      	}
		       },
		      deep: true
		    }
		},
	  	methods: {
	  		reduceAndAdd_forMuilt(num, item,callback) {
	  			var timestamp = Date.parse(new Date()) / 1000;
	  			var dishJsons = {
	  				"wechaid": this.wechaid,
	  				"id": item.id,
	  				"cid": item.cid,
	  				"sid": item.sid,
	  				"name": item.name,
	  				"price": item.price,
	  				"image": item.image,
	  				"desc": '',
	  				"creattime": timestamp,
	  				"sort": item.sort,
	  				"istakeout": item.istakeout,
	  				"isdiscount": item.isdiscount,
	  				"instock": item.instock,
	  				"refreshstock": item.refreshstock,
	  				"kitchen_id": item.kitchen_id,
	  				"tmpinstock": item.tmpinstock,
	  				"locktime": item.locktime,
	  				"m_sales": item.m_sales,
	  				"m_name": item.m_name,
	  				"is_meal": item.is_meal,
	  				"spec": item.spec,
	  				"attr": item.attr,
	  				"num": num,
	  			}
	  			dishJsons = JSON.stringify(dishJsons)
				var dishJson = {
					sn: this.sn,
					action: 'sync',
					tableid:this.tableId,
					timestamp: timestamp,
					msg: dishJsons
				}
	  			console.log(dishJson);
	  			this.$http.post(SyncDishPath, dishJson, {
	  				emulateJSON: true
	  			}).then((response)=> {
	  				callback()
	  			}, (response)=> {});
	  		}, 
	  		reduceAndAdd_forSingle(num, item,callback) {
	  			var timestamp = Date.parse(new Date()) / 1000;
	  			var dishJsons = {
	  				"wechaid": this.wechaid,
	  				"id": item.id,
	  				"cid": item.cid,
	  				"sid": item.sid,
	  				"name": item.name,
	  				"price": item.price,
	  				"image": item.image,
	  				"desc": '',
	  				"creattime": timestamp,
	  				"sort": item.sort,
	  				"istakeout": item.istakeout,
	  				"isdiscount": item.isdiscount,
	  				"instock": item.instock,
	  				"refreshstock": item.refreshstock,
	  				"kitchen_id": item.kitchen_id,
	  				"tmpinstock": item.tmpinstock,
	  				"locktime": item.locktime,
	  				"m_sales": item.m_sales,
	  				"m_name": item.m_name,
	  				"is_meal": item.is_meal,
	  				"num": num
	  			}

	  			dishJsons = JSON.stringify(dishJsons)
	  			var dishJson = {
	  				sn: this.sn,
	  				action: 'sync',
	  				          tableid:this.tableId,
	  				timestamp: timestamp,
	  				msg: dishJsons
	  			}
	  			console.log(dishJson);
	  			this.$http.post(SyncDishPath, dishJson, {
	  				emulateJSON: true
	  			}).then((response) => {
	  				callback()
	  				//this.initDishData()
	  			}, (response) => {});
	  		}, 
	  		addto(item,$event) {
  				var vm=this
			      if(vm.adddefer==true){
			        return
			      }
			      vm.adddefer=true//开启延时操作********		         
			      var par=$event.target.parentNode
		         var num=par.querySelector('.num')
		       function thisCall(){
			        num.innerText=parseInt(num.innerText)+1  
			       window.setTimeout(function(){
			          vm.adddefer=false
			        },1000)		       
   				}	  			
		       	if (item.spec || item.attr) {
	  				this.reduceAndAdd_forMuilt(1, item,thisCall)
	  			} else {
	  				this.reduceAndAdd_forSingle(1, item,thisCall)
	  			}

	  		}, 
	  		reduceto(item,$event) {
			    var vm=this
		        if(vm.reducedefer==true){
		          return
		        }
		        vm.reducedefer=true//开启延时操作  		         
		        var par=$event.target.parentNode
		         var num=par.querySelector('.num')
		       function thisCall(){
		        num.innerText=parseInt(num.innerText)-1
		           window.setTimeout(function(){
		              vm.reducedefer=false
		           },1000)
       			}
	  			if (item.spec || item.attr) {
	  				this.reduceAndAdd_forMuilt(-1, item,thisCall)
	  			} else {
	  				this.reduceAndAdd_forSingle(-1, item,thisCall)
	  			}
	  		}, 
	  		tipfn(textTip) {
	  			var t = null
	  			var self = this
	  			this.tiptext = textTip
	  			this.tipShow = true;
	  			t = setTimeout(function() {
	  				self.tipShow = false;
	  			}, 3000)
	  			return
	  		},
	  		avatarFn(data){
  				var dataStr=data
  				var dataStr3={};
  				var i=0;
  				if(this.getJsonObjLength(dataStr)>2){
			        for (var item in dataStr) {
				            i++;
				            console.log(dataStr[item])
				            dataStr3[i]=dataStr[item]
	  						if(i==3){
								break
	  						}
				        }
  				}else{
  					dataStr3=dataStr
  				}
  				console.log(dataStr3)
  				return dataStr3
	  		},
	  		avartarListShowFn(obj){
	  			this.avartarListShow=true
	  			this.fullbgShow=true
	  			this.avatarData=obj
	  		},
	  		avartarListhideFn(){
	  			this.avartarListShow=false
	  			this.fullbgShow=false
	  		},
	  		//获取json的长度
			getJsonObjLength(jsonObj) {
			        var Length = 0;
			        for (var item in jsonObj) {
			            Length++;
			        }
			        return Length;
			    },
	  		//取出初始同步数据
	  		initDishData() {
	  			var _this = this
	  			var timestamp = Date.parse(new Date()) / 1000;
	  			_this.$http.get(SyncDishPath + '?sn=' + _this.sn + '&action=init' + '&msg=' + '&timestamp=' + timestamp + '&wechaid=' + this.wechaid+'&addoid='+_this.addoid+'&tableid='+_this.tableId).then((response) => {
	  				// success callback
	  				console.log(response)
	  				window.setTimeout(function(){
	  					_this.inLoading=false
	  				},2000);
	  				if (response.data.size == 0) {
	  					_this.initdata = ''
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
			          _this.initdata = response
	  				console.log(_this.initdata);
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
			onDailogEnter(){
				this.diallEnterCall();
			},
			onDailogCancel(){
				this.diallCancelCall();
			},
		  	clearMyCart(){
				this.diallEnterCall=()=>{		
			  			this.inDiallog=false
						this.$http.post(CLEARMYCART+this.token,{"sn_id":this.sn,"oid":this.addoid},{emulateJSON: true}).then((response) => {
				             this.$router.push({ path: '/home/'+this.token+'/'+this.companyId+'/'+this.tableId+'/'+this.sn+'/'+this.addoid})
						}, (response) => {
						});
				},
				this.diallCancelCall=()=>{
					this.inDiallog=false
				},
				this.inDiallog=true;
				this.diallogContent='您是否确定清空购物车?'					
		  	},		
	  	}
	  }
</script>
