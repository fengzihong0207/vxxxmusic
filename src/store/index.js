import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    audioele:"",
    // mv点赞列表
    mvlike:[],
    // mv收藏列表
    mvFavorites:[],
    // mv分享列表
    mvshare:[],
    //音频元素
    audioElement: null,
    // 视频当前播放时间
    videocurrentTime:0,
    // 点开音乐播放器
    isaudioplayshow:false,
    // 正在播放音乐封面
    audioimg:"",
    // 音乐播放列表
    audioList:[],
    // 歌曲id
    songid:'347230',
    // 当前播放音乐的下标
    currentIndex:0,
    // 搜索框的值
    searchmessage:"",
    // 是否正在播放音乐
    isaudioplay:false,
    // 用户id
    useid:""
  },
  mutations: {
    // 获取audio节点
    getaudioele(state, audioele){
      state.audioele = audioele
    },
    // 修改mv点赞列表
    changemvlike(state, mvlikelist){
      state.mvlike = mvlikelist
    },
    // 修改mv收藏列表
    changemvFavorites(state, mvFavoriteslist){
      state.mvFavorites = mvFavoriteslist
    },
    // 修改mv分享状态
    changemvshare(state, mvshare){
      state.mvshare = mvshare
    },
    //获取音频元素
    getaudioele(state, audio) {
      state.audioElement = audio;
    },
    // 修改当前视频播放时间
    changvideocurrentTime(state,videotime){
      state.videocurrentTime = videotime
    },
    // 修改播放器是否显示
    audioplayshow(state,playshow){
      state.isaudioplayshow = playshow
    },
    // 修改当前歌曲id
    changesongid(state,musicid){
      state.songid = musicid
    },
    // 添加歌曲url到audioList中
    addurlaudioList(state,audioList){
      state.audioList = audioList
    },
    // 修改当前播放音乐的下标
    changecurrentIndex(state,currentIndex){
      state.currentIndex = currentIndex
    },
    // 修改搜索框的值
    changesearch(state,searchmsg){
      state.searchmessage = searchmsg
    },
    // 修改搜索框的值
    changeaudioimg(state,audioimg){
      state.audioimg = audioimg
    },
    // 修改音频是否正在播放
    changeaudioplay(state,isaudioplay){
      state.isaudioplay = isaudioplay
    },
  },
  actions: {
  },
  modules: {
  }
})
