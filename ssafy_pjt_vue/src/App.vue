<template>
  <header>
    <div>
      <nav class="wrapper">
        <div id="logo-container">
          <RouterLink :to="{ name: 'main' }" class="home"><span style="color: #1B4DFF !important;">B</span><span>ank</span><span style="color: #1B4DFF !important;">MATE</span> </RouterLink>
          <RouterLink :to="{ name: 'main' }" id="no-pd"><img src="..\public\logo2.png" alt="logo" id="logo"></RouterLink>
        </div> 
        <ul>
          <li>
            <RouterLink :to="{ name: 'exchange' }">환전</RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'map' }">은행찾기</RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'product' }">상품조회</RouterLink>
          </li>
          
          <li @mouseover="openDropdown('article')" @mouseleave="closeDropdown('article')">
            <a>게시판</a>
            <ul v-show="isArticleDropdownOpen">
              <RouterLink :to="{ name: 'articles'}">자유</RouterLink>
              <RouterLink :to="{ name: 'reviews'}">리뷰</RouterLink>
            </ul>
          </li>
          <li 
            @mouseover="openDropdown" @mouseleave="closeDropdown"
            v-if="!userStore.isLogin"
          >
            <a href="">회원</a>
            <ul v-show="isUserDropdownOpen">
              <RouterLink 
                v-if="!userStore.isLogin" 
                :to="{ name: 'login' }">Login</RouterLink>
              <RouterLink   
                v-if="!userStore.isLogin" 
                :to="{ name: 'signup' }">SignUp</RouterLink>
            </ul>
          </li>
          <li>
            <a @click="userStore.logOut" v-if="userStore.isLogin">Logout</a>
          </li>
          <li>
            <RouterLink 
              v-if="userStore.isLogin"
              :to="{ name: 'profile' }">Profile
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- <span v-if="userStore.user.is_staff">관리자</span>
      <span v-if="userStore.isLogin">{{ userStore.user.username }}님 안녕하세요!</span>
       -->
    </div>
  </header>
  <RouterView />
  <Sidebar />
  <Footer />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import Footer from '@/components/Footer.vue'
import { useUserStore } from '@/stores/user';
import Sidebar from '@/components/Sidebar.vue';

const userStore = useUserStore()

const isArticleDropdownOpen = ref(false)
const isUserDropdownOpen = ref(false)
const openDropdown = (text) => {
    if (text === 'article') {
      isArticleDropdownOpen.value = true
    } else {
      isUserDropdownOpen.value = true
    }
}
const closeDropdown = (text) => {
  if (text === 'article') {
    isArticleDropdownOpen.value = false
  } else {
    isUserDropdownOpen.value = false
  }
}


</script>


<style scoped>
header {
	background-color: transparent;
  color: #00B6FF;
  height: 100px;
  padding: 1rem;
  /* display: flex; */
  /* flex-direction: column; */
  /* justify-content: center; */
}
body {
  height: 100vh;
}
.home {
  font-weight: 600;
  font-size: 1.5rem;
  padding: 0;
}
.wrapper {
  height: 100%;
  width: 1000px;
  display: flex;
  /* flex-direction: column; */
  justify-content: space-between;
  margin: 0 auto;
}
#no-pd {
  padding: 0;
}
nav {
  width: 1000px;
  color: #00B6FF;
  /* text-align: center; */
  font-size: 1rem;
  background-color: white;
  position: sticky;
  top: 0;
}
nav ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}
nav li {
  margin-right: 20px;
  position: relative;
  font-size: 1.5rem;
  line-height: 2;
}
span {
  font-size: 1.5rem;
  font-weight: 600;
  color: #00B6FF;
}
nav a {
  display: block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  text-decoration: none;
  color: #1B4DFF;
}
nav ul ul {
  position: absolute;
  top: 100%;
  left: 0;
  transform: translateY(-15%);
  opacity: 0; /* Initially set the opacity to 0 */
  visibility: hidden; /* Initially hide the dropdown */
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0s 0.3s, scale 0.3s ease;  /* Apply transition */
  transform-origin: top center; 
  z-index: 3000;;
}
nav ul li:hover > ul {
  display: inherit;
  opacity: 0.8; /* Make the dropdown visible on hover */
  visibility: visible; /* Make the dropdown visible on hover */
  transform: translateY(0) scale(1); /* Bring the dropdown back to its original position and scale it up */
  transition-delay: 0s;
}
nav a:first-of-type {
  border: 0;
}
nav a.router-link-exact-active {
  color: #00B6FF
}
#logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
#logo {
  display: inline-block;
  width: 3rem;
  height: 3rem;
}
#logo:hover {
  transform: rotate3d(0, 1, 0.1, 3.142rad);
  /* transform: scale(1.2); */
}
#app > header > div > nav > ul > li:nth-child(5) > ul > a.router-link-active.router-link-exact-active {
  margin: 0;
}
</style>
