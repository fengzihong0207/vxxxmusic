<template>
  <div class="home">
    <!-- 头部导航栏 -->
    <Top @isfocus="focus"> </Top>
    <div class="home-box">
      <!-- 轮播图 -->
      <div class="banner">
        <van-swipe
          class="my-swipe"
          indicator-color="#ff0033"
          @change="onChange"
          :autoplay="3000"
        >
          <van-swipe-item
            v-for="(item, index) in bannerimglist"
            :key="index"
            :class="{ active: index == bannerindex }"
            ><img class="autoimg" :src="item.pic" />
            <span :style="{ backgroundColor: item.titleColor }">{{
              item.typeTitle
            }}</span>
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- 中部标签栏 -->
      <div class="tabs-box">
        <div class="tabs-list clearfix">
          <div
            class="tabs-item fl"
            v-for="(item, index) in tabsdata"
            :key="index"
          >
            <!-- 图片 -->
            <div class="tabs-item-img">
              <img class="autoimg" :src="item.imgsrc" />
            </div>
            <!-- 描述 -->
            <div class="tabs-item-desc">{{ item.title }}</div>
          </div>
        </div>
      </div>
      <!-- 推荐歌单 -->
      <div class="Recom-playlist">
        <!-- 标题 -->
        <div class="recom-title clearfix">
          <div class="recom-left-text fl">推荐歌单</div>
          <div class="recom-right-btn fr">
            <span>查看更多</span>
          </div>
        </div>
        <div class="recom-play-box clearfix">
          <Songlistitem
            v-for="item in Recomplaydata"
            :key="item.id"
            :item="item"
            :playCount="item.playCount | decimal"
            @goplaylist="playList"
          >
          </Songlistitem>
        </div>
      </div>
      <!-- 精选歌单 -->
      <div class="Featured-playlist">
        <!-- 标题 -->
        <div class="recom-title clearfix">
          <div class="recom-left-text fl">精选歌单</div>
          <div class="recom-right-btn fr">
            <span>查看更多</span>
          </div>
        </div>
        <div class="recom-play-box clearfix">
          <Songlistitem
            v-for="item in Featuredplaydata"
            :key="item.id"
            :item="item"
            :playCount="item.playCount | decimal"
            @goplaylist="playList"
          >
          </Songlistitem>
        </div>
      </div>
      <!-- 私人定制 -->
      <div class="Private-custom">
        <div class="Private-custom-box">
          <!-- 标题 -->
          <div class="Private-title">新歌速递</div>
          <div class="Private-top-tis clearfix">
            <div class="Private-tis-left fl">走过音乐界</div>
            <div class="Private-tis-right fr" @click="playallnewsong">
              <span><van-icon name="play" />播放全部</span>
            </div>
          </div>
          <!-- 滑动歌单 -->
          <div class="Slide-song-list">
            <div
              ref="slide"
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
                v-for="item in nwelistdata"
                :key="item.musicid"
                :item="item"
                @songid="sendsongid"
                @goaudioplay="audioplayshow"
              >
              </Musicitem>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>)

