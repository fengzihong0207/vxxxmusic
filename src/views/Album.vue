<template>
    <div class="album">
        
        <!-- 头部导航栏 -->
        <van-nav-bar title="专辑" left-text="返回" left-arrow @click-left="goBack">
            <template #right>
              <div class="player" @click="playPage" :class="isaudiopaly ? 'running' : 'paused' ">
                  <img class="auto-img" :src="audioimg">
              </div>
            </template>
        </van-nav-bar>


        <!-- 歌单概览 -->
        <div class="album-content" v-if="albumData">
            <div class="fl album-img">
                <img class="auto-img" :src="albumData.picUrl">
            </div>
            <div class="fl album-content-box">
                <div class="album-name">{{albumData.name}}</div>
                <div class="album-singer" @click="goSingerDetail(albumData.artist.id)">歌手: {{albumData.artist.name}} ></div>
                <div class="album-time">发行时间: {{albumData.publishTime|dCreateTime}}</div>
                <div class="album-des" @click="albumDes">{{albumData.description}}</div>
                <van-popup v-model="isShow">
                    <div class="des-detail-box">{{albumData.description}}</div>
                </van-popup>
            </div>
            <!-- 背景模糊层 -->
            <div class="album-content-background" :style="{backgroundImage: 'url('+albumData.picUrl+')'}"></div>
        </div>


        <!-- 歌曲列表 -->
        <div class="music-list">
            <!-- 列表标题 -->
            <div class="list-title">歌曲列表</div>

            <!-- 音乐列表 -->
            <div class="list">
                <!-- 单首歌曲 -->
                <div class="item" v-for="(item,index) in musicData" :key="index" @click="playMusic(item.id)">
                    <div class="fl number">{{index+1}}</div>
                    <div class="fl main">
                        <div class="fl name-from">
                            <div class="name">{{item.name}}</div>
                            <div class="from">{{item.al.name}}</div>
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

            <div class="select-item" @click="goAlbum()">
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
                    <img class="auto-img" :src="item.cover" alt="">
                </div>
                <div class="fl item-name">{{item.name}}</div>
            </div>

        </van-popup>


    </div>
</template>

<script>
    import '../assets/less/album.less'
    export default {
        name: 'Album',

        data() {
            return {

                //当前播放歌曲的封面
                audioimg: '',

                //专辑描述
                isShow: false,

                //歌曲选项
                show: false,

                // 专辑/歌单id
                albumId: 0,

                //专辑/歌单的数据
                albumData: {
                    artist: {name: ''}
                },

                //歌手选择弹出层开关
                singerShow: false,
                //歌手选择的歌手信息
                singerChooseData: [],

                //歌曲数据
                musicData: [],

                //单曲歌曲数据,该初始数据为防止渲染时报错所设，真正的数据会在点击时获取
                songData: {
                    picUrl: '',
                    name: '',
                    singer: '',
                    alName: ''
                },

            }
        },


        created(){

            //获取上个页面传来的专辑/歌单id
            this.getAlbumId();

            //获取专辑详情
            this.getAlbumDetail()

            //获取当前播放歌曲的封面
            if(this.$store.state.audioimg){
                this.audioimg = this.$store.state.audioimg;
            }

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

            //返回上一页
            goBack(){
                // console.log('返回')
                this.$router.go(-1);
            },



            //获取上个页面传来的专辑/歌单id
            getAlbumId(){
                this.albumId = this.$route.query.albumId;
                console.log('获取到的专辑/歌单的id==>',this.albumId);
            },

            //获取专辑详情
            getAlbumDetail(){

                // 发起获取请求
                this.axios({
                    // 请求方法类型
                    method: "get",
                    // 地址
                    url: "/album",
                    params: {
                        id: this.albumId
                    },
                }).then((result) => {

                    console.log("专辑详情result==>",result);
                    if(result.data.code == 200){
                        let data = result.data;
                        //如果专辑有多个歌手
                        // if()
                        this.albumData = data.album;
                        //专辑内的歌曲内容
                        this.musicData = data.songs;

                    }else{
                        this.$Toast("加载歌手数据失败")
                    }
                }).catch((err) => {
                    console.log(err)
                });

            },

            //跳到歌手详情页面
            goSingerDetail(id){
                // console.log(id)
                this.$router.push({ name: 'Singer', query:{singerId: id} });
            },

            //查看专辑介绍
            albumDes(){
                this.isShow = true;
            },

            //查看歌曲选项
            getMusicOption(id){
                console.log('弹出层的歌曲id==>', id)
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
                    console.log('歌手选择的歌手信息==>',this.singerChooseData)
                }

            },

            //点击专辑
            goAlbum(){
                //重新加载当前页面
                document.location.reload();
            },

            //点击播放歌曲
            playMusic(id){
                this.$store.commit('changesongid', id);
                this.$store.commit('audioplayshow', true);
            },

            //播放页面
            playPage(){
                this.$store.commit('audioplayshow',true);
            },

        }
    }
</script>

<style lang="less" scoped>

</style>