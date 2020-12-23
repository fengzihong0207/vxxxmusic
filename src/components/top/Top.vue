<template>
  <div class="top">
    <!-- 搜索后 -->
    <van-nav-bar :left-text="lefttext">
      <template #right>
        <van-search
          v-model="searchmsg"
          placeholder="请输入搜索关键词"
          @focus="focus"
          @search="search"
          @input="input"
        />
        <div class="righttext" v-if="cancel" @click="backhome">取消</div>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: "Top",
  data() {
    return {
      // 绑定输入框的值
      searchmsg: "",
    };
  },
  props: {
    // 左侧栏标题
    lefttext: {
      type: String,
      default() {
        return "发现";
      },
    },
    cancel: false,
  },
  watch: {
    searchmessage(){
      this.nowmsg()
    }
  },
  computed: {
    // 获取搜索框vuex的值
    searchmessage() {
      return this.$store.state.searchmessage;
    },
  },
  methods: {
    focus() {
      this.$emit("isfocus");
    },
    backhome() {
      this.$emit("backhome");
    },
    changemsg() {
      },
    search(){
      this.$store.commit("changesearch", this.searchmsg);
      this.$emit("search");
    },
    nowmsg(){
      this.searchmsg = this.searchmessage
    },
    input(value){
      this.$emit("input",value);
    }
  },
};
</script>

<style lang="less" scoped>
.top {
  .van-search {
    padding: 0;
  }
  /deep/.van-nav-bar__text {
    font-size: 17px;
    font-weight: bold;
    color: #ff0033;
  }
  /deep/.van-icon {
    color: #ff0033;
  }
  /deep/.van-nav-bar {
    /deep/.van-nav-bar__right {
      width: 60%;
    }

    /deep/.van-search {
      width: 100%;
    }

    /deep/.van-search__content {
      border-radius: 20px;
    }
  }
}
</style>