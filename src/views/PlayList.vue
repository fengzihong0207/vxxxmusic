<template>
    <div class="play-list">
        
        <!-- 头部导航栏 -->
        <van-nav-bar title="歌单" left-text="返回" left-arrow @click-left="goBack">
            <template #right>
              <div class="player" @click="playPage" :class="isaudiopaly ? 'running' : 'paused' ">
                  <img class="auto-img" :src="audioimg">
              </div>
            </template>
        </van-nav-bar>

        <!-- 歌单概览 -->
        <div class="album-content">
            <div class="fl album-img">
                <img class="auto-img" :src="playListData.img">
            </div>
            <div class="fl album-content-box">
                <div class="album-name">{{playListData.name}}</div>
                <div class="album-singer">创建作者: {{playListData.creatorName}} ></div>
                <div class="album-time">创建时间: {{playListData.createTime|dCreateTime}}</div>
                <div class="album-des" @click="desShow">{{playListData.description}}</div>
                <van-popup v-model="isShow">
                    <div class="des-detail-box">{{playListData.description}}</div>
                </van-popup>
            </div>
            <!-- 背景模糊层 -->
            <div class="album-content-background" :style="{backgroundImage: 'url('+playListData.img+')'}"></div>
        </div>


        <!-- 歌曲列表 -->
        <div class="music-list">
            <!-- 列表标题 -->
            <div class="list-title">歌曲列表</div>

            <!-- 音乐列表 -->
            <div class="list">
                <!-- 单首歌曲 -->
                <div class="item" v-for="(item,index) in musicListData" :key=index @click="playMusic(item.id)">
                    <div class="fl number">{{index+1}}</div>
                    <div class="fl main">
                        <div class="fl name-from">
                            <div class="name">{{item.name}}</div>
                            <div class="from">{{item.ar[0].name}} - {{item.al.name}}</div>
                        </div>
                        <div class="fr option" @click.stop="getMusicOption(item.id)">
                            <img class="auto-img option-icon" src="../assets/img/album/sandian.png">
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- 歌曲弹出层 -->
        <van-popup v-model="show" round position="bottom">
            <div class="img-name-singer-box">
                <div class="fl img-box">
                    <img class="auto-img" :src="songData.picUrl">
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

            <div class="choose-item" v-for="(item,index) in singerChooseData" :key="index" @click="goSingerDetail(item.id)">
                <div class="fl item-img">
                    <img class="auto-img" :src="item.cover">
                </div>
                <div class="fl item-name">{{item.name}}</div>
            </div>

        </van-popup>


    </div>
</template>

<script>
    import '../assets/less/playlist.less'
    export default {
        name: 'PlayList',

        data() {
            return {
                //歌单简介详情
                isShow: false,
                //歌曲选项详情
                show: false,
                //多个歌手的歌曲的歌手选择
                singerShow: false,
                //正在播放的歌曲的封面
                audioimg: '',

                //歌单id
                playListId: '',

                //歌单详情数据
                playListData: {},

                //歌单的音乐数据
                musicListData: [],

                //单曲歌曲数据,该初始数据为防止渲染时报错所设，真正的数据会在点击时获取
                songData: {
                    picUrl: '',
                    name: '',
                    singer: '',
                    alName: ''
                },

                //多个歌手的时候  选择的歌手信息
                singerChooseData: [],

            }
        },


        created(){
            //截取发送过来的歌单id
            this.playListId = this.$route.query.playListId;
            console.log('截取发送过来的歌单id==>',this.playListId)

            //获取歌单详情
            this.getPlayList(this.playListId);

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

            //点击播放歌曲
            playMusic(id){
                this.$store.commit('changesongid', id);
                this.$store.commit('audioplayshow', true);
            },

            //播放页面
            playPage(){
                this.$store.commit('audioplayshow',true);
            },

            //查看歌单结算详情
            desShow(){
                this.isShow = true;
            },

            //返回上一页
            goBack(){
                // console.log('返回')
                this.$router.go(-1);
            },

            //获取歌单详情
            getPlayList(id){
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
                    url: "/playlist/detail",
                    // post请求参数，boject
                    params: {
                        id
                    },
                }).then((result) => {
                    this.$toast.clear();
                    console.log("歌单详情==>",result);
                    
                    if(result.data.code == 200){
                        let data = {};
                        data.name = result.data.playlist.name;
                        data.description = result.data.playlist.description;
                        data.playCount = result.data.playlist.playCount;
                        data.createTime = result.data.playlist.createTime;
                        data.creatorName = result.data.playlist.creator.nickname;
                        data.tracks = result.data.playlist.tracks;
                        data.img = result.data.playlist.coverImgUrl;

                        console.log('提取到的歌单的数据==>', data)
                        this.playListData = data;
                        this.musicListData = data.tracks;

                    }else{
                        this.$Toast("加载歌手数据失败")
                    }
                }).catch((err) => {
                    this.$toast.clear();
                    console.log(err)
                });
            },

            //点击弹出歌曲选项
            getMusicOption(id){
                //根据歌曲id获取歌曲信息
                this.getMusicDetail(id);
                setTimeout(()=>{
                    this.show = true;
                },200)
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


            //跳到歌手详情页面
            goSingerDetail(id){
                // console.log(id)
                this.$router.push({ name: 'Singer', query:{singerId: id} });
            },


            //点击弹出层的歌手跳到歌手页面,如果是多个 弹出歌手选择
            goSinger(data){
                //数据初始化
                this.singerChooseData = []
                console.log('点击了歌手的data==>',data)

                //如果只有一个歌手
                if(data.length == 1){

                    this.goSingerDetail(data[0].id)

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
                }

            },

            //点击专辑
            goAlbum(id){
                this.$router.push({name: 'Album' , query:{albumId: id} } )
            }


        }


    }
</script>

