<template>
	    <div class="window whoPayWindow">
        <div class="hd">
            <h3>请选择\付款人</h3>
            <p>选择后，支付权将转让给对方。</p>
        </div>
        <div class="bd">
            <ul>
                <li>
                      <div class="wrap">王八羔子</div>
                </li>
                <li>
                      <div class="wrap">王八羔子</div>
                </li>
                <li>
                      <div class="wrap">王八羔子</div>
                </li>
                <li>
                      <div class="wrap">王八羔子</div>
                </li>
            </ul>
        </div>

    </div>
</template>
<style type="text/css">
    .whoPayWindow{position: fixed;top: inherit;bottom: 0;left: 0;right: 0; top:inherit;background: #fff;z-index: 99}
    .whoPayWindow .hd{padding: .8rem}
    .whoPayWindow .hd h3{font-size: .6rem;color: #666}
    .whoPayWindow .hd p{font-size:.5rem;color:#999;margin-top: .2rem}
    .whoPayWindow .bd ul li{line-height: 2rem;border-top: 1px solid #e6e6e6;color: #333;font-size: .6rem}
    .whoPayWindow .bd ul li .wrap{margin: 0 .8rem}
    .whoPayWindow .bd ul li.on .wrap{background: url("./../../assets/ok.png") right center no-repeat;color: #f45f3a;background-size: .675rem .475rem}
</style>