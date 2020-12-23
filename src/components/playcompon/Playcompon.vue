<template>
  <div class="audio-player">
    <div
      v-show="showProgressBar"
      class="audio__progress-wrap"
      ref="audioProgressWrap"
      @click="initProgressBarPoint"
    >
      <div class="audio__progress" ref="audioProgress" />
      <div class="audio__progress-point" ref="audioProgressPoint" />
    </div>
    <!-- 进度条 -->
    <div v-show="showProgressBar" class="audio__time-wrap">
      <div class="audio__current-time">
        {{ currentTimeAfterFormat }}
      </div>
      <div class="audio__duration">
        {{ formatTime(duration) }}
      </div>
    </div>
    <!-- 控制按钮 -->
    <div class="audio__btn-wrap">
      <div class="audio-btn-box clearfix">
        <!-- 音量控制 -->
        <div class="audio__play-volume fl videobtn" >
          <div class="volume-btn" @click="showvolume">
            <img
              class="autoimg"
              src="../../assets/img/player/volume.png"
              alt=""
            />
          </div>

          <div class="audio__play-volume-progress-wrap" v-if="isshowvolume">
            <van-slider
              class="volumeinput"
              v-model="volumevalue"
              active-color="#ff0033"
              @input="changevolume"
              @drag-end="showbtn"
            />
          </div>
        </div>

      <div v-if="!isshowvolume">

        <!-- 上一首 -->
        <div
          v-show="showPrevButton"
          class="audio__play--previous fl videobtn"
          :class="{ disable: !isLoop && currentPlayIndex === 0 }"
          @click="playPrev"
        >
          <div class="prev-btn">
            <img
              class="autoimg"
              src="../../assets/img/player/prev.png"
              alt=""
            />
          </div>
        </div>

        <div v-if="isLoading" class="audio__loading fl">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <!-- 中间暂停播放 -->
        <template v-else>
          <!-- 播放 -->
          <div
            v-if="!isPlaying && showPlayButton"
            @click="play"
            class="audio__play--start fl videobtn"
          >
            <div class="play-btn">
              <img
                class="autoimg"
                src="../../assets/img/player/play.png"
                alt=""
              />
            </div>
          </div>
          <!-- 暂停 -->
          <div
            v-else-if="showPlayButton"
            @click="pause"
            class="audio__play--pause fl videobtn"
          >
            <div class="pause-btn">
              <img
                class="autoimg"
                src="../../assets/img/player/pause.png"
                alt=""
              />
            </div>
          </div>
        </template>
        <!-- 下一首 -->
        <div
          v-show="showNextButton"
          class="audio__play--next fl videobtn"
          :class="{
            disable: !isLoop && currentPlayIndex === audioList.length - 1,
          }"
          @click="playNext"
        >
          <div class="next-btn">
            <img
              class="autoimg"
              src="../../assets/img/player/next.png"
              alt=""
            />
          </div>
        </div>
        <!-- 播放列表 -->
        <div class="audiolist-box fl videobtn" @click="showaudiolist">
          <div class="audiolist-list">
            <img src="../../assets/img/player/playlist.png" />
          </div>
        </div>
      </div>

        <div class="audio__notice" v-show="isShowNotice">
          {{ noticeMessage }}
        </div>
      </div>
    </div>
    <!-- 音频 -->
    <audio
      ref="audio"
      class="audio-player__audio"
      :src="audioList[currentPlayIndex]"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedmetadata"
      @canplay="canplay"
    >
      浏览器太老咯，请升级浏览器吧~
    </audio>
  </div>
</template>

