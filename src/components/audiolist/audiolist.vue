<template>
  <div class="audiolist">
    <van-popup v-model="show" round position="bottom">
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
                class="song-list-name fl"
                :class="{ 'audio-active': index == currentIndex }"
              >
                {{ item.name }}
              </div>
              <van-icon class="fr" name="cross" @click.stop="delaudio(index)" />
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "Audiolist",
  data() {
    return {
      show: this.isshow,
    };
  },
  computed: {
    // 歌曲列表
    audioList() {
      return this.$store.state.audioList;
    },
    // 当前播放下标
    currentIndex() {
      return this.$store.state.currentIndex;
    },
    // 播放列表是否显示
    isshow() {
      return this.$store.state.isaudiolistshow;
    },
  },
  watch: {
  },
  methods: {
    playaudio(item) {
      this.$store.commit("changesongid", item.id);
      console.log(this.audioList);
    },
    delaudio(index) {
      this.audioList.splice(index, 1);
      this.$store.commit("addurlaudioList", this.audioList);
    }
  },
};
</script>

<style lang="less" scoped>
.van-popup {
  height: 60%;
}
.van-popup--bottom {
  bottom: 10px;
  left: 0;
  width: 90%;
  margin: 0 5%;
  border-radius: 20px;
}
.audio-list {
  padding: 10px;
  box-sizing: border-box;
}
.audio-list-title {
  text-align: left;
  padding-left: 10px;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.audio-item {
  margin-bottom: 15px;
  font-size: 16px;
}
.van-icon {
  margin: 2px 0;
  color: #ccc;
}
.audio-active {
  color: #ff0033;
}
</style>