import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/nav',
    name: 'Nav',
    component: () => import('../views/Nav.vue'),
    children:[
      {
        path:'/home',
        name:'Home',
        component:() => import('../views/Home.vue')
      },
      {
        path:'/musiclibrary',
        name:'Musiclibrary',
        component:() => import('../views/Musiclibrary.vue')
      },
      {
        path:'/mv',
        name:'Mv',
        component:() => import('../views/Mv.vue')
      },
      {
        path:'/my',
        name:'My',
        component:() => import('../views/My.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/mvdetail',
    name: 'Mvdetail',
    component: () => import('../views/Mvdetail.vue')
  },
  {
    path: '/audioplay',
    name: 'Audioplay',
    component: () => import('../views/Audioplay.vue')
  },
  {
    path: '/singer',
    name: 'Singer',
    component: () => import('../views/Singer.vue')
  },
  {
    path: '/singerlist',
    name: 'SingerList',
    component: () => import('../views/SingerList.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/album',
    name: 'Album',
    component: () => import('../views/Album.vue')
  },
  {
    path: '/likemv',
    name: 'Likemv',
    component: () => import('../views/Likemv.vue')
  },
  {
    path: '/playList',
    name: 'PlayList',
    component: () => import('../views/PlayList.vue')
  },
  {
    path:'*',
    redirect:{
      name:'Home'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
