<template>
  <div class="musicitem">
    <div class="music-item-box" @click="goAlbum(item.musicid)">
      <!-- 歌曲缩略图 -->
      <div class="singer-img fl">
        <img :src="item.imgurl" class="autoimg" />
      </div>
      <div class="song-detail-text fl">
        <!-- 歌曲名字 -->
        <div class="song-name one-text">
          {{ item.songname }}
          <span>{{ item.songsinger }}</span>
        </div>
        <!-- 歌曲描述 -->
        <div class="song-desc clearfix">
          <!-- 高品质图标 -->
          <span class="fl biaoqian" v-if="item.sq">SQ</span>
          <span class="fl biaoqian" v-if="item.exclusive">独家</span>
          <span class="fl">{{ item.songdesc }}</span>
        </div>
      </div>

      <!-- 播放按钮 -->
      <div class="song-play-button clearfix">
        <van-icon size="30" name="play-circle-o" color="#ff0033" />
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/musicitem.less";
export default {
  name: "Musicitem",
  props: {
    item: {
      type: Object,
      default() {
        return {
            songname: "Moon Light",
            songsinger: "-赵品霖",
            sq: true,
            exclusive: true,
            songdesc: "有种换踹不安的预感",
            imgurl:
                "http://p1.music.126.net/uMLgx10hwPd28fwLJlTgWQ==/109951165481436589.jpg",
            musicid: "",
        };
      },
    },
  },
  methods: {
    goAlbum(id){
      this.$emit('goalbum',id)
    }
  },
};
</script>