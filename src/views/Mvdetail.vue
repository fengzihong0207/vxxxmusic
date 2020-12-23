<template>
  <div class="mvdetail">
    <!-- 视频盒子 -->
    <div class="video-box clearfix">
      <!-- 返回标 -->
      <div class="gomv" @click="gomv"><van-icon name="arrow-left" /></div>
      <video-player
        ref="video"
        class="autoimg video"
        :playsinline="true"
        :options="playerOptions"
      >
      </video-player>
    </div>
    <!-- 标题与作者信息-->
    <div class="mv-info-box">
      <div class="mvtitle two-text">
        {{ this.mvdata.mvtitle }}
      </div>
      <div class="avatarinfo clearfix">
        <div class="avatarmsg fl clearfix">
          <div class="avatarimg fl">
            <img class="autoimg" :src="this.mvdata.artistimg" />
          </div>
          <div class="avatername fl">{{ this.mvdata.artistname }}</div>
        </div>
        <div class="careavatar fr">
          <span>点击关注</span>
        </div>
      </div>
    </div>
    <!-- 视频点赞评论 -->
    <div class="mv-like">
      <div class="mv-like-box">
        <div
          class="mv-like-item"
          v-for="(item, index) in mvlikedata"
          :key="index"
        >
          <van-icon
            :name="item.isclick ? item.activeicon : item.icon"
            @click="isclick(item)"
          />
          <div class="mv-count">{{ item.count }}</div>
        </div>
      </div>
    </div>
    <!-- 网友评论 -->
    <div class="commont-box">
      <div class="commont-list">
        <div class="nice-commont">精彩评论</div>
        <!-- 用户评论 -->
        <div class="user-commont-list">
          <div
            class="commont-item"
            v-for="(item, index) in mvcommont"
            :key="index"
          >
            <!-- 用户信息 -->
            <div class="user-info-box clearfix">
              <!-- 用户缩略图 -->
              <div class="user-img fl">
                <img class="autoimg" :src="item.avatarUrl" />
              </div>
              <!-- 用户姓名和发布时间 -->
              <div class="user-name-time fl">
                <div class="user-name">{{ item.nickname }}</div>
                <div class="time">{{ item.time | dCreateTime }}</div>
              </div>
              <!-- 点赞数 -->
              <div class="user-like fr clearfix">
                <div class="user-like-ount fl">{{ item.likedCount }}</div>
                <van-icon class="fl" name="good-job-o" />
              </div>
            </div>
            <!-- 评论内容盒子 -->
            <div class="commont-content">
              <div class="content two-text">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/mvdetail.less";
