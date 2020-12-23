<template>
    <div class="singer">
        <!-- 头部导航栏 -->
        <van-nav-bar title="歌手详情" left-text="返回" left-arrow @click-left="goBack">
            <template #right>
              <div class="player" @click="playPage" :class="isaudiopaly ? 'running' : 'paused'">
                  <img class="auto-img" :src="audioimg">
              </div>
            </template>
        </van-nav-bar>

        <!-- 歌手背景 -->
        <div class="bg-content-box">
            <img class="auto-img" :src="singerData.cover">

            <!-- 歌手描述 -->
            <div class="content-box">
                <div class="name">{{singerData.name}}</div>
                
                <div class="ranking" v-if="singerData.type == 1">歌手榜华语地区 No.{{singerData.ranking}}</div>
                <div class="ranking" v-else-if="singerData.type == 2">歌手榜欧美地区 No.{{singerData.ranking}}</div>
                <div class="ranking" v-else-if="singerData.type == 3">歌手榜韩国地区 No.{{singerData.ranking}}</div>
                <div class="ranking" v-else-if="singerData.type == 4">歌手榜日本地区 No.{{singerData.ranking}}</div>
                
                <div class="des" @click="singerDes">{{singerData.briefDesc}}</div>
                <van-popup v-model="isShow">
                    <div class="des-detail-box">{{singerData.briefDesc}}</div>
                </van-popup>
            </div>

            <div class="like">+关注</div>
        </div>



        <!-- 歌手歌曲,专辑,mv -->
        <div class="singer-info">

            <van-tabs v-model="active"  sticky>
                <van-tab v-for="(item,index) in indexList" :key="index" :title="item.title">
                    <div class="item-box">

                        <div class="item-des">{{item.des}}</div>

                            <!-- 歌曲 -->
                            <div v-if="item.title == '歌曲'">
                                <!-- 懒加载 -->
                                <van-list
                                    v-model="musicLoading"
                                    :finished="musicFinished"
                                    finished-text="没有更多了"
                                    @load="getSingerMusic"

                                >
                                    <div class="item-main" v-for="(item,index) in musicData" :key="index" @click="playMusic(item.id)">
                                        <div class="fl number">{{index+1}}</div>
                                        <div class="fl main">
                                            <div class="fl name-from">
                                                <div class="name">{{item.name}}</div>
                                                <div class="from">{{item.al.name}}</div>
                                            </div>
                                            <div class="fr option" @click.stop="getMusicOption(item.id)">
                                                <img class="auto-img option-icon" src="../assets/img/singer/sandian.png" alt="">
                                            </div>
                                        </div>
                                    </div>
                                </van-list>
                        
                            </div>
                        

                            <!-- 专辑 -->
                            <div v-else-if="item.title == '专辑'">

                                <!-- 懒加载 -->
                                <van-list
                                    v-model="albumLoading"
                                    :finished="albumFinished"
                                    finished-text="没有更多了"
                                    @load="getSingerAlbum"

                                >
                                    <div v-if="albumData.length == 0">
                                        <van-empty description="该歌手还没有专辑"/>
                                    </div>
                                    <div class="item-main" v-for="(item,index) in albumData"    :key="index"   v-else @click="goAlbum(item.id)">
                                        <div class="fl item-img-box">
                                            <img class="auto-img" :src="item.picUrl" alt="">
                                        </div>
                                        <div class="fl main2">
                                            <div class="name-time">
                                                <div class="name">{{item.name}}</div>
                                                <div class="time">{{item.publishTime|dCreateTime}} {{item.size}}首</div>
                                            </div>
                                        </div>
                                    </div>

                                </van-list>
                        
                            </div>

                            <!-- MV -->
                            <div v-else>

                                <!-- 懒加载 -->
                                <van-list
                                    v-model="mvLoading"
                                    :finished="mvFinished"
                                    :finished-text="mvData.length == 0 ? '' : '没有更多了'"
                                    @load="getSingerMv"

                                >
                                    <div v-if="mvData.length == 0">
                                        <van-empty description="该歌手还没有MV"/>
                                    </div>
                                    <div class="item-main3" v-for="(item,index) in mvData" :key="index" v-else @click="goMv(item)">
                                        <div class="fl main3-img-box">
                                            <img class="auto-img" :src="item.imgurl">
                                            <div class="mv-play-count">
                                                <div class="fl count-img">
                                                    <img class="play-img" src="../assets/img/singer/play.png" alt="">
                                                </div>
                                                <div class="fl count" v-if="item.isOver">{{item.playCount}}万</div>
                                                <div class="fl count" v-else>{{item.playCount}}</div>
                                            </div>
                                        </div>
                                        <div class="fl main3">
                                            <div class="main3-name">{{item.name}}</div>
                                            <div class="main3-time">{{item.publishTime}}</div>
                                        </div>
                                    </div>
                                </van-list>

                            </div>
                        
                    </div>    
                </van-tab>
            </van-tabs>
            
        </div>



        <!-- 歌曲弹出层 -->
        <van-popup v-model="show" round position="bottom">
            <div class="img-name-singer-box">
                <div class="fl img-box">
                    <img class="auto-img" :src="songData.picUrl" alt="">
                </div>
                <div class="fl name-singer-box">
                    <div class="name">{{songData.name}}</div>
                    <div class="singer-box">{{songData.singer}}</div>
                </div>
            </div>

            <div class="select-item">
                <div class="fl icon-box">
                    <img class="auto-img" src="../assets/img/singer/add_music.png">
                </div>
                <div class="fl title">添加到播放列表</div>
            </div>

            <div class="select-item">
                <div class="fl icon-box">
                    <img class="auto-img" src="../assets/img/singer/shoucang.png">
                </div>
                <div class="fl title">收藏到歌单</div>
            </div>

            <div class="select-item" @click="goSinger(songData.ar)">
                <div class="fl icon-box">
                    <img class="auto-img" src="../assets/img/singer/singer.png">
                </div>
                <div class="fl title">歌手:</div>
                <div class="fl content">{{songData.singer}}</div>
            </div>

            <div class="select-item" @click="goAlbum(songData.al.id)">
                <div class="fl icon-box">
                    <img class="auto-img" src="../assets/img/singer/album.png">
                </div>
                <div class="fl title">专辑:</div>
                <div class="fl content">{{songData.alName}}</div>
            </div>
        </van-popup>

        <!-- 歌手选择弹出层 -->
        <van-popup v-model="singerShow" round position="bottom">
            <div class="singer-choose-title">该歌曲有多个歌手</div>

            <div class="choose-item" v-for="(item,index) in singerChooseData" :key="index" @click="goSingers(item.id)">
                <div class="fl item-img">
                    <img class="auto-img" :src="item.cover" alt="">
                </div>
                <div class="fl item-name">{{item.name}}</div>
            </div>

        </van-popup>

    
  </div>
