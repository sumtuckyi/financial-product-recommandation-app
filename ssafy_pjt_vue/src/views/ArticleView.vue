<template>
  <div class="container">
    <h1>자유 게시판 </h1>
    <hr class ="hr1" noshade>
    <br>
    <div>
      <span v-if="onSearch"> ▷ 총 {{ articles.length }}개의 게시물이 있습니다.</span>
      <span v-else> ▷ 총 {{ articleStore.articles.length }}개의 게시물이 있습니다.</span>
      <span class="right"> 
        <input type="text" id="search" v-model="search" @keyup.enter="searchArticles">
        <button @click="searchArticles">검색하기</button>
      </span>
    </div>
    <br>
    <table v-if="onSearch">
      <tr>
          <th>번호</th>
          <th>제목</th>
          <th>글쓴이</th>
          <th>일시</th>
      </tr>
      <tr v-for="article in articles.slice((currentPage - 1) * perPage, currentPage * perPage)">
        <td class="center">{{ article.id }}</td>
        <td class="left">
          <RouterLink 
            :to="{ name: 'articledetail', params: { id: article.id } }"
          >{{ article.title }}</RouterLink>
        </td>
        <td class="center">{{ article.username }}</td>
        <td class="center">{{ article.created_at.slice(0, 10) }}</td>
      </tr>
    </table>
    <table v-else>
      <tr>
          <th>번호</th>
          <th>제목</th>
          <th>글쓴이</th>
          <th>일시</th>
      </tr>
      <tr v-for="article in articleStore.articles.slice((currentPage - 1) * perPage, currentPage * perPage)">
        <td class="center">{{ article.id }}</td>
        <td class="left">
          <RouterLink 
            :to="{ name: 'articledetail', params: { id: article.id } }"
          >{{ article.title }}</RouterLink>
        </td>
        <td class="center">{{ article.username }}</td>
        <td class="center">{{ article.created_at.slice(0, 10) }}</td>
      </tr>
    </table>
    <div>
      <ul class="pagination">
        <li v-for="page in pages" @click="changePage(page)"><button>{{ page }}</button></li>
      </ul>
    </div>
    <span class="right">
      <RouterLink :to="{ name: 'articlecreate' }">
        <button>글쓰기</button>
      </RouterLink>
    </span>
  </div>
</template>

<script setup>
import { useArticleStore } from '../stores/article';
import { useUserStore } from '../stores/user';
import { onMounted, ref, computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const articleStore = useArticleStore()
const articles = ref([])
const search = ref('')
const pages = computed(() => {
  if (onSearch.value) {
    return Array.from({length: Math.ceil(articles.value.length / perPage.value)}, (v, i) => i + 1)
  } else {
    return Array.from({length: Math.ceil(articleStore.articles.length / perPage.value)}, (v, i) => i + 1)
  }
})
const perPage = ref(10)
const currentPage = ref(1)
const onSearch = ref(false)

const changePage = (page) => {
  currentPage.value = page
}

onMounted(() => {
  articleStore.getArticles()
})

const searchArticles = () => {
  articles.value = articleStore.articles
  const searchResult = articles.value.filter((article) => 
    article.title.includes(search.value) || article.content.includes(search.value)
  )
  articles.value = searchResult
  onSearch.value = true
}
</script>

<style scoped>
input{
  position: relative;
  cursor: text;
  font-size: 14px;
  line-height: 20px;
  padding: 0 16px;
  height: 30px;
  width: 150px;
  background-color: #fff;
  border: 1px solid #d6d6e7;
  border-radius: 3px;
  color: rgb(35, 38, 59);
  box-shadow: inset 0 1px 4px 0 rgb(119 122 175 / 30%);
  overflow: hidden;
  transition: all 100ms ease-in-out;
  margin-right: 10px;
}
input:focus {
  border-color: #3c4fe0;
  box-shadow: 0 1px 0 0 rgb(35 38 59 / 5%);
}
.container {
  width: 1000px;
  height: 650px;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 100px;
}
.pagination {
  display: flex;
  list-style: none;
  justify-content: center;
}
h1 { font-weight: border; }
.hr1 { border: 0;
height: 2px;
background:  #d3d3d3;}
.grey { 
color: #727272;}
#strong { font-weight: 900;}

table {
width: 100%;
border-top: 1px solid #d3d3d3;
border-collapse: collapse;
margin-bottom: 3%;
}
th { background-color: #efefef; 
  border-top: 3px solid gray;
}
th, td {
border-bottom: 1px solid #d3d3d3;
padding: 10px;
}

.greylist {
width: 50px;
height: 30px;
font-weight: 900;
color: white;
text-align: center;
background: grey;
border: solid 2px white;
border-radius: 5px;
}
.gradient {
width: 80px;
height: 30px;
font-weight: 900;
color: white;
text-align: center;
background: linear-gradient( to bottom, grey, black );
border: solid 2px white;
border-radius: 5px;
}

.left {text-align: left;}
.right {  float: right;}
.center { text-align: center;}

a {color:black;
text-decoration-line : none;}

button {
  appearance: none;
  background-color: #FAFBFC;
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  box-sizing: border-box;
  color: #24292E;
  cursor: pointer;
  display: inline-block;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  list-style: none;
  padding: 6px 16px;
  position: relative;
  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  word-wrap: break-word;
}

button:hover {
  background-color: #F3F4F6;
  text-decoration: none;
  transition-duration: 0.1s;
}

button:disabled {
  background-color: #FAFBFC;
  border-color: rgba(27, 31, 35, 0.15);
  color: #959DA5;
  cursor: default;
}

button:active {
  background-color: #EDEFF2;
  box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
  transition: none 0s;
}

button:focus {
  outline: 1px transparent;
}

button:before {
  display: none;
}

button:-webkit-details-marker {
  display: none;
}
</style>
