<template>
  <div class="singeritem">
      <div class="singer-item-box clearfix">
          <!-- 歌手头像 -->
          <div class="Artistphoto fl">
              <img class="autoimg" :src="item.imgsrc">
          </div>
          <!-- 歌手描述文本 -->
          <div class="singer-msg fl">
              <div class="singer-name">{{item.singername}}</div>
          </div>
          <!-- 跳转歌手详情箭头 -->
          <div class="go-singer-deital fr">
              <van-icon name="arrow" />
          </div>
      </div>
  </div>
</template>

<script>
import "../../assets/less/singeritem.less";
export default {
  name: "Singeritem",
  props:{
      item:{
          type:Object,
          default(){
              return {
                  imgsrc:'http://p4.music.126.net/5kMCaufaLhv8KLBo8zzakw==/109951163253267627.jpg',
                  singername:'刘德华'
              }
          }
      }
  }
};
</script>

<style lang="less" scoped>
</style>