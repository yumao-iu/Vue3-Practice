import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
const IndexView = () => import('../views/IndexView.vue')
const BookView = () => import('../views/BookView.vue')
const UserView = () => import('../views/UserView.vue')
const AdminView = () => import('../views/AdminView.vue')
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'index',
      path: '/',
      props: true,
      meta: {
        title: '阳光彩虹小白马-首页',
      },
      component: IndexView,
    },
    {
      name: 'book',
      path: '/book/:bid',
      props: true,
      meta: {
        title: '阳光彩虹小白马-书籍',
      },
      component: BookView,
    },
    {
      name: 'user',
      path: '/user/:uid',
      props: true,
      meta: {
        title: '阳光彩虹小白马-用户',
      },
      component: UserView,
    },
    {
      name: 'admin',
      path: '/admin',
      props: true,
      meta: {
        isAuth: true,
        title: '阳光彩虹小白马-管理',
      },
      component: AdminView,
    },
    {
      path: '/404',
      name: '404',
      props: true,
      meta: {
        title: '阳光彩虹小白马-404',
      },
      component: () => import('../views/404.vue')
    },
  ],
})
router.beforeEach((to, from, next) => {
  !to.matched.length ? next({ name: '404', query: { message: "404,输入的网站有错误! 🤡" } }) : name = '阳光彩虹小白马'
  if (to.name == 'admin') {
    if (!localStorage.getItem("adminInfo"))
      next({ name: '404', query: { message: "500,请先登录🤡" } })
  } else if (to.name == 'user') {
    if (!localStorage.getItem("userInfo"))
      next({ name: '404', query: { message: "500,请先登录🤡" } })
  }
  window.scrollTo({ top: 0, behavior: "smooth" })
  document.title = to.meta.title
  next()
})
export default router