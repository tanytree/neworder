<template>
    <div class="diallogBox">
        <div class="dia">
            <div class="textDesc">
                {{content}}
            </div>
            <div class="btn">
                <span @click='cancel()'>取消</span>
                <span @click='enter()'>确定</span>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">

    export default{
        props:[
            'title' ,
            'content',
            'cancel',
            'enter'
        ]
    }
</script>
<style scoped>
    .diallogBox{position: fixed;background: rgba(0,0,0,.8);top: 0;bottom: 0;right: 0;left: 0;text-align: center;    z-index: 999;}
    .dia{border: 1px solid #e3e3e3;color: #333;width: 70%;display:inline-block;background: #fff;border-radius: .2rem;margin-top: 45%}
    .dia .textDesc{line-height: 1.2rem;font-size: .7rem;padding: 1.5rem .8rem}
    .btn{overflow: hidden;border-top: 1px solid #e3e3e3}
    .btn span{float: left;width: 50%;padding: .5rem 0}
    .btn span:nth-child(1){border-right: 1px solid #e3e3e3;margin-left: -1px}
    .btn span:nth-child(2){color: #f60}
</style>