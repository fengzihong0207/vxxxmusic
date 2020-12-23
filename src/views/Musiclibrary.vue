<template>
  <div class="musiclibrary">
    <!-- 头部导航栏 -->
    <Top lefttext="乐库" @isfocus="focus"></Top>

    <!-- 热门歌手 -->
    <div class="popular-singers">
      <div class="title-more">
        <div class="fl title">热门歌手</div>
        <div class="fr more" @click="goSingerList">全部歌手</div>
      </div>
      <div class="hidden">
        <div
          class="singer-box"
          @touchstart="touchSingerStart"
          @touchmove="touchSingerMove"
          @touchend="touchSingerEnd"
          :style="{ marginLeft: `${x}px`, transition: `${effect}` }"
        >
          <div
            class="fl singer-item"
            v-for="(item, index) in popularSingersData"
            :key="index"
            @click="goSinger(item)"
          >
            <div class="img-box">
              <img :src="item.img1v1Url" alt="" />
            </div>
            <div class="singer-name">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新歌 -->
    <div class="recommend-music">
      <div class="title-more">
        <div class="fl title">新歌<span>(为你推荐)</span></div>
        <div class="fr more">查看更多</div>
      </div>

      <!-- 滑动歌单 -->
      <div class="Slide-song-list">
        <div
          class="Slide-song-box clearfix"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
          :style="{
            transform: `translateX(${movex}px)`,
            transition: `${tranmove}`,
          }"
        >
          <Musicitem
            class="fl"
            v-for="item in newlistdata"
            :key="item.id"
            :item="item"
            @songid="sendsongid"
            @goaudioplay="audioplayshow"
          >
          </Musicitem>
        </div>
      </div>
    </div>

    <!-- 新碟 -->
    <div class="recommend-album">
      <div class="title-more">
        <div class="fl title">新碟推荐</div>
        <div class="fr more">查看更多</div>
      </div>

      <!-- 滑动歌单 -->
      <div class="Slide-song-list">
        <div
          class="Slide-song-box clearfix"
          @touchstart="touchstart2"
          @touchmove="touchmove2"
          @touchend="touchend2"
          :style="{
            transform: `translateX(${movex2}px)`,
            transition: `${tranmove2}`,
          }"
        >
          <Albumitem
            class="fl"
            v-for="item in newlistdata2"
            :key="item.id"
            :item="item"
            @goalbum="goAlbum"
            
          >
          </Albumitem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/musiclibrary.less";
