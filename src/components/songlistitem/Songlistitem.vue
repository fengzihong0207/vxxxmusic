<template>
  <div class="songlist-item-box fl" >
    <div class="songlist-item" @click="goPlayList(item.id)">
      <!-- 歌单缩略图 -->
      <div class="songlist-smallimg">
        <img class="autoimg" :src="item.picUrl" />
        <div class="play-count clearfix">
          <van-icon name="play" />
          <span>{{playCount }}万</span>
        </div>
      </div>
      <!-- 歌单描述 -->
      <div class="songlist-desc">
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/songlistitem.less";
export default {
  name: "Songlistitem",
  props: {
    item: {
      type: Object,
      default() {
        return {
          picUrl:
            "https://p2.music.126.net/64-m2GVDwGQjClya5vOjrw==/109951163243693998.jpg",
          name: "那些好听到发疯的粤语歌",
          id: 1000,
        };
      },
    },
      playCount:{
        type:String,
        default(){
          return{
            count:1600
          }
        }
      } 
  },

  methods: {
    goPlayList(id){
      // console.log(id)
      this.$emit('goplaylist',id)
    }
  },
};
</script>

<style lang="less" scoped>
</style>