</template>


<script>
import '../assets/less/singer.less'

export default {
    name: "Singer",
    data(){
        return{
            //当前播放歌曲的封面
            audioimg: '',
            //
            // isaudiopaly: false,
            
            //懒加载
            musicLoading: true,
            musicFinished: false,
            albumLoading: true,
            albumFinished: false,
            mvLoading: true,
            mvFinished: false,
            //记录懒加载的数
            misicCount: 0,
            albumCount: 0,
            mvCount: 0,

            //是否展示歌手简介
            isShow: false,

            //渲染歌手详情页的固定数据
            indexList: [
                {
                    title:'歌曲',
                    des: '热门歌曲'
                }, 
                {
                    title:'专辑',
                    des: '全部专辑'
                }, 
                {
                    title:'MV',
                    des: '全部MV'
                } 

            ],

            //当前的模块
            active: '歌曲',

            //歌手id
            singerId: 0,

            //歌手信息
            singerData: {},

            //歌曲信息
            musicData: [],

            //专辑信息
            albumData: [],

            //mv信息
            mvData: [],

            //弹出层开关
            show: false,
            //歌手选择弹出层开关
            singerShow: false,
            //歌手选择的歌手信息
            singerChooseData: [],

            //单曲歌曲数据,该初始数据为防止渲染时报错所设，真正的数据会在点击时获取
            songData: {
                picUrl: '',
                name: '',
                singer: '',
                alName: ''
            }

        }
    },

    created(){
        
        //获取当前播放歌曲的封面
        if(this.$store.state.audioimg){
            this.audioimg = this.$store.state.audioimg;
        }

        // this.getAudioImg();

        //截取上个页面传来的数据singerId
        this.getSingerId();

        //获取歌手详情
        this.getSingerDetail();

        //获取歌手歌曲
        this.getSingerMusic();

        //获取歌手专辑
        this.getSingerAlbum();

        //获取歌手mv
        this.getSingerMv();
        
        
    },

    watch: {
        addioimg(){
            this.audioimg = this.$store.state.audioimg
        },
        
    },

    computed: {
        addioimg(){
            return this.$store.state.audioimg
        },
        isaudiopaly(){
            return this.$store.state.isaudioplay;
        },
    },

    methods: {

        //返回上一级
        goBack(){
            this.$router.go(-1);
        },

        //查看歌手简介
        singerDes(){
            this.isShow = true;
        },

        //获取歌手id
        getSingerId(){
            this.singerId = this.$route.query.singerId;
            console.log('获取到的歌手的id==>',this.singerId)
        },

        //获取歌手详情
        getSingerDetail(){
        
            // 发起获取请求
            this.axios({
                // 请求方法类型
                method: "get",
                // 地址
                url: "/artist/detail",
                params: {
                    id: this.singerId
                },
            }).then((result) => {

                console.log("歌手详情result==>",result);
                if(result.data.code == 200){
                    this.singerData = result.data.data.artist;
                    if(result.data.data.artist.rank){
                        let rank = result.data.data.artist.rank.rank;
                        let type = result.data.data.artist.rank.type;
                        this.singerData.ranking = rank;
                        this.singerData.type = type;
                    }
                    
                }else{
                    this.$Toast("加载歌手数据失败")
                }
            }).catch((err) => {
                console.log(err)
            });
        },

        //获取歌手歌曲
        getSingerMusic(){
        
            // 发起获取请求
            this.axios({
                // 请求方法类型
                method: "get",
                // 地址
                url: "/artist/songs",
                // post请求参数，boject
                params: {
                    id: this.singerId,
                    type: 'hot'
                },
            }).then((result) => {

                console.log("歌手歌曲result==>",result);
                if(result.data.code == 200){
                    setTimeout(()=>{
                        let data = result.data.songs;

                        for (let i = 0; i < 10; i++) {
                            if(i+this.misicCount+1 > data.length){
                                return;
                            }
                            this.musicData.push(data[i+this.misicCount]);

                            // 数据全部加载完成
                            if (this.musicData.length == data.length) {
                                this.musicFinished = true;
                            }
                        }
                        this.misicCount += 10;
                        // 加载状态结束
                        this.musicLoading = false;

                    },1500)
                    
                }else{
                    this.$Toast("加载歌手数据失败")
                }
            }).catch((err) => {

                console.log(err)
            });
        },

        //获取歌手专辑
        getSingerAlbum(){
        
            // 发起获取请求
            this.axios({
                // 请求方法类型
                method: "get",
                // 地址
                url: "/artist/album",
                // post请求参数，boject
                params: {
                    id: this.singerId,
                },
            }).then((result) => {

                console.log("歌手专辑result==>",result);
                
                if(result.data.code == 200){
                    if(result.data.hotAlbums.length == 0){
                        // 加载状态结束
                        this.albumLoading = false;
                        this.albumFinished = true;
                        return;
                    }

                    setTimeout(()=>{
                        let data = result.data.hotAlbums;

                        for (let i = 0; i < 10; i++) {
                            if(i+this.albumCount+1 > data.length){
                                return;
                            }
                            this.albumData.push(data[i+this.albumCount]);

                            // 数据全部加载完成
                            if (this.albumData.length == data.length) {
                                this.albumFinished = true;
                            }
                        }
                        this.albumCount += 10;
                        // 加载状态结束
                        this.albumLoading = false;

                    },1500)

                }else{
                    this.$Toast("加载歌手数据失败")
                }
            }).catch((err) => {

                console.log(err)
            });
        },

        //获取歌手MV
        getSingerMv(){
        
            // 发起获取请求
            this.axios({
                // 请求方法类型
                method: "get",
                // 地址
                url: "/artist/mv",
                // post请求参数，boject
                params: {
                    id: this.singerId,
                    limit: 50
                },
            }).then((result) => {

                console.log("歌手MVresult==>",result);
                if(result.data.code == 200){

                    if(result.data.mvs.length == 0){
                        // 加载状态结束
                        this.mvLoading = false;
                        this.mvFinished = true;
                        return;
                    }

                    setTimeout(()=>{
                        let data = result.data.mvs;
                        for(let i = 0;i<data.length;i++){
                            if(data[i].playCount > 10000){
                                data[i].playCount = parseInt(data[i].playCount/10000);
                                data[i].isOver = true;
                            }else{
                                data[i].isOver = false;
                            }

                        }

                        for (let i = 0; i < 8; i++) {
                            if(i+this.mvCount+1 > data.length){
                                return;
                            }
                            this.mvData.push(data[i+this.mvCount]);

                            // 数据全部加载完成
                            if (this.mvData.length == data.length) {
                                this.mvFinished = true;
                                return
                            }
                        }
                        // console.log('拿到的mv数据==>',this.mvData)
                        this.mvCount += 8;
                        // 加载状态结束
                        this.mvLoading = false;

                    },1500)

                }else{
                    this.$Toast("加载歌手数据失败")
                }
            }).catch((err) => {

                console.log(err)
            });
        },



        //获取歌曲详情
        getMusicDetail(id){
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
                url: "/song/detail",
                // post请求参数，boject
                params: {
                    ids: id
                },
            }).then((result) => {
                this.$toast.clear();
                console.log("歌曲详情==>",result);
                
                if(result.data.code == 200){
                    let data = result.data.songs[0];

                    //如果歌手不止一个
                    if(data.ar.length > 1){
                        let singer = []
                        for(let i=0;i<data.ar.length;i++){
                            singer.push(data.ar[i].name)
                        }
                        singer = singer.join('/')
                        data.singer = singer;
                    }else{
                        let singer = data.ar[0].name;
                        data.singer = singer;
                    }
                    //把歌曲专辑图片拿出来
                    let picUrl = data.al.picUrl;
                    //把歌曲专辑名字拿出来
                    let alName = data.al.name;

                    data.picUrl = picUrl
                    data.alName = alName


                    console.log('songs-data==>',data)
                    this.songData = data;

                }else{
                    this.$Toast("加载歌手数据失败")
                }
            }).catch((err) => {
                this.$toast.clear();
                console.log(err)
            });
        },

        //点击歌曲选项弹出弹出层
        getMusicOption(id){
            console.log('弹出层的歌曲id==>', id)
            //根据歌曲id获取歌曲信息
            this.getMusicDetail(id);
            setTimeout(()=>{
                this.show = true;
            },200)
        },


        //点击弹出层的歌手跳到歌手页面,如果是多个 弹出歌手选择
        goSinger(data){
            this.singerChooseData = []
            // console.log('点击了歌手的data==>',data)

            //如果只有一个歌手
            if(data.length == 1){

                //如果在当前歌手页打开的,关闭弹出层回到当前歌手页面
                if(data[0].id == this.singerId){
                    //重新加载当前页面
                    document.location.reload();
                }else{
                    //不是在该歌手的主页页面点击的,跳到歌手页面
                    let id = data[0].id;
                    this.$router.push({name: 'Singer', query:{singerId: id}})
                }

            }else{
                //如果为多个歌手
                //关闭歌曲选项，弹出歌手选项层
                this.show = false;
                setTimeout(()=>{
                    this.singerShow = true;
                },200)

                //获取歌手信息
                for(let i=0;i<data.length;i++){

                    // 发起获取请求
                    this.axios({
                        // 请求方法类型
                        method: "get",
                        // 地址
                        url: "/artist/detail",
                        params: {
                            id: data[i].id
                        },
                    }).then((result) => {
                    
                        console.log("在选择歌手获得的歌手详情result==>",result);
                        if(result.data.code == 200){
                            this.singerChooseData.push(result.data.data.artist);
                        }else{
                            this.$Toast("加载歌手数据失败")
                        }
                    }).catch((err) => {
                        console.log(err)
                    });

                }
                console.log('歌手选择的歌手信息==>',this.singerChooseData)
            }

        },

        //多个歌手时，点击选择歌手
        goSingers(id){

            console.log(id)
            //根据歌手id跳到歌手的页面
            //判断： 如果id为当前歌手id，重新加载该歌手页面
            if(id == this.singerId){
                //重新加载当前页面
                document.location.reload();
            }else{
                //如果id不是当前歌手的id，跳转到歌手详情页面
                this.$router.push({name: 'Singer', query:{singerId: id}});

                //重新加载当前页面
                document.location.reload();
            }


        },

        //点击歌曲专辑
        goAlbum(id){
            // console.log('专辑id==>',id)
            this.show = false;
            setTimeout(()=>{
                this.$router.push({name: 'Album' , query:{albumId: id}});
            },200)
        },


        //点击歌曲  播放歌曲
        playMusic(id){
            
            this.$store.commit('changesongid', id);
            this.$store.commit('audioplayshow',true);

        },

        //播放页面
        playPage(){
            this.$store.commit('audioplayshow',true);
        },

        //播放mv
        goMv(item){
            

            let data = {};

            data.artistimg = this.singerData.cover;
            data.artistname = item.artist.name;
            data.mvid = item.id;
            data.mvtitle = item.name;
            

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
                url: "/mv/url",
                params: {
                    id: item.id
                },
            }).then((result) => {
                this.$toast.clear();
                // console.log("点击的mv地址==>",result);
                if(result.data.code == 200){
                   
                   let url = result.data.data.url;
                   data.mvsrc = url;
                   console.log('要发送mv的数据==>',data)
                   this.$router.push({name: 'Mvdetail', query: {mvdata : data}})
                    
                }else{
                    this.$Toast("加载mv数据失败")
                }
            }).catch((err) => {
                this.$toast.clear();
                console.log(err)
            });


            
        }

    


    }


};

</script>

