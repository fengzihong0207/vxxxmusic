import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'

import {
  Button,
  NavBar,
  AddressEdit,
  Tab,
  Tabs,
  ImagePreview,
  AddressList,
  Uploader,
  Dialog,
  Form,
  SwipeCell,
  cell,
  SubmitBar,
  Field,
  Icon,
  Popup,
  Checkbox,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  CellGroup,
  Tag,
  Empty,
  Divider,
  Sidebar,
  SidebarItem,
  List,
  Slider 
} from 'vant'


Vue.use(Button)
  .use(NavBar)
  .use(VueAxios, axios)
  .use(Form)
  .use(Field)
  .use(Icon)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Empty)
  .use(Tag)
  .use(Checkbox)
  .use(SubmitBar)
  .use(SwipeCell)
  .use(cell)
  .use(CellGroup)
  .use(AddressEdit)
  .use(AddressList)
  .use(Uploader)
  .use(ImagePreview)
  .use(Divider)
  .use(Dialog)
  .use(Tab)
  .use(Tabs)
  .use(Sidebar)
  .use(SidebarItem)
  .use(List)
  .use(VideoPlayer)
  .use(Slider )

Vue.config.productionTip = false
// 配置请求基础路径
axios.defaults.baseURL = 'http://localhost:3000'

//axios拦截器，在发起请求之前执行
axios.interceptors.request.use(config => {

  // 处理post请求参数，进行参数序列化
  if (config.method == 'post') {

    // 序列化post请求参数
    let paramsString = '';
    for (let key in config.data) {
      // 数据拼接
      paramsString += `${key}=${config.data[key]}&`
    }

    // 重新赋值给config.data
    config.data = paramsString.slice(0, -1)
  }
  // 返回config
  return config;
})

// 
Vue.filter('decimal', (v, n = 1) => {
  v = v / 10000
  return v.toFixed(n);
})
// 时间格式发
Vue.filter('dCreateTime', (value) => {

    var date = new Date(parseInt(value));
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var df = Y + M + D 
    return df;
  }),

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')