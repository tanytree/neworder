<template>
	<div class="ttip"> <p>库存不够。</p> </div>
</template>

<style type="text/css">
	.ttip {
    height: 15px;
    line-height: 15px;
    float: left;
    text-align: center;
    display: none;
    border: 1px solid #aaa;
    cursor: pointer;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -105px;
    width: 210px;
    color: #fff;
    background: rgba(0,0,0,6);
    padding: 10px 0;
    border-radius: 4px;
    z-index: 999;
    margin-top: -7.5px;
    font-size: 12px;
}
</style>