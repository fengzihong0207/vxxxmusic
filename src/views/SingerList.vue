<template>
    <div class="singerlist">

        <!-- 头部导航栏 -->
        <van-nav-bar title="全部歌手" left-text="返回" left-arrow @click-left="goBack">
            <template #right>
              <div class="player" @click="playPage" :class="isaudiopaly ? 'running' : 'paused' ">
                  <img class="auto-img" :src="audioimg">
              </div>
            </template>
        </van-nav-bar>

        <!-- 歌手分类 -->
        <div class="classify-box">
            <div class="title">歌手分类</div>
            <div class="classify">

                <!-- 歌手类型 -->
                <div class="type">
                    <div class="fl item" :class="index == typeIndex ? 'active' : ''" v-for="(item,index) in singerType" :key="index" @click="selectSingerType(index)">{{item.type}}</div>
                </div>
                <!-- 歌手地区 -->
                <div class="area">
                    <div class="fl item" :class="index == areaIndex ? 'active' : ''" v-for="(item,index) in singerArea" :key="index"
                    @click="selectSingerArea(index)">{{item.area}}</div>
                </div>

            </div>
        </div>
        

        <!-- 歌手列表 -->
        <div class="singer-list-box">
            <div class="title">歌手列表</div>

            <!-- 懒加载 -->
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
                <!-- 单个歌手 -->
                <div class="item" v-for="(item,index) in singerData" :key="index" @click="goSingerDetail(item.id)">
                    <div class="fl item-img">
                        <img class="auto-img" :src="item.img1v1Url">
                    </div>
                    <div class="fl name-size">
                        <div class="name">{{item.name}}</div>
                        <div class="size">
                            <div class="fl music-size">歌曲-{{item.musicSize}}</div>
                            <div class="fl album-size">专辑-{{item.albumSize}}</div>
                        </div>
                    </div>
                </div>

            </van-list>

        </div>


    </div>
</template>

<script>
    import '../assets/less/singerlist.less'
    export default {
        name: 'SingerList',

        data(){
            return{
                //歌手类型
                singerType: [
                    { type: '全部', tid: -1 },
                    { type: '男', tid: 1 },
                    { type: '女', tid: 2 },
                    { type: '组合', tid: 3 }
                ],
                //当前选中的歌手类型的下标
                typeIndex: 0,

                //歌手地区
                singerArea: [
                    { area: '全部', aid: -1 },
                    { area: '华语', aid: 7 },
                    { area: '欧美', aid: 96 },
                    { area: '日本', aid: 8 },
                    { area: '韩国', aid: 16 },
                    { area: '其他', aid: 0 }
                ],
                //当前选中的歌手地区的下标
                areaIndex: 0,


                //获取到歌手的数据
                singerData: [],

                //懒加载
                loading: true,
                finished: false,
                count: 0,
                singerModeData: [],
                aid: 0,
                tid: 0,

                //正在播放的歌曲的封面
                audioimg: '',
            }
        },


        created(){
            //获取歌手数据
            this.getSinger(-1,-1);

            //获取当前播放歌曲的封面
            if(this.$store.state.audioimg){
                this.audioimg = this.$store.state.audioimg;
            }
        },

        watch: {
            //监听播放歌曲的封面变化
            addioimg(){
                this.audioimg = this.$store.state.audioimg
            },
        },
        computed: {
            //播放歌曲的封面变化
            addioimg(){
                return this.$store.state.audioimg
            },
            //歌曲是否在播放
            isaudiopaly(){
                return this.$store.state.isaudioplay;
            },
            
        },



        methods: {
            //返回上一级
            goBack(){
                this.$router.go(-1);
            },

            //播放页面
            playPage(){
                this.$store.commit('audioplayshow',true);
            },

            //选择歌手类型
            selectSingerType(index){
                //重置数据
                this.count = 0;
                this.singerData = [];
                // this.singerModeData = [];
                this.finished = false;
                this.loading = true;

                //记录下标
                this.typeIndex = index;

                //获取tid
                let tid = this.singerType[index].tid;

                //获取aid
                let aid = this.singerArea[this.areaIndex].aid;


                //根据选择获取歌手
                this.getSinger(tid,aid);

            },

            //选择歌手地区
            selectSingerArea(index){
                //重置数据
                this.count = 0;
                this.singerData = [];
                // this.singerModeData = [];
                this.finished = false;
                this.loading = true;

                this.areaIndex = index;

                //获取aid
                let aid = this.singerArea[index].aid;

                //获取tid
                let tid = this.singerType[this.typeIndex].tid;

                //根据选择获取歌手
                this.getSinger(tid,aid);

            },

            //获取歌手数据
            getSinger(tid,aid){


                //加载提示
                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });
                // 发起获取请求
                this.axios({
                    // 请求方法类型
                    method: "get",
                    // 地址
                    url: "/artist/list",
                    params: {
                        limit: 60,
                        type: tid,
                        area: aid
                    },
                }).then((result) => {
                    this.$toast.clear();
                    console.log("获取的歌手result==>",result);
                    if(result.data.code == 200){

                        this.singerModeData = result.data.artists;
                        this.onLoad();
                    }else{
                        this.$Toast("加载歌手数据失败")
                    }
                }).catch((err) => {
                    this.$toast.clear();
                    console.log(err)
                });

            },

            //懒加载
            onLoad(){

                setTimeout(()=>{
                    let data = this.singerModeData;
                    for (let i = 0; i < 8; i++) {
                        if(i+this.count+1 > data.length){
                            return;
                        }
                        this.singerData.push(data[i+this.count])
                        // 数据全部加载完成
                        if (this.singerData.length == data.length) {
                            this.finished = true;
                        }
                    }
                    this.count += 8;
                    // 加载状态结束
                    this.loading = false;

                },1500)
            },

            //点击歌手进入详情页
            goSingerDetail(id){
                console.log('点击歌手的id==>',id);
                this.$router.push({ name: 'Singer', query:{singerId: id} });
            }

        }
    }
</script>

<style lang="less" scoped>

</style>