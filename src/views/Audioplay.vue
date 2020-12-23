<template>
  <div class="audioplay">
    <div class="audioplay-box">
      <!-- 模糊背景图 -->
      <div class="blur-bgimg">
        <img :src="audioimg" />
      </div>
      <!-- audio播放器 -->
      <div class="audio-play-box">
        <!-- 头部 -->
        <div class="audio-play-top">
          <div class="audio-top-box">
            <!-- 返回图标 -->
            <div class="goback-btn" @click="playershow">
              <van-icon name="arrow-left" />
            </div>
            <!-- 歌曲名字 -->
            <div class="audio-top-songname">
              <div class="audio-song-info">
                <div class="song-name">{{ songdetaildata.songname }}</div>
                <div class="song-artis" @click="gosingerdetail">
                  <span>{{ songdetaildata.singername }}</span>
                  <span class="go-artis">
                    <van-icon name="arrow" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 中间部分 -->
        <div class="audio-play-middle">
          <!-- 左边旋转图 -->
          <div
            class="audio-middle-fl"
            :class="islyrics ? '' : 'disnone'"
            @click="changelyrics(false)"
          >
            <!-- 歌曲旋转缩略图 -->
            <div class="song-img-animation">
              <div class="cd-wapper">
                <div class="cd-play" :class="hasplay ? 'running' : 'paused'">
                  <img class="autoimg" :src="albumimg" />
                </div>
              </div>
            </div>
            <!-- 小歌词高亮 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ smalllyric }}</div>
            </div>
          </div>
          <!-- 右边歌词部分 -->
          <div
            class="audio-middle-fr"
            :class="islyrics ? 'disnone' : ''"
            @click="changelyrics(true)"
          >
            <div class="audio-lyrics-box">
              <ul class="audio-lyrics" :style="{ top: `${audiolyricstop}px` }">
                <li
                  class="lyrics-item"
                  :class="{ active: currentRow == index }"
                  v-for="(item, index) in lyriclist"
                  :key="index"
                >
                  {{ item.text }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 歌曲点赞收藏栏 -->
        <div class="song-like-tabs">
          <div class="mv-like-box">
            <div
              class="mv-like-item"
              v-for="(item, index) in musiclikedata"
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

        <!-- 歌曲控制器 -->
        <div class="audioplayer">
          <Audioplayer
            ref="audioPlayer"
            :audio-list="audioList.map((elm) => elm.url)"
            @play="playing(true)"
            @pause="playing(false)"
            @timeupdate="lyricautoscroll"
            @showaudiolist="audiolistshow"
          />
        </div>
      </div>
    </div>
    <!-- 播放列表 -->
    <div class="audiolist">
      <van-popup v-model="islistshow" round position="bottom">
        <div class="audio-list">
          <!-- 标题 -->
          <div class="audio-list-title">播放列表</div>
          <!-- 列表 -->
          <div class="audio-list-box">
            <ul class="audio-ul">
              <li
                class="audio-item clearfix"
                v-for="(item, index) in audioList"
                :key="index"
                @click="playaudio(item)"
              >
                <div
                  class="song-list-name fl one-text"
                  :class="{ 'audio-active': index == currentplayIndex }"
                >
                  {{ item.name }}
                </div>
                <!-- 小动画 -->
                <div class="musicani fl" v-if="index == currentplayIndex">
                  <div class="spectrum spectrum1"></div>
                  <div class="spectrum spectrum2"></div>
                  <div class="spectrum spectrum3"></div>
                </div>

                <van-icon
                  class="fr"
                  name="cross"
                  @click.stop="delaudio(index)"
                />
              </li>
            </ul>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/less/audioplay.less";
import Audioplayer from "../components/playcompon/Playcompon";
export default {
  name: "Audioplay",
  components: {
    Audioplayer,
  },
  data() {
    return {
      //   music地赞评论数
      musiclikedata: [
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
      // 歌曲详情
      songdetaildata: {},
      // 歌曲是否正在播放
      hasplay: false,
      // 当前歌曲的url和歌名
      songnameurl: {},
      // 切换转盘和歌词
      islyrics: true,
      // 歌词
      lyriclist: [],
      // 歌词滚动距离
      audiolyricstop: 150,
      // 歌词高亮下标
      currentRow: 0,
      // 旧的currentTime
      oldcurrentTime: 0,
      // 小歌词
      smalllyric: "",
      // 歌曲列表展示
      islistshow: false,
      // 当前播放列表下标
      currentplayIndex: 0,
      // 封面图
      albumimg:""
    };
  },
  created() {},
  // 侦听器
  watch: {
    audioid() {
      // 获取歌曲详情
      this.getsongdetail();
      // 获取歌曲url
      this.hasaudio();
      // 获取歌词
      this.getmusiclyric();
    },
    currentIndex() {
      this.changecurrentIndex();
    },
    audioimg(){
      this.albumimg = this.audioimg
    }
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
    // 当前播放下标
    currentIndex() {
      return this.$store.state.currentIndex;
    },
    // 获取歌曲封面图
    audioimg(){
      return this.$store.state.audioimg
    }
  },
  methods: {
    // 点击高亮
    isclick(item) {
      // 点击取消或喜欢设置高亮
      item.isclick = !item.isclick;
    },
    // 是否正在播放
    playing(bol) {
      let bool = !!bol;
      this.hasplay = bol ? true : false;
    },
    // 播放器隐藏
    playershow() {
      this.$store.commit("audioplayshow", false);
    },
    // 获取歌曲详情
    getsongdetail() {
      this.songnameurl = [];
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/song/detail",
        // post请求参数，object
        params: {
          ids: this.audioid,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            let songinfo = result.data.songs[0];
            this.songdetaildata = {
              singername: songinfo.ar[0].name,
              songname: songinfo.name,
              albumid: songinfo.al.id,
              singerid: songinfo.ar[0].id,
            };
            this.songnameurl.name = songinfo.name;
            this.songnameurl.id = this.audioid;
            // 获取歌曲封面图
            this.getsongalbum();
          }
        })
        .catch((err) => {});
    },
    // 获取歌曲封面图
    getsongalbum() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/album",
        // post请求参数，object
        params: {
          id: this.songdetaildata.albumid,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            let blurPicUrl = result.data.album.blurPicUrl;
            // 把缩略图传到vuex中
            this.$store.commit('changeaudioimg',blurPicUrl)
          }
        })
        .catch((err) => {});
    },
    // 查看音乐列表是否已经存在音乐
    hasaudio() {
      console.log("歌曲列表 =》》", this.audioList);
      // 列表有音乐，判断是否已经存在当前所播放的音乐
      if (this.audioList.length > 0) {
        let songidarr = [];
        this.audioList.map((v) => {
          songidarr.push(v.id);
        });
        let index = songidarr.indexOf(this.audioid);
        // 存在音乐，直接在列表中查找下标播放，不添加
        if (index > -1) {
          // 改变当前播放的下标
          this.$store.commit("changecurrentIndex", index);
          return;
        }
        // 不存在，新加对象到列表中
        else {
          this.getsongurl();
        }
      } //列表没有音乐，新加对象到列表
      else {
        this.getsongurl();
      }
    },
    // 查询歌曲url
    getsongurl() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/song/url",
        // post请求参数，object
        params: {
          id: this.audioid,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.songnameurl.url = result.data.data[0].url;
            this.audioList.push(this.songnameurl);
            this.$store.commit("addurlaudioList", this.audioList);
            this.$store.commit("changecurrentIndex", this.audioList.length - 1);
          }
        })
        .catch((err) => {});
    },
    // 切换转盘和歌词
    changelyrics(bool) {
      this.islyrics = bool;
    },
    // 获取歌词
    getmusiclyric() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/lyric",
        // post请求参数，object
        params: {
          id: this.audioid,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.lyricscroll(result.data.lrc.lyric);
          }
        })
        .catch((err) => {});
    },
    // 歌词解析
    lyricscroll(text) {
      // 歌曲切换格式化歌词
      this.lyriclist = [];
      // 格式化当前位置
      this.audiolyricstop = 150;
      let arr = text.split("\n"); //原歌词文本已经换好行了方便很多，我们直接通过换行符“\n”进行切割
      let row = arr.length; //获取歌词行数
      for (let i = 0; i < row; i++) {
        let temp_row = arr[i]; //现在每一行格式大概就是这样"[00:04.302][哈利路亚]";
        let temp_arr = temp_row.split("]"); //我们可以通过“]”对时间和文本进行分离 “ ["[00:04.302"，"[哈利路亚" ] ”
        let text = temp_arr.pop(); //把歌词文本从数组中剔除出来，获取到歌词文本了！
        //再对剩下的歌词时间进行处理
        temp_arr.forEach((element) => {
          let obj = {};
          let time_arr = element.substr(1, element.length - 1).split(":"); //先把多余的“[”去掉，再分离出分、秒
          let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[1]); //把时间转换成与currentTime相同的类型，方便待会实现滚动效果
          obj.time = s;
          obj.text = text;
          this.lyriclist.push(obj); //每一行歌词对象存到组件的lyric歌词属性里
        });
      }

      this.smalllyric=this.lyriclist[0].text
      this.lyriclist.sort((a, b) => {
        //设置一下排序规则
        return a.time - b.time;
      });
    },
    // 歌词滚动
    lyricautoscroll(event) {
      let currentTime = Math.ceil(event.target.currentTime);
      // 限制：上一次输出的事件跟这次输出时间相同，不做处理
      if (this.oldcurrentTime == currentTime) {
        return;
      } else {
        this.oldcurrentTime = currentTime;
        this.lyriclist.forEach((element, index) => {
          if (currentTime == element.time) {
            this.audiolyricstop -= 30;
            this.currentRow = index; //通过比较我们歌词属性里的时间与当前播放时间，来定位到该歌词
            // 小歌词高亮
            this.smalllyric = element.text;
          }
        });
      }
    },
    // 去往歌手详情页
    gosingerdetail() {
      this.$router.push({
        name: "Singer",
        query: { singerId: this.songdetaildata.singerid },
      });
      this.$store.commit("audioplayshow", false);
    },
    // 展示歌曲列表
    audiolistshow() {
      this.islistshow = true;
    },
    // 点击播放列表进行播放
    playaudio(item) {
      this.$store.commit("changesongid", item.id);
      console.log(this.audioList);
    },
    changecurrentIndex() {
      this.currentplayIndex = this.currentIndex;
    },
    // 删除播放列表里的歌曲
    delaudio(index) {
      console.log("我是来看看的", this.audioList);
      if (this.audioList.length == 1) {
        this.$toast("留一首听听吧大爷");
        return;
      } else if (index != this.currentIndex) {
        if (index > this.currentIndex) {
          this.audioList.splice(index, 1);
          this.$store.commit("addurlaudioList", this.audioList);
        } else {
          this.audioList.splice(index, 1);
          this.$store.commit("addurlaudioList", this.audioList);
          this.currentplayIndex -= 1;
        }
      } else {
        this.audioList.splice(index, 1);
        this.$store.commit("addurlaudioList", this.audioList);
        this.$store.commit("changesongid", this.audioList[index - 1].id);
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>