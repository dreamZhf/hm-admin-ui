import Login from '@/page/user/Login'
import Index from '@/page/index/Index'
import Detail from '@/page/project/detail/index'
import BannerList from '@/page/banner/list/index'
import BannerDetail from '@/page/banner/detail/index'

const routes = [
  {
    path: '/',
    component: Login,
    meta: {
      login: true
    }
  },
  {
    path: '/index',
    component: Index,
    meta: {
      key: 'index'
    }
  },
  {
    path: '/detail',
    component: Detail
  },
  {
    path: '/banner/list',
    component: BannerList,
    meta: {
      key: 'bannerList'
    }
  },
  {
    path: '/banner/detail',
    component: BannerDetail
  }
]

export default routes;