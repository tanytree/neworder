<template>
	    <div class="storeInfo">
        <div class="row">
            <a href="tel:184955306" :href="'tel:'+store.tel">
              <span class="fr o-arrow">
                <i class="iconfont i-arrow-right"></i>
              </span>
              <span class="fl tit">
                <i class="iconfont rowIcon i-phone" style="font-size: .9rem"></i><em>电话</em>
              </span>
              <p>{{store.tel}}</p>
            </a>
       </div>
        <div class="row">
            <a :href="store.mapurl">
              <span class="fr o-arrow">
                <i class="iconfont i-arrow-right"></i>
              </span>
              <span class="fl tit">
                <i class="iconfont rowIcon i-position"></i><em>地址</em>
              </span>
              <p>{{store.city}} {{store.district}} {{store.address}}</p>
            </a>
      </div>
        <div class="row">
          <span class="fl tit">
            <i class="iconfont rowIcon i-time"></i><em>营业时间</em>
          </span>
          <p>{{store.worktime}}</p>
        </div>
        <div class="row noBorder">
          <span class="fl fu">
            <i class="iconfont rowIcon i-fu"></i>
          </span>
          <p>该商家支持在线支付</p>
        </div>
    </div>
</template>

<script type="text/javascript">
	  export default {
			props:['store'],
	  	  data() {
		    return {
		    }
		  },
      mounted: function() {

      },
		  components:{
		 
		  },
	  }
</script>