<script>
export default {
  name: "Playcompon",

  inheritAttrs: false,

  props: {
    // 音频播放列表
    audioList: {
      default: null,
      type: Array,
    },

    // 显示播放按钮
    showPlayButton: {
      default: true,
      type: Boolean,
    },

    // 显示上一首按钮
    showPrevButton: {
      default: true,
      type: Boolean,
    },

    // 显示下一首按钮
    showNextButton: {
      default: true,
      type: Boolean,
    },

    // 显示进度条
    showProgressBar: {
      default: true,
      type: Boolean,
    },

    // 播放前的回调函数
    beforePlay: {
      default: null,
      type: Function,
    },

    // 上一首前的回调函数
    beforePrev: {
      default: null,
      type: Function,
    },

    // 下一首前的回调函数
    beforeNext: {
      default: null,
      type: Function,
    },

    // 是否列表循环播放
    isLoop: {
      type: Boolean,
      default: true,
    },

    // 是否自动播放下一首
    isAutoPlayNext: {
      type: Boolean,
      default: true,
    },

    // 进度更新间隔
    progressInterval: {
      default: 1000,
      type: Number,
    },
  },

  data() {
    return {
      isIOS: /iPhone|iPad|iPod/i.test(window.navigator.userAgent), // 是否是IOS设备
      isPlaying: false, // 音频是否正在播放
      isDragging: false, // 是否正在拖拽音频进度
      isShowNotice: false,
      isLoading: false,
      timer: null,
      duration: "", // 音频持续时间
      currentTime: "", // 音频当前播放时间
      currentTimeAfterFormat: "", // 音频播放当时时间（格式化后）
      noticeMessage: "",
      currentPlayIndex: 0,
      iscanplay: false,
      volumevalue: 100, //音量值
      isshowvolume:false  //音量键是否显示
    };
  },
  computed: {
     // audio节点
    audioele() {
      return this.$store.state.audioele;
    },
    // 歌曲id
    audioid() {
      return this.$store.state.songid;
    },
    // 当前播放音乐的下标
    currentIndex() {
      return this.$store.state.currentIndex;
    },
    // 歌曲列表
    audioarr() {
      return this.$store.state.audioList;
    },
  },
  watch: {
    audioid() {
      this.audioplay();
    },
    currentPlayIndex() {
      // 修改vuex中的currentindex
      this.currentaudioIndex();
    },
    currentIndex() {
      this.audiocurrentIndex();
    },
    iscanplay(value) {
      if(value){
        this.play();
      }else{
        this.pause()
      }
    },
    isPlaying(){
      this.isaudioplay()
    }
  },
  created() {
    this.sendaudioele();
  },
  methods: {
    // 显示通知
    showNotice(opts = {}) {
      this.noticeMessage = opts.message;
      this.isShowNotice = true;

      window.setTimeout(() => {
        this.isShowNotice = false;
      }, opts.duration || 3000);
    },

    // 当媒介元素的持续时间以及其它媒介已加载数据时运行脚本
    onLoadedmetadata(event) {
      this.duration = this.$refs.audio.duration;
      this.initProgressBarDrag();
      this.$emit("loadedmetadata", event);
    },

    // 当前的播放位置发送改变时触发
    onTimeUpdate(event) {
      this.$emit("timeupdate", event);
    },

    // 格式化秒为分
    formatTime(second) {
      // 将秒数除以60，然后下舍入，既得到分钟数
      let hour;
      hour = Math.floor(second / 60);
      // 取得秒%60的余数，既得到秒数
      second = Math.ceil(second % 60);
      // 将变量转换为字符串
      hour += "";
      second += "";
      // 如果只有一位数，前面增加一个0
      hour = hour.length === 1 ? "0" + hour : hour;
      second = second.length === 1 ? "0" + second : second;
      return hour + ":" + second;
    },

    // 音频播放完毕
    onEnded(event) {
      this.currentTimeAfterFormat = this.formatTime(
        this.$refs.audio.currentTime
      );

      window.setTimeout(() => {
        this.pause();
        this.$emit("ended", event);

        if (this.isLoop && this.isAutoPlayNext) {
          this.playNext();
        }
      }, 1000);
    },

    // 初始化音频进度的拖拽逻辑
    initProgressBarDrag() {
      this.$refs.audioProgressPoint.addEventListener(
        "touchstart",
        (event) => {
          // 设置拖拽中
          this.isDragging = true;
        },
        false
      );
      this.$refs.audioProgressPoint.addEventListener(
        "touchmove",
        (event) => {
          let touch = event.touches[0];

          // 超出左边
          if (touch.pageX < this.$refs.audioProgressWrap.offsetLeft) {
            // 设置点点
            this.$refs.audioProgressPoint.style.left = 0;
            // 设置进度条
            this.$refs.audioProgress.style.width = 0;
            // 设置当前时间
            this.currentTime = 0;
            // 设置当前时间（格式化后）
            this.currentTimeAfterFormat = this.formatTime(this.currentTime);
            return;
          }

          // 超出右边
          if (
            touch.pageX >
            this.$refs.audioProgressWrap.offsetLeft +
              this.$refs.audioProgressWrap.offsetWidth
          ) {
            // 设置点点
            this.$refs.audioProgressPoint.style.left =
              this.$refs.audioProgressWrap.offsetWidth -
              this.$refs.audioProgressPoint.offsetWidth +
              "px";
            // 设置进度条
            this.$refs.audioProgress.style.width =
              this.$refs.audioProgressWrap.offsetWidth + "px";
            // 设置当前时间，0.1解决有的浏览器播放完了进度还会再走
            this.currentTime = this.duration - 0.1;
            // 设置当前时间（格式化后）
            this.currentTimeAfterFormat = this.formatTime(this.currentTime);
            return;
          }

          this.setPointPosition(touch.pageX);
          // 设置进度条
          this.$refs.audioProgress.style.width =
            touch.pageX - this.$refs.audioProgressWrap.offsetLeft + "px";
          // 设置当前时间
          this.currentTime =
            (this.$refs.audioProgress.offsetWidth /
              this.$refs.audioProgressWrap.offsetWidth) *
            this.duration;
          // 设置当前时间（格式化后）
          this.currentTimeAfterFormat = this.formatTime(this.currentTime);
        },
        false
      );
      this.$refs.audioProgressPoint.addEventListener(
        "touchend",
        (event) => {
          // 设置播放位置
          this.$refs.audio.currentTime = this.currentTime;
          // 设置未拖拽
          this.isDragging = false;
        },
        false
      );
    },

    // 设置点点位置
    setPointPosition(pageX) {
      // 设置点点
      this.$refs.audioProgressPoint.style.left =
        pageX -
        this.$refs.audioProgressPoint.offsetWidth / 2 -
        this.$refs.audioProgressWrap.offsetLeft +
        "px";
    },

    // 初始化音频进度的点击逻辑
    initProgressBarPoint(event) {
      // 设置当前时间
      this.currentTime =
        ((event.pageX - this.$refs.audioProgressWrap.offsetLeft) /
          this.$refs.audioProgressWrap.offsetWidth) *
        this.duration;
      // 设置播放位置
      this.$refs.audio.currentTime = this.currentTime;
      this.setPointPosition(event.pageX);
      // 设置进度条
      this.$refs.audioProgress.style.width =
        event.pageX - this.$refs.audioProgressWrap.offsetLeft + "px";
      // 设置当前时间（格式化后）
      this.currentTimeAfterFormat = this.formatTime(this.currentTime);
    },
    // 加载完毕可以播放
    canplay() {
      console.log("可以播放了");
      this.iscanplay = true;
    },
    // 播放中
    playing() {
      // 正在拖拽进度
      if (this.isDragging) {
        return;
      }

      this.currentTimeAfterFormat = this.formatTime(
        this.$refs.audio.currentTime
      );
      // 设置播放进度条
      this.$refs.audioProgress.style.width =
        (this.$refs.audio.currentTime / this.$refs.audio.duration) *
          this.$refs.audioProgressWrap.offsetWidth +
        "px";
      // 设置播放进度拖拽点
      this.$refs.audioProgressPoint.style.left =
        (this.$refs.audio.currentTime / this.$refs.audio.duration) *
          (this.$refs.audioProgressWrap.offsetWidth -
            this.$refs.audioProgressPoint.offsetWidth / 2) +
        "px";
      this.$emit("playing");
    },

    // 开始播放
    play() {
      this.isLoading = true;
      if (this.iscanplay) {
        let handlePlay = () => {
          this.$refs.audio
            .play()
            .then((event) => {
              this.$nextTick(() => {
                this.playing(),
                  (this.timer = window.setInterval(
                    this.playing,
                    this.progressInterval
                  ));
                this.isPlaying = true;
                this.isLoading = false;
              });
            })
            .catch((data) => {
              if (data.code === 9) {
                this.showNotice({
                  message: "加载失败，因为没有找到支持的源。",
                });

                if (this.isAutoPlayNext) {
                  window.setTimeout(() => {
                    this.playNext();
                  }, 1000);
                }
              }
              this.isLoading = false;
            });
          this.$emit("play");
        };
        // 解决 iOS 异步请求后无法播放
        if (this.isIOS) {
          this.$refs.audio.play();
          this.$refs.audio.pause();
        }

        if (this.beforePlay) {
          this.beforePlay((state) => {
            if (state !== false) {
              handlePlay();
            }
          });
          return;
        }

        handlePlay();
      }
    },

    // 暂停播放
    pause() {

      this.$refs.audio.pause();
      this.$nextTick(() => {
        this.clearTimer();
        this.isPlaying = false;
        this.$emit("pause");
      });
    },

    // 播放上一首
    playPrev() {
      if (this.currentPlayIndex <= 0 && !this.isLoop) {
        // 无上一首了
        return;
      }

      this.clearTimer();

      let handlePrev = () => {
        if (this.currentPlayIndex <= 0 && this.isLoop) {
          // 列表循环
          this.currentPlayIndex = this.audioList.length - 1;
        } else {
          this.currentPlayIndex--;
        }
        this.$nextTick(() => {
          this.iscanplay = false;
          this.$emit("play-prev");
        });
        // 切换上下首歌曲改变当前id
        this.changeplayindex();
      };

      if (this.beforePrev) {
        this.beforePrev((state) => {
          if (state !== false) {
            handlePrev();
          }
        });
        return;
      }
      handlePrev();
    },

    clearTimer() {
      window.clearInterval(this.timer);
      this.timer = null;
    },
    // 播放下一首
    playNext() {
      if (this.currentPlayIndex + 1 >= this.audioList.length && !this.isLoop) {
        // 无下一首了
        return;
      }

      this.clearTimer();

      let handleNext = () => {
        // 已经到达列表最后一首
        if (this.currentPlayIndex + 1 >= this.audioList.length && this.isLoop) {
          this.currentPlayIndex = 0;
        } else {
          this.currentPlayIndex++;
        }

        this.$nextTick(() => {
          this.iscanplay = false;
          this.$emit("play-next");
        });
        // 切换上下首歌曲改变当前id
        this.changeplayindex();
      };

      if (this.beforeNext) {
        this.beforeNext((state) => {
          if (state !== false) {
            handleNext();
          }
        });
        return;
      }
      handleNext();
    },
    // 歌曲id变化立即播放
    audioplay() {
      this.$nextTick(() => {
        this.play();
      });
    },
    // 修改vuex中的currentindex
    currentaudioIndex() {
      this.$store.commit("changecurrentIndex", this.currentPlayIndex);
      this.iscanplay = false;
    },
    // 修改当前播放下标
    audiocurrentIndex() {
      this.currentPlayIndex = this.currentIndex;
      this.iscanplay = false;
    },
    // 切换上下首歌曲改变当前id
    changeplayindex() {
      this.$store.commit(
        "changesongid",
        this.audioarr[this.currentPlayIndex].id
      );
    },
    // 提交audio节点到vuex
    sendaudioele() {
      this.$store.commit("getaudioele", this.$refs.audio);
    },
    // 改变音量
    changevolume(value){
      let volume = value / 100
      this.$refs.audio.volume = volume
    },
    // 音量键
    showvolume(){
      this.isshowvolume = !this.isshowvolume
    },
    // 音量拖动结束后隐藏
    showbtn(){
      this.isshowvolume = false
    },
    // 把列表按钮点击事件委托到父组件
    showaudiolist(){
      this.$emit('showaudiolist')
    },
    // 音频是否正在播放
    isaudioplay(){
      this.$store.commit('changeaudioplay',this.isPlaying)
    }
  },

  beforeDestroy() {
    this.pause();
  },
};
</script>

