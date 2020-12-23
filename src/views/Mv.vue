<template>
  <div class="mv">
    <Top :lefttext="mv"> </Top>
    <!-- 标签栏tabs -->
    <keep-alive>
      <div class="mv-tabs">
        <div class="mv-tabs-box">
          <van-tabs v-model="tabsindex" @change="changemvlist">
            <van-tab
              v-for="(item, index) in tabsdata"
              :key="index"
              :title="item.title"
            >
              <!-- 懒加载 -->
              <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没mv加载啦"
                offset="20"
                @load="loadData"
              >
                <Mvitem
                  ref="viedoele"
                  v-for="item in mvlistData"
                  :key="item.id"
                  :item="item"
                  :mvurl="item.mvsrc"
                  :poster="item.postersrc"
                  @videoele="getvideoele"
                >
                </Mvitem>
              </van-list>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </keep-alive>
  </div>
</template>

<script>
import "../assets/less/mv.less";
import Mvitem from "../components/mvitem/Mvitem";
import Top from "../components/top/Top";
export default {
  name: "Mv",
  components: {
    Mvitem,
    Top,
  },
  data() {
    return {
      //顶部头标签
      mv: "mv",
      //标签index下标
      tabsindex: 0,
      //  标签数据
      tabsdata: [
        {
          title: "推荐",
          url: "/mv/exclusive/rcmd",
        },
        {
          title: "最新",
          url: "/mv/first",
        },
        {
          title: "排行",
          url: "/top/mv",
        },
      ],
      //   获取全部mv列表
      mvlist: [],
      // 触发加载
      loading: false,
      //是否全部加载完成数据
      finished: false,
      //开始截取购物袋数据位置
      startIndex: 0,
      //每次触底懒加载截取8条数据
      dataCount: 4,
      //mv剩余已加载数据
      mvlistData: [],
      // 加载数据
      mvlodedata: [],
      // 视频节点
      videoElement: [],
    };
  },

  created() {
    //   默认获取推荐mv数据
    this.getmvlist("/mv/exclusive/rcmd");
  },
  methods: {
    //   获取mv列表
    getmvlist(url) {
      // 格式化mv列表数据
      this.mvlist = [];
      this.mvlistData = [];
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: url,
        // post请求参数，object
        params: {
          limit: 10,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            // 循环获取每一项歌单的数据
            result.data.data.map((v) => {
              this.getmvdetail(v.id);
            });
            this.loadData();
          }
        })
        .catch((err) => {});
    },
    // 获取mv详情
    getmvdetail(id) {
      // 发起获取请求
      this.axios({
        // 请求方法类型
        method: "get",
        // 地址
        url: "/mv/detail",
        // post请求参数，object
        params: {
          mvid: id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            let mvdata = result.data.data;
            // 构造遍历数组
            this.mvlist.push({
              mvtitle: mvdata.name,
              postersrc: mvdata.cover,
              mvid: mvdata.id,
              artistname: mvdata.artistName,
              likedCount: mvdata.subCount,
              commentCount: mvdata.commentCount,
              artistId: mvdata.artistId,
              artistimg: "",
              mvsrc: "",
            });
            this.getmvsrc(mvdata.id);
            this.getartistimg(mvdata.artistId);
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
            for (let i = 0; i < this.mvlist.length; i++) {
              if (this.mvlist[i].mvid == mvid.id) {
                this.mvlist[i].mvsrc = mvid.url;
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
            for (let i = 0; i < this.mvlist.length; i++) {
              if (this.mvlist[i].artistId == singer.id) {
                this.mvlist[i].artistimg = singer.cover;
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 切换mv列表
    changemvlist(index) {
      this.getmvlist(this.tabsdata[index].url);
      // 切换标签时，所有视频暂停播放
      for (let i = 0; i < this.videoElement.length; i++) {
        this.videoElement[i].pause();
      }
    },
    // 懒加载mv列表
    loadData() {
      setTimeout(() => {
        let mvlodedata = this.mvlist.slice(
          this.startIndex,
          this.startIndex + this.dataCount
        );

        this.startIndex += this.dataCount;
        this.mvlistData.push(...mvlodedata);
        if (mvlodedata.length < this.dataCount) {
          this.finished = true;
        } else {
          this.loading = false;
        }
      }, 1500);
    },
    // 获取子组件的视频节点
    getvideoele(ele) {
      this.videoElement = ele;
    },
  },
};
</script>

<style lang="less" scoped>
</style>