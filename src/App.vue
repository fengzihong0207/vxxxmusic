<template>
  <div id="app">
    <Audioplay class="Audioplay" :class="audioplayshow?'':'disnone'"> </Audioplay>

    <router-view class="router" :class="audioplayshow?'disnone':''"></router-view>
  </div>
</template>

<script>
import Audioplay from "./views/Audioplay";
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'

export default {
  name: "App",
  components: {
    Audioplay,
  },
  data() {
    return {};
  },
 computed:{
   audioplayshow() {
      return this.$store.state.isaudioplayshow;
    },
 }
};
</script>

<style lang="less">
body {
  font-size: 14px;
  touch-action: none;
}
#app {
  touch-action: none;
}
.autoimg {
  width: 100%;
  display: block;
}
.one-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.two-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.Audioplay{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.disnone{
  display: none;
}
</style>
