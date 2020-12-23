<template>
  <div class="hello">
    <div>
      <router-view />
    </div>
    <div class="nav-bottom">
      <div class="audio">
        <div class="play" @click="playershow" :class="isaudiopaly ? 'running' : 'paused'">
          <img class="auto-img" :src="audioImg ? audioImg : logoImg" />
        </div>
      </div>
      <div class="item">
        <div
          v-for="(item, index) in nav"
          :key="index"
          :class="{ active: isActiveindex == index }"
          @click="changeNav(item, index)"
        >
          <div class="icon-word">
            <div class="icon">
              <img
                class="autoimg"
                :src="isActiveindex == index ? item.icon2 : item.icon1"
              />
            </div>
            <div class="word">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: {
    msg: String,
  },

  data() {
    return {
      //点击的页面
      isActiveindex: 0,
      //底部导航的数据
      nav: [
        {
          title: "发现",
          icon1: require("../assets/img/faxian1.png"),
          icon2: require("../assets/img/faxian2.png"),
          name: "Home",
        },
        {
          title: "乐库",
          icon1: require("../assets/img/yueku1.png"),
          icon2: require("../assets/img/yueku2.png"),
          name: "Musiclibrary",
        },
        {
          title: "MV",
          icon1: require("../assets/img/mv1.png"),
          icon2: require("../assets/img/mv2.png"),
          name: "Mv",
        },
        {
          title: "我的",
          icon1: require("../assets/img/wode1.png"),
          icon2: require("../assets/img/wode2.png"),
          name: "My",
        },
      ],

      //正在播放的歌曲封面图片
      audioImg: '',
      logoImg: require('../assets/img/logo.png')
    };
  },
  created() {

    //如果存在正在播放的歌曲
    if(this.$store.state.audioimg){
      this.audioImg = this.$store.state.audioimg;
    }

    //读取本地中的activeIndex
    if(localStorage.getItem("activeIndex")){
      this.isActiveindex = localStorage.getItem("activeIndex");
    }
  },

  watch: {
    audioplayshow() {
      this.audioImg = this.$store.state.audioimg;
    },
  },

  computed:{

    audioplayshow() {
      return this.$store.state.isaudioplayshow;
    },

    //音乐是否在播放
    isaudiopaly(){
      return this.$store.state.isaudioplay;
    },


  },



  methods: {
    //切换tarbar
    changeNav(item, index) {
      if (this.isActiveindex == index) {
        return;
      } else {
        this.isActiveindex = index;
        localStorage.setItem("activeIndex", this.isActiveindex);
        this.$router.push({ name: item.name });
      }

    },
    playershow(){
      this.$store.commit("audioplayshow", true)
    }
  },
};
</script>


<style scoped lang="less">
.nav-bottom {
  width: 100%;
  height: 58px;
  position: fixed;
  bottom: 0;
}
.audio {
  width: 25%;
  height: 58px;
  float: left;
  position: relative;
  background: radial-gradient(
        100px 73px at top left,
        transparent 52px,
        #eee 52px
      )
      right,
    radial-gradient(100px 73px at top right, transparent 52px, #eee 52px) left;
  background-size: 50% 100%;
  background-repeat: no-repeat;
}
.item {
  width: 75%;
  height: 58px;
  float: left;
  background: radial-gradient(11px 23px at top left, transparent 7px, #eee 2px)
    left;
  background-size: 100%;
  background-repeat: no-repeat;
  display: flex;
  > div {
    flex: 1;
  }
}
.play {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #eee;
  position: absolute;
  bottom: 26px;
  left: 12px;
  overflow: hidden;
  animation: cdplay 20s linear infinite;


  > img {
    width: 100%;
    height: 72px;
    display: block;
  }
}

.paused{
  animation-play-state: paused;
}
.running{
  animation-play-state: running;
}

@keyframes cdplay {
  0% {
      transform: rotate(0);
  }

  100% {
      transform: rotate(1turn);
  }
}

.icon-word {
  padding: 8px;

  .icon {
    width: 22px;
    height: 26px;
    margin: 0 auto;
  }
  .word {
    height: 16px;
    line-height: 16px;
    text-align: center;
  }
}

.active {
  color: #ff0033;
}

</style>