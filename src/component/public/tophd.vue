<template>
<div>
	<div class="header pr">
<!-- 		<span class="iconfont i-arrow-left  left-icon pa" @click="back()"></span>
 -->		<span class="iconfont i-search right-icon pa" @click="goSearch()"></span>
		<h1></h1>
	</div>
</div>
</template>
<script>
	export default{
			data(){
				return{
					token:'',
					sn:'',
					companyId:'',
					tableId:'',
				}
			},
			mounted: function() {
				clearInterval(time)
				this.token=(this.$router.currentRoute.params.token)
				this.sn=this.$router.currentRoute.params.sn
				if(this.$router.currentRoute.params.company_id){
				this.companyId=this.$router.currentRoute.params.company_id
				}else{
				this.companyId=JSON.parse(window.localStorage.getItem('companyId')|| '[]')
				}
				if(this.$router.currentRoute.params.table_id){
					   this.tableId=this.$router.currentRoute.params.table_id
				}else{
					this.tableId=JSON.parse(window.localStorage.getItem('tableId')|| '[]')
				}
			},
			props: [],
			methods:{
			back(){
				window.history.go(-1);
			},
			goSearch(){
				this.$router.push({ path: '/search/'+this.token+'/'+this.companyId+'/'+this.sn})
			}
		}
	}
</script>
<style type="text/css">
.header{color: #fff;height: 2.25rem;line-height: 2.25rem;overflow: hidden;position: fixed;right: 0;left: 0;top: 0;z-index: 9;}
.header h1{font-size: .9rem;text-align: center;font-weight: normal}
.header span{padding:0rem .5rem}
.header span.headerRouter{right: 0;top: 0;font-size: .6rem}
.header .left-icon{left: 0;top: 0;font-size: 1rem}
.header .right-icon{right: 0;top: 0;}
.header .i-search{font-size: 1.4rem}
</style>