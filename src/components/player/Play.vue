<template>
  <div class="play">
        

      <div>
        <!-- <Audioplayer
          ref="audioPlayer"
          :audio-list="audioList.map((elm) => elm.url)"
        /> -->
      </div>
      <!--  -->
  </div>
</template>


<script>
import  Audioplayer  from "../playcompon/Playcompon";
export default {
  name: "Play",
  data() {
    return {
      audioList: [
        {
          name: "音频1",
          url:
            "http://m8.music.126.net/20201207002508/50c9413866ee0358c2826dcde3da3b58/ymusic/0fd6/4f65/43ed/a8772889f38dfcb91c04da915b301617.mp3",
        },
        {
          name: "音频2",
          url:
            "http://m8.music.126.net/20201207002556/b48a7ef1f1e6247072d9b7138cd91c68/ymusic/c77a/a835/4cf9/230be6702e804d761ad83a865c822913.mp3",
        },
        {
          name: "音频3",
          url:
            "http://m8.music.126.net/20201207002610/4d7c4b9d048c7afe5dc1e639d0e0a75e/ymusic/fa6d/eec5/0a4d/508daa7382cbff346af10e353c871c62.mp3",
        },
      ],
    };
  },
  components: {
    Audioplayer,
  },
  computed: {
    audioEle() {
      return this.$store.state.audioElement;
    },
  },
  created() {
    // 获取audio元素节点
    this.$nextTick(() => {
      this.getAudioele(this.$refs.audio);
    });
  },
  methods: {
    // 把节点传到vuex中作公共数据state
    getAudioele(audio) {
      this.$store.commit("getaudioele", audio);
    },
  },
};
</script>

<style lang="less" scoped>
</style>