import Top from "../components/top/Top";
import Musicitem from "../components/musiclist/Musicitem";
import Albumitem from "../components/musiclist/Albumitem";
export default {
  name: "Musiclibrary",
  //注册组件
  components: {
    Top,
    Musicitem,
    Albumitem
  },

  data() {
    return {
      //热门歌手
      popularSingersData: [],

      //开始触摸的x位置
      startX: 0,
      //每次移动x的距离
      moveX: 0,
      //当前margin-left的值
      marginX: 0,
      //最终移动的距离
      x: 0,
      //动画效果
      effect: "all 0.3s",

      //新歌
      // 手指开始位置
      touchstartx: 0,
      // 手指移动位置
      touchmovex: 0,
      // 滑动条当前位置
      currentx: 0,
      // 移动距离
      movex: 0,
      // 最新歌曲推荐
      newlistdata: [],
      // 控制滑动动画
      tranmove: "all 1s",

      //新碟
      // 手指开始位置
      touchstartx2: 0,
      // 手指移动位置
      touchmovex2: 0,
      // 滑动条当前位置
      currentx2: 0,
      // 移动距离
      movex2: 0,
      // 新碟推荐
      newlistdata2: [],
      // 控制滑动动画
      tranmove2: "all 1s",
    };
  },

  created() {
    this.getPopularSingers();
    this.newsong();
    this.newDish();
  },
  computed: {
    // 歌曲id
    audioid() {
      return this.$store.state.songid;
    },
  },
  methods: {
    //获取热门歌手信息
    getPopularSingers() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/top/artists",
        // post请求参数，boject
        params: {
          limit: 10,
        },
      })
        .then((result) => {
          console.log("热门歌手==>", result);
          this.popularSingersData = result.data.artists;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 触摸开始
    touchSingerStart(e) {
      this.effect = "none";
      this.startX = e.touches[0].pageX;
    },

    //触摸移动中
    touchSingerMove(e) {
      this.moveX = e.touches[0].pageX - this.startX;
      this.x = this.moveX + this.marginX;
    },

    //触摸结束
    touchSingerEnd(e) {
      this.effect = "all 0.3s";
      //判断左右边界
      if (this.x > 0) {
        this.x = 0;
      } else if (this.x < -410) {
        this.x = -410;
      }
      //记录当前位置
      this.marginX = this.x;
    },

    // 获取新歌
    newsong() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/personalized/newsong",
        // post请求参数，object
        params: {
          limit: 9,
        },
      })
        .then((result) => {
          console.log("新歌==>",result);
          if (result.data.code == 200) {
            // 循环获取每一项歌单的数据
            result.data.result.map((v) => {
              // 把每一个歌单作为对象推到歌单数组中
              this.newlistdata.push({
                imgurl: v.picUrl,
                songname: v.name,
                songsinger: v.song.artists[0].name,
                musicid: v.id,
                exclusive: v.song.exclusive,
              });
            });
          }
        })
        .catch((err) => {});
    },

    //新歌
    // 手指开始触摸
    touchstart(event) {
      // 起始位置
      this.touchstartx = event.touches[0].pageX;
    },
    // 手指开始移动
    touchmove(event) {
      // 取消动画
      this.tranmove = "none";
      // 计算移动距离
      this.touchmovex = event.targetTouches[0].pageX - this.touchstartx;
      // 滑动距离+当前位置
      this.movex = this.touchmovex + this.currentx;
      // console.log(this.touchmovex);
    },
    // 手指松开
    touchend(event) {
      // console.log(this.movex);
      this.tranmove = "all 0.5s";
      // 判断是否到底了
      if (this.movex > 0) {
        this.movex = 0;
      } else if (this.movex < -655) {
        this.movex = -655;
      }
      // 判断是否下一页
      // 右拉
      if (this.touchmovex > 100) {
        this.movex =
          this.movex < -325 && this.movex > -657
            ? -325
            : this.movex < 0 && this.movex > -325
            ? 0
            : 0;
      } else if (this.touchmovex < 100 && this.touchmovex > 0) {
        this.movex =
          this.movex < -580
            ? -657
            : this.movex < -250 && this.movex > -580
            ? -325
            : 0;
      }
      // 左拉
      if (this.touchmovex < -100) {
        this.movex =
          this.movex < 0 && this.movex > -325
            ? -325
            : this.movex < -325 && this.movex > -657
            ? -657
            : 0;
      } else if (this.touchmovex > -100 && this.touchmovex < 0) {
        this.movex =
          this.movex > -100
            ? 0
            : this.movex < -375 && this.movex > -667
            ? -325
            : 0;
      }
      this.currentx = this.movex;
    },


    // 获取新碟
    newDish() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/top/album",
        // post请求参数，object
        params: {
          limit: 9,
        },
      })
        .then((result) => {
          console.log("获取的新碟数据==>", result);
          if (result.data.code == 200) {
            let data = result.data.weekData;
            // console.log(data)

            // 循环获取前就项的的数据
            for (let i = 0; i < 9; i++) {
              this.newlistdata2.push({
                songsinger: data[i].artist.name,
                imgurl: data[i].picUrl,
                songname: data[i].name,
                exclusive: data[i].exclusive,
                singers: data[i].artists,
                musicid: data[i].id,
              });
            }

            console.log("自己的新碟数据==>", this.newlistdata2);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //新碟
    // 手指开始触摸
    touchstart2(event) {
      // 起始位置
      this.touchstartx2 = event.touches[0].pageX;
    },
    // 手指开始移动
    touchmove2(event) {
      // 取消动画
      this.tranmove2 = "none";
      // 计算移动距离
      this.touchmovex2 = event.targetTouches[0].pageX - this.touchstartx2;
      // 滑动距离+当前位置
      this.movex2 = this.touchmovex2 + this.currentx2;
      // console.log(this.touchmovex);
    },
    // 手指松开
    touchend2(event) {
      // console.log(this.movex);
      this.tranmove2 = "all 0.5s";
      // 判断是否到底了
      if (this.movex2 > 0) {
        this.movex2 = 0;
      } else if (this.movex2 < -655) {
        this.movex2 = -655;
      }
      // 判断是否下一页
      // 右拉
      if (this.touchmovex2 > 100) {
        this.movex2 =
          this.movex2 < -325 && this.movex2 > -657
            ? -325
            : this.movex2 < 0 && this.movex2 > -325
            ? 0
            : 0;
      } else if (this.touchmovex2 < 100 && this.touchmovex2 > 0) {
        this.movex2 =
          this.movex2 < -580
            ? -657
            : this.movex2 < -250 && this.movex2 > -580
            ? -325
            : 0;
      }
      // 左拉
      if (this.touchmovex2 < -100) {
        this.movex2 =
          this.movex2 < 0 && this.movex2 > -325
            ? -325
            : this.movex2 < -325 && this.movex2 > -657
            ? -657
            : 0;
      } else if (this.touchmovex2 > -100 && this.touchmovex2 < 0) {
        this.movex2 =
          this.movex2 > -100
            ? 0
            : this.movex2 < -375 && this.movex2 > -667
            ? -325
            : 0;
      }
      this.currentx2 = this.movex2;
    },

    //点击歌手查看歌手详情
    goSinger(item) {
      console.log("点击歌手的id==>", item.id);
      this.$router.push({ name: "Singer", query: { singerId: item.id, singerImg: item.img1v1Url} });
    },

    //查看全部歌手
    goSingerList() {
      this.$router.push({ name: "SingerList" });
    },
    // 添加音乐id到vuex
    sendsongid(musicid) {
      // console.log(musicid)
      this.$store.commit("changesongid", musicid);
    },
    // 跳转到音乐播放器并且添加id
    audioplayshow(musicid) {
      this.$store.commit("audioplayshow", true);
      this.sendsongid(musicid);
    },
    // 搜索界面
    focus(){
      this.$router.push({name:"Search"})
    },

    //点击新碟
    goAlbum(id){
      this.$router.push({name: 'Album' , query:{albumId: id}});
    }
  },
};
</script>

<style lang="less" scoped>
</style>