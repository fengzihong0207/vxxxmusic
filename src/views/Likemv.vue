<template>
  <div class="likemv">
    <Liketop :title="toptitle"> </Liketop>

    <!-- mv盒子 -->
    <div class="like-mv-list">
      <div class="like-mv-box">
        <div class="item-main3" v-for="(item,index) in mvdata" :key="index" @click="goMv(item)">
          <div class="fl main3-img-box">
            <img
              class="autoimg"
              :src="item.postersrc"
            />
            <div class="mv-play-count">
              <div class="fl count-img">
                <img
                  class="autoimg play-img"
                  src="../assets/img/singer/play.png"
                  alt=""
                />
              </div>
              <div class="fl count">{{item.playcount | decimal}}万</div>
            </div>
          </div>
          <div class="fl main3">
            <div class="main3-name">{{item.mvtitle}}</div>
            <div class="main3-time">{{item.artistname}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/likemv.less";
import Liketop from "../components/liketop/liketop";
export default {
  name: "Likemv",
  components: {
    Liketop,
  },
  data() {
    return {
      toptitle: "收藏mv",
      //   mv数据
      mvdata: [],
    };
  },
  computed: {
    //   获取vuex中收藏mv列表
    mvFavorites() {
      return this.$store.state.mvFavorites;
    },
  },
  created() {
    //   渲染mv列表
    this.mvlist();
  },
  methods: {
    //   渲染mv列表
    mvlist() {
      this.mvFavorites.map((v) => {
        this.getSingerMv(v);
      });
    },
    // 获取mv
    getSingerMv(mvid) {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/mv/detail",
        // post请求参数，object
        params: {
          mvid: mvid,
        },
      })
        .then((result) => {
          console.log(result);
          if (result.data.code == 200) {
            let data = result.data.data;
            // 构造遍历数组
            this.mvdata.push({
              mvtitle: data.name,
              postersrc: data.cover,
              mvid: data.id,
              artistname: data.artistName,
              artistId: data.artistId,
              playcount:data.playCount,
              artistimg: "",
              mvsrc: "",
            });
            this.getmvsrc(data.id);
            this.getartistimg(data.artistId);
          }
        })
        .catch((err) => {});
    },
    // 获取mv视频地址
    getmvsrc(id) {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/mv/url",
        params: {
          id: id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            let mvid = result.data.data;
            for (let i = 0; i < this.mvdata.length; i++) {
              if (this.mvdata[i].mvid == mvid.id) {
                this.mvdata[i].mvsrc = mvid.url;
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取mv歌手头像
    getartistimg(id) {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/artist/detail",
        params: {
          id: id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            let singer = result.data.data.artist;
            for (let i = 0; i < this.mvdata.length; i++) {
              if (this.mvdata[i].artistId == singer.id) {
                this.mvdata[i].artistimg = singer.cover;
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 跳转到mv页面
    goMv(item) {
        console.log(item)
        this.$router.push({name: 'Mvdetail', query: {mvdata : item}})
    },
  },
};
</script>

<style lang="less" scoped>
</style>