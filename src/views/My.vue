<template>
  <div class="my">
    <!-- 我的信息 -->
    <div class="my-information">
      <div class="my-information-box">
        <div class="fl my-img-box">
          <img class="auto-img" :src="myData.img" />
        </div>
        <div class="fr my-name-lv-icon">
          <div class="my-name">{{ myData.name }}</div>
          <div class="my-lv">Lv {{ myData.lv }}</div>
        </div>
      </div>
    </div>

    <!-- 我喜欢/收藏MV/历史/安全中心 -->
    <div class="my-item-box">
      <div class="my-item" v-for="(item, index) in myItem" :key="index" @click="gomylike(item.path)">
        <div class="my-item-icon">
          <van-icon :name="item.icon" color="#ff0033" size="36" />
        </div>
        <div class="my-item-title">{{ item.title }}</div>
      </div>
    </div>

    <!-- 我的歌单 -->
    <div class="my-playlist">
      <div class="playlist-create-collect">
        <van-tabs v-model="active" scrollspy sticky>
          <van-tab
            v-for="(item, index) in indexList"
            :key="index"
            :title="item"
          >
            <div class="item-box">
              <!-- 小标题 -->
              <div class="item-title-set">
                <div class="fl item-title">我的{{ item }} (7个)</div>
                <div class="fr item-set">
                  <img class="auto-img" src="../assets/img/my/sandian.png" />
                </div>
              </div>

              <!-- 单个歌单 -->
              <div class="item-content">
                <div class="fl content-img">
                  <img class="auto-img" src="../assets/img/logo.png" />
                </div>
                <div class="fl content-name-count">
                  <div class="content-name">鸿鸿鸿的歌单</div>
                  <div class="content-count">共56首</div>
                </div>
              </div>
              <div class="item-content">
                <div class="fl content-img">
                  <img class="auto-img" src="../assets/img/logo.png" />
                </div>
                <div class="fl content-name-count">
                  <div class="content-name">鸿鸿鸿的歌单</div>
                  <div class="content-count">共56首</div>
                </div>
              </div>
              <div class="item-content">
                <div class="fl content-img">
                  <img class="auto-img" src="../assets/img/logo.png" />
                </div>
                <div class="fl content-name-count">
                  <div class="content-name">鸿鸿鸿的歌单</div>
                  <div class="content-count">共56首</div>
                </div>
              </div>
              <div class="item-content">
                <div class="fl content-img">
                  <img class="auto-img" src="../assets/img/logo.png" />
                </div>
                <div class="fl content-name-count">
                  <div class="content-name">鸿鸿鸿的歌单</div>
                  <div class="content-count">共56首</div>
                </div>
              </div>
              <div class="item-content">
                <div class="fl content-img">
                  <img class="auto-img" src="../assets/img/logo.png" />
                </div>
                <div class="fl content-name-count">
                  <div class="content-name">鸿鸿鸿的歌单</div>
                  <div class="content-count">共56首</div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/my.less";
import Top from "../components/top/Top";

export default {
  name: "My",

  //注册组件
  components: {
    Top,
  },

  data() {
    return {
      //个人信息
      myData: {
        img: "../assets/img/logo.png",
        name: "南方的枫",
        lv: 4,
      },

      // 我喜欢/收藏MV/历史/安全中心
      myItem: [
        {
          icon: "like",
          title: "我喜欢",
          path: "Likesong",
        },
        {
          icon: "star",
          title: "收藏的MV",
          path: "Likemv",
        },
        {
          icon: "play-circle",
          title: "历史播放",
          path: "Historyplay",
        },
        {
          icon: "setting",
          title: "安全中心",
          path: "Securit",
        },
      ],

      indexList: ["创建歌单", "收藏歌单"],
      active: "创建歌单",
      // 获取用户token值
      token: localStorage.getItem("token"),
      //   获取用户uid的值
      uid: localStorage.getItem("uid"),
      //   用户信息data
      userdata: {},
    };
  },
  created() {
    // 获取用户token值
    this.getusertoken();
  },
  methods: {
    // 获取用户token值
    getusertoken() {
      // 判断localStorage的token值是否存在
      if (!this.token) {
        this.$toast("请登录账号");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 10);
      } else {
        //   初始化用户界面
        this.initusermsg();
      }
    },
    //初始化用户界面
    initusermsg() {
      // 发起请求
      this.axios({
        // 请求方法类型
        method: "GET",
        // 地址
        url: "/user/detail",

        // GET请求参数
        params: {
          uid: this.uid,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.myData = {
              name: result.data.profile.nickname,
              img: result.data.profile.avatarUrl,
              lv: result.data.level,
            };
          }
          console.log("获取用户信息成功", result);
        })
        .catch((err) => {});
    },
    // 
    gomylike(path){
      this.$router.push({name:path})
    }
  },
};
</script>

<style lang="less" scoped>
</style>