<style>
.audio-player {
  margin: 0 15px;
}

.audio-player .audio__btn-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.audio-player .audio__play__icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
  overflow: hidden;
  color: #e35924;
}

.audio-player .audio__play-volume {
  position: relative;
  height: 21px;
  cursor: pointer;
  color: #e35924;
  top: 10px;
  left: 15px;
}

.audio__play-volume-progress-wrap {
  width: 200px;
  position: relative;
  left: 45px; 
}
.volumeinput {
}
.audio-btn-box {
  width: 100%;
}
.videobtn {
  width: calc(100% / 5 - 20px) !important;
  text-align: center;
  margin: 0 10px;
}
.volume-btn {
  width: 60%;
  height: 60%;
}
.play-btn,
.pause-btn {
  width: 110%;
  height: 110%;
  position: relative;
  top: -5px;
}
.prev-btn,
.next-btn {
  width: 66%;
  height: 90%;
  margin: 10% 17%;
}
.audio-player .audio__play--previous.disable {
  opacity: 0.5;
}

.audio-player .audio__play--next.disable {
  opacity: 0.5;
}

.audio__notice {
  position: absolute;
  bottom: -15px;
  color: rgb(189, 178, 178);
  border-radius: 4px;
  font-size: 12px;
}

.audio-player .audio__progress-wrap {
  position: relative;
  background: #ddd;
  height: 2px;
  margin-top: 20px;
}

