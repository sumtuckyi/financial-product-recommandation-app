import { createRouter, createWebHistory } from 'vue-router'

import ArticleView from '@/views/ArticleView.vue'
import ArticleDetailView from '@/views/ArticleDetailView.vue'
import ArticleCreateView from '@/views/ArticleCreateView.vue'
import ArticleUpdateView from '@/views/ArticleUpdateView.vue'

import ReviewView from '@/views/ReviewView.vue'
import ReviewDetailView from '@/views/ReviewDetailView.vue'
import ReviewCreateView from '@/views/ReviewCreateView.vue'
import ReviewUpdateView from '@/views/ReviewUpdateView.vue'

import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ProfileUpdateView from '@/views/ProfileUpdateView.vue'
import PasswordChangeView from '@/views/PasswordChangeView.vue'

import PortfolioCreateView from '@/views/PortfolioCreateView.vue'
import PortfolioDetailView from '@/views/PortfolioDetailView.vue'
import PortfolioUpdateView from '@/views/PortfolioUpdateView.vue'

import MainPage from '@/MainPage.vue'
import MapView from '@/views/MapView.vue'
import ExchangeView from '@/views/ExchangeView.vue'
import ProductView from '@/views/ProductView.vue'
import DepositProductView from '@/views/DepositProductView.vue'
import SavingProductView from '@/views/SavingProductView.vue'
import DepositProductDetailView from '@/views/DepositProductDetailView.vue'
import SavingProductDetailView from '@/views/SavingProductDetailView.vue'
import BestProductSearchView from '@/views/BestProductSearchView.vue'
import BankSearchResultView from '@/views/BankSearchResultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticleView
    },
    {
      path: '/articles/:id',
      name: 'articledetail',
      component: ArticleDetailView
    },
    {
      path: '/articles/create',
      name: 'articlecreate',
      component: ArticleCreateView
    },
    {
      path: '/articles/:id/update',
      name: 'articleupdate',
      component: ArticleUpdateView
    },
    {
      path: '/reviews',
      name: 'reviews',
      component: ReviewView
    },
    {
      path: '/reviews/:id',
      name: 'reviewdetail',
      component: ReviewDetailView
    },
    {
      path: '/reviews/create',
      name: 'reviewcreate',
      component: ReviewCreateView
    },
    {
      path: '/reviews/:id/update',
      name: 'reviewupdate',
      component: ReviewUpdateView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/profileupdate',
      name: 'profileupdate',
      component: ProfileUpdateView
    },
    {
      path: '/passwordchange',
      name: 'passwordchange',
      component: PasswordChangeView
    },
    {
      path: '/portfoliocreate',
      name: 'portfoliocreate',
      component: PortfolioCreateView
    },
    {
      path: '/portfoliodetail',
      name: 'portfoliodetail',
      component: PortfolioDetailView
    },
    {
      path: '/portfolioupdate',
      name: 'portfolioupdate',
      component: PortfolioUpdateView
    },
    {
      path: '/map',
      name: 'map',
      component: MapView
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: ExchangeView
    },
    {
      path: '/product',
      name: 'product',
      component: ProductView
    },
    {
      path: '/deposit',
      name: 'deposit',
      component: DepositProductView
    },
    {
      path: '/saving',
      name: 'saving',
      component: SavingProductView
    },
    {
      path: '/deposit/:id',
      name: 'depositDetail',
      component: DepositProductDetailView
    },
    {
      path: '/saving/:id',
      name: 'savingDetail',
      component: SavingProductDetailView
    },
    {
      path: '/search/:type/:per',
      name: 'searchBestPdt',
      component: BestProductSearchView,
      props: true
    },
    {
      path: '/search_pdt/:name',
      name: 'bankSearch',
      component: BankSearchResultView,
      props: true,
    }
  ]
})

import { useUserStore } from '@/stores/user'

router.beforeEach((to, from) => {
  const store = useUserStore()
  if (to.name === 'articlecreate' && !store.isLogin) {
    window.alert('로그인이 필요합니다.')
    return { name: 'login' }
  }
  if (to.name === 'articleupdate' && !store.isLogin) {
    window.alert('로그인이 필요합니다.')
    return { name: 'login' }
  }
  if ((to.name === 'signup' || to.name === 'login') && (store.isLogin)) {
    window.alert('이미 로그인 했습니다.')
    return { name: 'main' }
  }
  if (to.name === 'reviewcreate' && !store.isLogin) {
    window.alert('로그인이 필요합니다.')
    return { name: 'login' }
  }
  if (to.name === 'reviewupdate' && !store.isLogin) {
    window.alert('로그인이 필요합니다.')
    return { name: 'login' }
  }
})

export default router
