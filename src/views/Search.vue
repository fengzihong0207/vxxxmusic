<template>
  <div class="search">
    <!-- 头部导航栏 -->
    <Top
      :lefttext="lefttext"
      :cancel="topcancel"
      @backhome="iscancel"
      @search="searchsong"
      @input="changeinput"
    >
    </Top>
    <!-- 热搜栏 -->
    <div class="search-hot" v-if="isshowsearch">
      <div class="search-hot-box">
        <!-- 标题 -->
        <div class="search-hot-title">热搜榜</div>
        <!-- 热搜列表 -->
        <div class="search-hot-list">
          <ul class="search-hot-ul clearfix">
            <li
              class="search-hot-item fl"
              v-for="(item, index) in searchhot"
              :key="index"
              @click="nowsearh(item)"
            >
              <div class="search-hot-num fl">{{ index + 1 }}</div>
              <div class="search-hot-content fl one-text">
                {{ item.searchWord }}
              </div>
              <div class="search-hot-img fl">
                <img class="autoimg search-hot-src" :src="item.iconUrl" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 搜索后展示栏 -->
    <div class="search-data" v-else>
      <div class="search-data-box">
        <van-list
          v-model="searchLoading"
          :finished="searchFinished"
          finished-text="没有更多了"
          @load="getsearchdata"
        >
          <div
            class="item-main"
            v-for="(item, index) in songlistData"
            :key="item.musicid"
            @click="audioplayshow(item.musicid)"
          >
            <div class="fl number">{{ index + 1 }}</div>
            <div class="fl searchmain">
              <div class="name-from one-text clearfix">
                <div class="name one-text fl">{{ item.songname }} -</div>
                <div class="from fl">{{ item.songartists }}</div>
              </div>
            </div>
            <div
              class="song-play-button fr"
              @click.stop="sendsongid(item.musicid)"
            >
              <van-icon size="30" name="play-circle-o" color="#ff0033" />
            </div>
            <van-divider :hairline="false" />
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import Top from "../components/top/Top";
import "../assets/less/search.less";
export default {
  name: "Search",
  components: {
    Top,
  },
  data() {
    return {
      lefttext: "",
      topcancel: true,
      //   隐藏热搜栏
      isshowsearch: true,
      //   热搜数据
      searchhot: [],
      //   搜索后的数据
      searchdata: [],
           //懒加载
      searchLoading: false,
      searchFinished: false,
       //开始截取购物袋数据位置
      startIndex: 0,
      //每次触底懒加载截取8条数据
      dataCount: 11,
      //歌曲已加载数据
      songlistData: [],
    };
  },
  computed: {
    // 获取搜索框vuex的值
    searchmessage() {
      return this.$store.state.searchmessage;
    },
  },
  created() {
    //   获取搜索热榜
    this.getsearchhot();
  },
  methods: {
    //   点击取消回到首页
    iscancel() {
      this.$router.go(-1);
    },
    //   获取搜索热榜
    getsearchhot() {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/search/hot/detail",
        // post请求参数，object
        params: {},
      })
        .then((result) => {
          if (result.data.code == 200) {
            result.data.data.map((v) => {
              this.searchhot.push({
                searchWord: v.searchWord,
                score: v.score,
                iconUrl: v.iconUrl,
              });
            });
          }
          console.log(this.searchhot);
        })
        .catch((err) => {});
    },
    // 获取搜索数据
    searchsong() {
      this.isshowsearch = false;
      // 格式化数据
      this.searchdata = [];
      console.log(this.searchmessage);
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/search",
        // post请求参数，object
        params: {
          keywords: this.searchmessage,
          limit: 50,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            result.data.result.songs.map((v) => {
              this.searchdata.push({
                musicid: v.id,
                songname: v.name,
                songartists: v.artists[0].name,
              });
            });
          }
        })
        .catch((err) => {});
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
    // 立即搜索热搜
    nowsearh(item) {
      this.$store.commit("changesearch", item.searchWord);
      this.searchsong();
    },
    // 当前搜索框的值清空时回到热搜
    changeinput(value) {
      if (value.length == 0) {
        this.isshowsearch = true;
        this.songlistData = []
        this.startIndex = 0
        this.dataCount = 11
      }
    },
    // 懒加载
    getsearchdata(){
      setTimeout(() =>{
        let songlodedata = this.searchdata.slice(
          this.startIndex,
          this.startIndex + this.dataCount
        );
          console.log(this.songlistData)
        this.startIndex += this.dataCount
        this.songlistData.push(...songlodedata)
        if(songlodedata.length < this.dataCount){
          this.searchFinished = true
        }else{
          this.searchLoading = false
        }
      },1500)
    }
  },
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  /deep/ .van-nav-bar__right {
    width: 90% !important;
    left: 0;
  }
  .righttext {
    font-size: 16px;
    width: 50px;
    margin-left: 10px;
    color: #ff0033;
  }
}
</style>