.audio-player .audio__progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: #ff0033;
}
.audiolist-box {
  position: relative;
  top: 5px;
}
.audio-player .audio__progress-point {
  position: absolute;
  left: 0;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-top: -8px;
  background: #ff0033;
}

.audio-player .audio__progress-point:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  background: #fff;
  border-radius: 50%;
}

.audio-player .audio__time-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 7px;
}

.audio-player .audio__current-time {
  font-size: 10px;
  color: rgb(0, 0, 0);
}

.audio-player .audio__duration {
  font-size: 10px;
  color: rgb(0, 0, 0);
}

.audio-player .audio-player__audio {
  display: block;
  margin: 0 auto;
}

.audio__loading {
  width: 45px;
  height: 45px;
  position: relative;
  margin: 0 10px;
}
.audio__loading span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff0033;
  position: absolute;
  animation: loading 1.04s ease infinite;
}

@keyframes loading {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

.audio__loading span:nth-child(1) {
  left: 0;
  top: 50%;
  margin-top: -4px;
  animation-delay: 0.13s;
}
.audio__loading span:nth-child(2) {
  left: 7px;
  top: 7px;
  animation-delay: 0.26s;
}
.audio__loading span:nth-child(3) {
  left: 50%;
  top: 0;
  margin-left: -4px;
  animation-delay: 0.39s;
}
.audio__loading span:nth-child(4) {
  top: 7px;
  right: 7px;
  animation-delay: 0.52s;
}
.audio__loading span:nth-child(5) {
  right: 0;
  top: 50%;
  margin-top: -4px;
  animation-delay: 0.65s;
}
.audio__loading span:nth-child(6) {
  right: 7px;
  bottom: 7px;
  animation-delay: 0.78s;
}
.audio__loading span:nth-child(7) {
  bottom: 0;
  left: 50%;
  margin-left: -4px;
  animation-delay: 0.91s;
}
.audio__loading span:nth-child(8) {
  bottom: 7px;
  left: 7px;
  animation-delay: 1.04s;
}
</style>
