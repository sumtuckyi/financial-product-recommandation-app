<template>
    <div class="container">
      <Carousel :autoplay="3000" :itemsToShow="2" :wrapAround="true" :transition="500">
        <Slide v-for="slide in 4" :key="slide">
          <div class="carousel__item">
            <img :src="getImageUrl(slide)" alt="">
          </div>
        </Slide>
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>

        <div class="promo">
          <h1>가입자 수 {{ tweened.number.toFixed(0) }}명</h1>
        </div>

        <div class="wrapper">
            <img src="../public/card.gif" alt="main">
						<div class="sign-up">
							<p v-if="!userStore.isLogin">Make Your Account!</p>
							<p v-else>Welcome back, {{ userStore.user.username }}!</p>

              <RouterLink v-if="!userStore.isLogin" :to="{ name: 'login' }">
              <button>로그인</button></RouterLink>
              <RouterLink v-if="!userStore.isLogin" :to="{ name: 'signup' }">
              <button>가입하기</button></RouterLink>
              <RouterLink v-else :to="{ name: 'profile' }">
              <button>마이 페이지</button></RouterLink>
							<!-- <button v-if="!userStore.isLogin">
								<RouterLink :to="{ name: 'login' }">
								로그인</RouterLink>
							</button> -->
							<!-- <button v-if="!userStore.isLogin">
								<RouterLink :to="{ name: 'signup' }">
								가입하기</RouterLink>
							</button>
							<button v-else>
								<RouterLink :to="{ name: 'profile' }">
								마이 페이지
								</RouterLink>
							</button> -->
						</div>
        </div>
        <div id="news">
            <h3>실시간 금융 NEWS</h3>
						<!-- <p>{{ news.items }}</p> -->
            <ul class="news">
                <li v-for="(item, index) in news" :key="index" class="news-item">
                    <a :href="item.link"><p>{{ item.title }}</p></a>
                    <p>{{ item.pubDate.slice(0, 17) }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, watch, onBeforeUnmount, onMounted, reactive } from 'vue'
import config from '../config/config'
import { useCounterStore } from './stores/counter';
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user';
import { Carousel, Pagination, Slide } from 'vue3-carousel'
import gsap from 'gsap'
import 'swiper/swiper-bundle.css';
import 'vue3-carousel/dist/carousel.css'

const userStore = useUserStore()
const store = useCounterStore()

//
const number = ref(0)
const tweened = reactive({
  number: 0
})
watch(number, (n) => {
  gsap.to(tweened, {duration: 0.75, number: Number(n) || 0})
})
// 이미지 주소 동적 할당
const getImageUrl = (slide) => {
  return `../public/carousel-${slide}.png`;
};



// 금융뉴스 가져오기 - 장고로 요청 보내기 

// const URL = `${store.API_URL}/api3/get_news/`
const news = ref([])
const get_finance_news = function () {
    axios({
        url: `${store.API_URL}/api3/get_news/`,
        method: 'get'
    })
        .then((res) => {
            console.log(res)
            news.value = res.data.items
            console.log(news.value)
            // 불필요한 문자 제거하기 
            for(const item of news.value) {
                console.log(item.title)
                item.title = item.title.replace(/&quot;/g, '"')
								.replace(/&amp;/g, '&')
                .replace(/<b>/g, '')
                .replace(/<\/b>/g, '');
            }
            // news.value.items.title

        })
        .catch((err) => {
            console.log(err)
        })
}

onMounted(() => {
    get_finance_news()
    store.get_dep()
    store.get_sav()
    store.save_deposits()
    store.save_savings()
    number.value = 30510
})
</script>

<style scoped>
body {
  height: 100vh;
	background-color: #F8F9FD;
}
.container {
  margin: auto 0;
	height: 1800px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0;
}
img {
	justify-self: end;
	width: 450px;
	height: 300px;
	border-radius: 5px;
}
.wrapper {
	display: flex;
	width: 900px;
	justify-content: space-between;
	margin-bottom: 2rem;
	margin-top: 25px;
}
.sign-up {
	font-size: 4rem;
	padding: 1rem;
	text-align: center;
}
.promo {
  height: 350px;
  text-align: center;
  font-size: 35px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.news {
	padding: 2rem;
}
.news-item {
	display: flex;
	justify-content: space-between;
}
.news-item:hover {
  transform: rotateY(360deg);
}
.news-item:hover::after {
  transform: rotateY(180deg);
}
.carousel {
  width: 100%;
  overflow: hidden;
  margin-top: 50px;
}
#news {
    width: 900px;
    height: 400px;
    margin: 10px auto;
		margin-top: 25px;
    
}
#news p {
    display: inline;
    margin: 0.5rem;
    line-height: 1.5;
}
#news h3 {
	border-bottom: #3B3B3B solid 1px;
	font-size: 25px;
}
#news a {
    text-decoration: none;
    color: black;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
li {
    list-style: none;
}
button {
  appearance: none;
  background-color: transparent;
  border: 2px solid #1A1A1A;
  border-radius: 25px;
  box-sizing: border-box;
  color: #3B3B3B;
  cursor: pointer;
  display: inline-block;
  /* font-family: Roobert,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"; */
  font-size: 15px;
  font-weight: 600;
  line-height: normal;
  margin: 5px;
  min-height: 30px;
  min-width: 0;
  outline: none;
  padding: 12px 5px;
  text-align: center;
  text-decoration: none;
  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 100px;
  will-change: transform;
}

button:disabled {
  pointer-events: none;
}

button:hover {
  color: #000;
  /* background-color: #1A1A1A; */
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  transform: translateY(-2px);
}

button:active {
  box-shadow: none;
  transform: translateY(0);
}
a {
	text-decoration: none;
	color: #1A1A1A;
}
.carousel__item {
  min-height: 400px;
  width: 200px;
  /* background-color: var(--vc-clr-primary); */
  color: var(--vc-clr-white);
  font-size: 20px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.carousel__slide {
  padding: 5px;
}
.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 2px solid white;
}
.carousel__slide {
  padding: 0;
}
.carousel__viewport {
  perspective: 300px;
}
.carousel__track {
  transform-style: preserve-3d;
}
.carousel__slide--sliding {
  transition: 0.5s;
}
.carousel__slide {
  opacity: 0.9;
  transform: rotateY(-20deg) scale(0.9);
}
.carousel__slide--active ~ .carousel__slide {
  transform: rotateY(20deg) scale(0.9);
}
.carousel__slide--prev {
  opacity: 0.5;
  transform: rotateY(-10deg) scale(0.95);
}
.carousel__slide--next {
  opacity: 0.5;
  transform: rotateY(10deg) scale(0.95);
}
.carousel__slide--active {
  opacity: 1;
  transform: rotateY(0) scale(1.3);
}
.carousel__slide--next {
  opacity: 0.5;
  transform: rotateY(10deg) scale(0.95);
}
.carousel__slide--active {
  opacity: 1;
  transform: rotateY(0) scale(1.3);
}
</style>