export default {
  name: "Mvdetail",
  data() {
    return {
      // 视频播放属性
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: true, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: "", // url地址
          },
        ],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: true, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
      // mv节点
      video: null,
      //   mv地赞评论数
      mvlikedata: [
        {
          title: "点赞",
          icon: "good-job-o",
          activeicon: "good-job",
          count: 1000,
          type: "likedCount",
          isclick: false,
        },
        {
          title: "收藏",
          icon: "like-o",
          activeicon: "like",
          count: 1000,
          type: "Favorites",
          isclick: false,
        },
        {
          title: "评论",
          icon: "smile-comment-o",
          activeicon: "smile-comment",
          count: 1000,
          type: "commentCount",
          isclick: false,
        },
        {
          title: "分享",
          icon: "share-o",
          activeicon: "share",
          count: 1000,
          type: "shareCount",
          isclick: false,
        },
      ],
      //   mv评论数据
      mvcommont: [],
      // 获取用户token值
      token: localStorage.getItem("token"),
    };
  },

  // vue实列后调用
  created() {
    // 截取传进来的mvid
    this.mvdata = this.$route.query.mvdata;
    // 获取mvurl
    this.playerOptions.sources[0].src = this.mvdata.mvsrc;
    // 获取mv点赞数
    this.mvlike();
    // 获取mv评论数据
    this.getmvcommont();
    // 获取是否有点赞收藏评论过
    this.islikeFavor();
  },
  // 计算属性，获取vuex数据
  computed: {
    // mv点赞列表数据
    mvlikelist() {
      return this.$store.state.mvlike;
    },
    // mv点赞列表数据
    mvFavoriteslist() {
      return this.$store.state.mvFavorites;
    },
    // mv分享状态
    mvshare(val) {
      return this.$store.state.mvshare;
    },
  },
  methods: {
    // 获取mv点赞数
    mvlike() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/mv/detail/info",
        // post请求参数，object
        params: {
          mvid: this.mvdata.mvid,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.mvlikedata.map((v) => {
              for (let key in result.data) {
                if (v.type == key) {
                  v.count = result.data[key];
                }
              }
            });
          }
        })
        .catch((err) => {});
    },
    // 获取mv评论数据
    getmvcommont() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/comment/mv",
        // post请求参数，object
        params: {
          id: this.mvdata.mvid,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            let commontdata = [];
            result.data.hotComments.map((v) => {
              commontdata.push({
                avatarUrl: v.user.avatarUrl,
                nickname: v.user.nickname,
                time: v.time,
                likedCount: v.likedCount,
                content: v.content,
              });
            });
            this.mvcommont = commontdata;
          }
        })
        .catch((err) => {});
    },
    // 点击高亮功能
    isclick(item) {
      // 判断localStorage的token值是否存在
      if (!this.token) {
        this.$toast("请登录账号");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 10);
      } else {
        // 点击取消或喜欢设置高亮
        item.isclick = !item.isclick;
        let title;
        // 判断点击类型
        if (item.type == "likedCount") {
          title = item.isclick ? "已点赞" : "取消点赞";
          this.$toast(title);
          item.count = item.isclick ? item.count + 1 : item.count - 1;
          this.like(item);
        } else if (item.type == "Favorites") {
          title = item.isclick ? "已收藏" : "取消收藏";
          item.count = item.isclick ? item.count + 1 : item.count - 1;
          this.$toast(title);
          this.Favorites(item);
        } else if (item.type == "commentCount") {
          item.count = item.isclick ? item.count + 1 : item.count - 1;
          this.commentCount(item);
          title = item.isclick ? "已评论" : "取消评论";
          this.$toast(title);
        } else {
          title = item.isclick ? "已分享" : "取消分享";
          item.count = item.isclick ? item.count + 1 : item.count - 1;
          this.$toast(title);
          this.share(item);
        }
      }
    },
    // mv点赞
    like(item) {
      if (item.isclick) {
        this.mvlikelist.push(this.mvdata.mvid);
      } else {
        this.mvlikelist.splice(this.mvlikelist.indexOf(this.mvdata.mvid), 1);
      }
      this.$store.commit("changemvlike", this.mvlikelist);
    },
    // mv收藏
    Favorites(item) {
      if (item.isclick) {
        this.mvFavoriteslist.push(this.mvdata.mvid);
      } else {
        this.mvFavoriteslist.splice(
          this.mvFavoriteslist.indexOf(this.mvdata.mvid),
          1
        );
      }
      this.$store.commit("changemvFavorites", this.mvFavoriteslist);
    },
    // mv评论
    commentCount(item) {
      let usercomment = {
        avatarUrl:
          "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089876787,777117486&fm=26&gp=0.jpg",
        content: "大家好我叫王路飞",
        likedCount: 100000,
        nickname: "王路飞",
        time: 2606328067918,
      };
      if (item.isclick) {
        this.mvcommont.unshift(usercomment);
      } else {
        this.mvcommont.shift(usercomment);
      }
    },
    // mv分享
    share(item) {
      if (item.isclick) {
        this.mvshare.push(this.mvdata.mvid);
      } else {
        this.mvshare.splice(this.mvshare.indexOf(this.mvdata.mvid), 1);
      }
      this.$store.commit("changemvshare", this.mvshare);
    },
    // 获取是否有点赞收藏评论过
    islikeFavor() {
      if (this.mvlikelist.indexOf(this.mvdata.mvid) > -1) {
        this.mvlikedata[0].isclick = true;
        this.mvlikedata[0].count += 1;
      }
      if (this.mvFavoriteslist.indexOf(this.mvdata.mvid) > -1) {
        this.mvlikedata[1].isclick = true;
        this.mvlikedata[1].count += 1;
      }
      if (this.mvshare.indexOf(this.mvdata.mvid) > -1) {
        this.mvlikedata[3].isclick = true;
        this.mvlikedata[3].count += 1;
      }
    },
    // 返回mv页面
    gomv() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
</style>