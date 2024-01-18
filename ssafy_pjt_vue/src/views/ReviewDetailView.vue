<template>
  <div class="container" v-if="!(review === null)">
    <h1>리뷰 게시판</h1>
    <div class="board_1">
      <h2>{{ review.title }}</h2>
      <span>{{ review.username }} │ {{ review.created_at.slice(0, 10) }} {{ review.created_at.slice(11, 16) }} </span> 
    </div>
    <div class="column">
      <span>{{ review.content }}</span>
    </div>
    <form>
      <div v-for="comment in review.reviewcomment_set">
        <div style="padding: 5px 0; display: flex; justify-content: space-between; align-items: center;" v-if="comment.id !== commentEdit">
          <div>
            <p style="font-weight: bold;">{{ comment.username }}</p>
            <p>{{ comment.content }}</p>
          </div>
          <div>
            <button class="commentbutton"
              v-if="userStore.user.pk === comment.user"
              @click="clickEdit(comment)">수정</button>
            <button class="commentbutton"
              v-if="userStore.user.pk === comment.user"
              @click="deleteComment(comment.id)">삭제</button>
          </div>
        </div>
        <form style="display: flex; justify-content: space-between;" v-else @submit.prevent="updateComment(comment.id)">
          <textarea  v-model.trim="nowEditing" id="edit" cols="50"></textarea>
          <button class="commentbutton">수정</button>
        </form>
        <hr>
      </div>
      <form v-if="userStore.isLogin" @submit.prevent="createComment" class="comment">
        <textarea v-model.trim="commentContent" class="commentcreate" name="덧글" cols="100" rows="4"></textarea>
        <button style="margin-left: 10px;">댓글 작성</button>   
      </form>
      <div v-if="userStore.user.pk === review.user">
        <RouterLink :to="{ name: 'reviewupdate', params: { id: reviewId }}">
          <button>수정하기</button>
        </RouterLink>
        <button @click="deleteReview">삭제하기</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReviewStore } from '../stores/review';
import { useUserStore } from '../stores/user';
import axios from 'axios';

const reviewStore = useReviewStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const reviewId = route.params.id
const review = ref(null)
const commentContent = ref('')
const commentEdit = ref(-1)
const nowEditing = ref('')

onMounted(() => {
  axios({
    method: 'get',
    url: `${userStore.API_URL}/reviews/${reviewId}/`
  })
    .then((res) => {
      review.value = res.data
    })
    .catch(err => console.log(err))
})

const deleteReview = function () {
  axios({
    method: 'delete',
    url: `${userStore.API_URL}/reviews/${reviewId}/`,
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
    .then((res) => {
      router.push({ name: 'reviews' })
    })
    .catch(err => console.log(err))
}

const createComment = function () {
  axios({
    method: 'post',
    url: `${userStore.API_URL}/reviews/${reviewId}/comments/`,
    data: {
      content: commentContent.value,
    },
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
    .then((res) => {
      router.go(0)
    })
    .catch((err) => {
      console.log(err)
    })
}

const deleteComment = function (id) {
  axios({
    method: 'delete',
    url: `${userStore.API_URL}/reviews/${reviewId}/comments/${id}/`,
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
    .then((res) => {
      router.go(0)
    })
    .catch((err) => {
      console.log(err)
    })
}

const clickEdit = function (previous) {
  commentEdit.value = previous.id
  nowEditing.value = previous.content
}

const updateComment = function (id) {
  console.log(nowEditing.value)
  axios({
    method: 'put',
    url: `${userStore.API_URL}/reviews/${reviewId}/comments/${id}/`,
    data: {
      content: nowEditing.value
    },
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
    .then((res) => {
      commentEdit.value = -1
      nowEditing.value = ''
      router.go(0)
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<style scoped>
.board_1 { 
  background: #efefef;
  border-top: 3px solid gray; 
  padding: 10px;  
  margin-top: 75px;
  display: flex;
  justify-content: space-between;
}
.column{
  height: 200px;
  display: flex;
  flex-direction: column;
  padding: 20px; 
  border-bottom: 1px solid gray;  
}
.comment {
  display: flex;
  justify-content: flex-end;
  background: #efefef;
  padding: 20px; 
}
.comment+div {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px; 
}
.black_button{
  box-shadow:0px 2px 2px 1px #aaa;
  border: 0px;
  border-radius: 3px;
  background: linear-gradient(to bottom,  #4c4c4c 0%,#595959 12%,#666666 25%,#474747 39%,#2c2c2c 50%,#000000 51%,#111111 60%,#2b2b2b 76%,#1c1c1c 91%,#131313 100%);
  color: white;
  font: 12px ;
  font-weight: bold;
  width: 80px;
}
.grey_button{
  box-shadow:0px 2px 2px 1px #aaa;
  border:0px;
  border-radius: 3px;
  background-color: gray;
  color: white;
  font: 12px ;
  font-weight: bold;
  width: 65px;
  height: 30px;
}
[type] {
  margin-left: 10px;
}
button {
  margin-left: 10px;
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
.commentbutton {
  font-size: 12px;
  padding: 5px;
  height: 34px;
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
textarea{
  position: relative;
  cursor: text;
  font-size: 14px;
  line-height: 20px;
  padding: 0 16px;
  height: 50px;
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
textarea:focus {
  border-color: #3c4fe0;
  box-shadow: 0 1px 0 0 rgb(35 38 59 / 5%);
}
.commentcreate {
  width: 2000px;
}
.container {
  width: 1000px;
  /* height: 650px; */
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 100px;
}
</style>