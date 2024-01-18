<template>
  <form class="container" @submit.prevent="updateArticle">
    <h1>자유 게시판</h1>
    <div class="board_1">
      <input type="text" v-model.trim="title" id="title" placeholder="제목">
    </div>
    <div class="column">
      <textarea v-model.trim="content" id="content" placeholder="내용"></textarea>
    </div>
    <br>
    <button>수정</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useArticleStore } from '../stores/article';
import { useUserStore } from '../stores/user';
import axios from 'axios';

const articleStore = useArticleStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const articleId = route.params.id
const title = ref('')
const content = ref('')

onMounted(() => {
  axios({
    method: 'get',
    url: `${userStore.API_URL}/articles/${articleId}/`
  })
  .then((res) => {
    title.value = res.data.title
    content.value = res.data.content
  })
  .catch(err => console.log(err))
})

const updateArticle = function () {
  axios({
    method: 'put',
    url: `${userStore.API_URL}/articles/${articleId}/`,
    data: {
      title: title.value,
      content: content.value,
    },
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
    .then((res) => {
      articleStore.getArticles()
      router.push({ name: 'articledetail', params: { id: articleId } })
    })
    .catch((err) => {
      console.log(err)
    })
}

</script>

<style scoped>
button {
  float: right;
}
.container {
  width: 1000px;
  /* height: 650px; */
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 100px;
}
.board_1 { 
  background: #efefef;
  border-top: 3px solid gray; 
  padding: 10px;  
  margin-top: 75px;
}
.column{
  height: 200px;
  display: flex;
  flex-direction: column;
  padding: 20px; 
  border-bottom: 1px solid gray;  
}
input{
  position: relative;
  cursor: text;
  font-size: 25px;
  line-height: 20px;
  padding: 0 16px;
  height: 35px;
  width: 300px;
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
textarea{
  position: relative;
  cursor: text;
  font-size: 15px;
  line-height: 20px;
  padding: 16px;
  height: 500px;
  width: 80%;
  background-color: #fff;
  border: 1px solid #d6d6e7;
  border-radius: 3px;
  color: rgb(35, 38, 59);
  box-shadow: inset 0 1px 4px 0 rgb(119 122 175 / 30%);
  overflow: hidden;
  transition: all 100ms ease-in-out;
  margin-right: 10px;
}
textarea:focus {
  border-color: #3c4fe0;
  box-shadow: 0 1px 0 0 rgb(35 38 59 / 5%);
}
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