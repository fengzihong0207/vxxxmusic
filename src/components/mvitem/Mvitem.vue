<template>
  <div class="mvitem">
    <!-- mv列表 -->
    <div class="mv-item-box" @click.prevent="godetail">
      <!-- mv标题 -->
      <div class="mv-title">
        <span>{{ item.mvtitle }}</span>
      </div>
      <!-- mv播放缩略图 -->
      <div class="mv-small">
        <video-player
          ref="video"
          @play="playvideo($event)"
          class="autoimg video"
          :playsinline="true"
          :options="playerOptions"
        ></video-player>
      </div>
      <div class="mv-bottom clearfix">
        <!-- 歌手头像+名字 -->
        <div class="artist fl clearfix">
          <div class="artist-img fl">
            <img class="autoimg" :src="item.artistimg" />
          </div>
          <div class="artist-name fl">{{ item.artistname }}</div>
        </div>
        <!-- mv点赞+评论 -->
        <div class="Likecomment fr">
          <van-icon name="good-job-o" :badge="item.likedCount"></van-icon>
          <van-icon
            name="smile-comment-o"
            :badge="item.commentCount"
          ></van-icon>
        </div>
      </div>
    </div>
    <!-- mv详情页 -->
    <div class="mv-detail-box"></div>
  </div>
</template>

<script>
import "../../assets/less/mvitem.less";
export default {
  name: "Mvitem",
  data() {
    return {
      videoElement: [],
      // 视频属性
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: this.mvurl, // url地址
          },
        ],
        poster: this.poster, // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: true, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
    };
  },
  props: {
    item: {
      type: Object,
      default() {
        return {
          mvtitle: "侧田：我没有害过人！这首歌唱出了我的心声",
          likedCount: 1000,
          commentCount: 500,
          mvid: 5690061,
          playcount: 1000,
          artistname: "刘德华",
          artistimg:
            "https://p2.music.126.net/EL2R9tzkaLvpAkDpNTlxIQ==/109951165443367321.jpg",
        };
      },
    },
    mvurl: {
      type: String,
      default() {
        return {
          mvurl:
            "http://vodkgeyttp8.vod.126.net/cloudmusic/obj/core/4914503926/ec998b1a93511658ee55d50fcca8bae4.mp4?wsSecret=9dd5315af9c3387e8dc159f99c9a8ac4&wsTime=1605874832",
        };
      },
    },
    poster: {
      type: String,
      default() {
        return {
          postersrc:
            "https://p1.music.126.net/AGz7jlrXKhMevr3LyCHQXw==/109951165482711353.jpg",
        };
      },
    },
  },
  mounted() {
    this.videoElement = document.getElementsByTagName("video"); // 获取页面上所有的video对象
  },
  methods: {
    // 页面只能播放一个
    playvideo(e) {
      // 把视频数组传到父组件
      this.$emit("videoele", this.videoElement);
      // 暂停其他视频播放
      let currentVideo = e.el_.children[0].getAttribute("id", 64);
      for (let i = 0; i < this.videoElement.length; i++) {
        let id = this.videoElement[i].getAttribute("id");
        if (currentVideo != id) {
          this.videoElement[i].pause();
        }
      }
    },
    // 跑去详情页
    godetail(event) {
      let currentTime = this.$refs.video.$el.children[0].children[0]
        .currentTime;
      // 把当前视频播放时间传到vuex中作传递
      this.$store.commit("changvideocurrentTime", currentTime);
      // 生成传递参数
      let mvdetaildata = {
        mvtitle: this.item.mvtitle,
        artistname: this.item.artistname,
        mvsrc: this.item.mvsrc,
        artistimg: this.item.artistimg,
        mvid: this.item.mvid,
      };
      this.$router.push({ name: "Mvdetail", query: { mvdata: mvdetaildata } });
    },
  },
};
</script>

<style lang="less" scoped>
</style>