<script>
import "../assets/less/home.less";
import Top from "../components/top/Top";
import Songlistitem from "../components/songlistitem/Songlistitem";
import Musicitem from "../components/musiclist/Musicitem";
export default {
  name: "Home",
  components: {
    Top,
    Songlistitem,
    Musicitem,
  },
  data() {
    return {
      // 顶部输入框绑定数据
      value: "",
      // 轮播图数组
      bannerimglist: [],
      // 当前轮播图下标
      bannerindex: 0,
      // 标签栏数据
      tabsdata: [
        {
          title: "每日推荐",
          imgsrc: require("../assets/img/home/推荐.png"),
        },
        {
          title: "歌单",
          imgsrc: require("../assets/img/home/歌单.png"),
        },
        {
          title: "排行榜",
          imgsrc: require("../assets/img/home/排行榜.png"),
        },
      ],
      // 推荐歌单数据
      Recomplaydata: [],
      // 精选歌单数据
      Featuredplaydata: [],
      // 手指开始位置
      touchstartx: 0,
      // 手指移动位置
      touchmovex: 0,
      // 滑动条当前位置
      currentx: 0,
      // 移动距离
      movex: 0,
      // 最新歌曲推荐
      nwelistdata: [],
      // 控制滑动动画
      tranmove: "all 1s",
    };
  },
  created() {
    // 默认获取轮播图
    this.getbanner();
    // 获取推荐歌单
    this.Recomplaylist();
    // 获取精选歌单
    this.Featuredplaylist();
    // 获取推荐新音乐
    this.newsong();
  },
  // 获取vuex属性
  computed: {
    // 歌曲id
    audioid() {
      return this.$store.state.songid;
    },
    // 歌曲列表
    audioList() {
      return this.$store.state.audioList;
    },
    //
  },
  methods: {
    onChange(index) {
      this.bannerindex = index;
    },
    // 获取轮播图数据
    getbanner() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/banner",
        // post请求参数，boject
        params: {
          type: 1,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            // 获取对应的数据
            result.data.banners.map((item) => {
              // 构造对象，获取返回result对应的数据
              this.bannerimglist.push({
                pic: item.pic,
                titleColor: item.titleColor,
                typeTitle: item.typeTitle,
              });
            });
          }
        })
        .catch((err) => {});
    },
    // 获取推荐歌单
    Recomplaylist() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/personalized",
        // post请求参数，object
        params: {},
      })
        .then((result) => {
          if (result.data.code == 200) {
            // 循环获取每一项歌单的数据
            result.data.result.map((v) => {
              // 把每一个歌单作为对象推到歌单数组中
              this.Recomplaydata.push({
                picUrl: v.picUrl,
                name: v.name,
                playCount: v.playCount,
                id: v.id,
              });
            });
            this.Recomplaydata.splice(6);
          }
        })
        .catch((err) => {});
    },
    // 获取精选歌单
    Featuredplaylist() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/top/playlist/highquality",
        // post请求参数，object
        params: {},
      })
        .then((result) => {
          if (result.data.code == 200) {
            // 循环获取每一项歌单的数据
            result.data.playlists.map((v) => {
              // 把每一个歌单作为对象推到歌单数组中
              this.Featuredplaydata.push({
                picUrl: v.coverImgUrl,
                name: v.name,
                playCount: v.playCount,
                id: v.id,
              });
            });
            this.Featuredplaydata.splice(6);
          }
        })
        .catch((err) => {});
    },
    // 获取私人定制歌曲
    newsong() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/top/song",
        // post请求参数，object
        params: {
          type: 0,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            let newsongarr = result.data.data.slice(10, 19);
            // 循环获取每一项歌单的数据
            newsongarr.map((v) => {
              // 把每一个歌单作为对象推到歌单数组中
              this.nwelistdata.push({
                imgurl: v.album.blurPicUrl,
                songname: v.album.name,
                songsinger: v.album.artists[0].name,
                musicid: v.id,
                exclusive: v.exclusive,
              });
            });
          }
        })
        .catch((err) => {});
    },
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
    },
    // 手指松开
    touchend(event) {
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
    // 添加音乐id到vuex
    sendsongid(musicid) {
      this.$store.commit("changesongid", musicid);
    },
    // 跳转到音乐播放器并且添加id
    audioplayshow(musicid) {
      this.$store.commit("audioplayshow", true);
      this.sendsongid(musicid);
    },
    // 播放全部新音乐
    playallnewsong() {
      this.nwelistdata.map((v) => {
        // 发起获取请求
        this.axios({
          // 请求方法类型
          method: "get",
          // 地址
          url: "/song/url",
          // post请求参数，object
          params: {
            id: v.musicid,
          },
        })
          .then((result) => {
            if (result.data.code == 200) {
              let nwelist = {
                id: v.musicid,
                name: v.songname,
                url:result.data.data[0].url
              };
              this.audioList.push(nwelist);
            }
          })
          .catch((err) => {});
      });
      this.$store.commit("addurlaudioList", this.audioList);
    },
    // 搜索界面
    focus(){
      this.$router.push({name:"Search"})
    },

    //点击歌单跳到歌单页面
    playList(id){
      console.log('发送歌单的id==>',id)
      this.$router.push({name: 'PlayList' , query:{playListId: id} })
    },
  },
};
</script>
