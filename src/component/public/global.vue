<template>
	<div class="global-tip">
		<div class="tipRect">
			<p>{{tiptext}}</p>
		</div>

	</div>
</template>
<script>
	export default{
		data(){
		return{

		}
	},
	props: ['tiptext'],
	}
</script>
<style type="text/css">
	.global-tip{position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 99999;text-align: center;}
	.global-tip .tipRect{margin: 0 auto;margin-top: 40%;border-radius: .3rem;padding: .7rem;display: inline-block;background: rgba(0,0,0,.8);color: #fff;    max-width: 80%;}
	.global-tip .tipRect p{color: #fff;font-size: .7rem;text-align: center}
</style>