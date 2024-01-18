<template>
  <div class="container">
    <div class="sidebar">
      <h2>바로가기</h2>
      <br>
      <ul>
        <li>
          <a class="sidelist" @click="openLikeProducts()">관심상품</a>
          <ul v-if="isLikeProductsOpen">
            <li v-for="deposit in like_deposits"><RouterLink :to="{ name: 'depositDetail', params: {id: deposit[0]} }">* {{ deposit[1] }}</RouterLink></li>
            <li v-for="saving in like_savings"><RouterLink :to="{ name: 'savingDetail', params: {id: saving[0]} }">* {{ saving[1] }}</RouterLink></li>
          </ul>
        </li>
        <li>
          <a class="sidelist" @click="showModal = !showModal">이자 계산기</a>
        </li>
      </ul>
    </div>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h1>이자 계산기</h1>
        <br>
        <h3>예금</h3>
        <div>
          <input v-model="depositMoney" type="number" placeholder="예치금액" name="deposit" id="deposit">
          <label for="deposit">원을</label>
          <input v-model="depositMonth" type="number" placeholder="기간" id="dmonths">
          <label for="dmonths">개월 간</label>
        </div>
        <div>
          <input v-model="depositRate" type="number" placeholder="금리" id="drate">
          <label for="drate" >%의 예금상품에 저축하면?</label>
        </div>
        <div class="result">
          이자: {{ (depositMoney * depositRate * depositMonth / 1200).toFixed(1) }} / 만기금액: {{ (depositMoney * (depositRate * depositMonth / 1200 + 1)).toFixed(1) }}
        </div>
        <h3>적금</h3>
        <div>
          <input v-model="savingMoney" type="number" placeholder="월저축액" id="saving">
          <label for="saving">원씩</label>
          <input v-model="savingMonth" type="number" placeholder="기간" id="smonths">
          <label for="smonths">개월 간</label>
        </div>
        <div>
          <input v-model="savingRate" type="number" placeholder="금리" id="rate">
          <label for="rate" >%의 적금상품에 저축하면?</label>
        </div>
        <div class="result">
          이자: {{ (savingMoney * savingRate * savingMonth / 1200).toFixed(1) }} / 만기금액: {{ (savingMoney * savingMonth * (savingRate / 1200 + 1)).toFixed(1) }}
        </div>
        <button @click="showModal = !showModal" id="close-btn">닫기</button>
			</div>
		</div>
  </div>
</template>

<script setup>
import { useCounterStore } from '../stores/counter';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { ref, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';

const store = useCounterStore()
const userStore = useUserStore()
const router = useRouter()
const isLikeProductsOpen = ref(false)
const showModal = ref(false)
const like_deposits = ref([])
const like_savings = ref([])
const depositMoney = ref(0)
const depositMonth = ref(0)
const depositRate = ref(0)
const savingMoney = ref(0)
const savingMonth = ref(0)
const savingRate = ref(0)

const openLikeProducts = () => {
  userStore.getUser()
  isLikeProductsOpen.value = !isLikeProductsOpen.value
  if (userStore.isLogin) {
    like_deposits.value = []
    like_savings.value = []
    store.depPdtList.forEach((deposit) => {
      if (userStore.user.like_deposits.includes(deposit.id)) {
        like_deposits.value.push([deposit.fin_prdt_cd, deposit.fin_prdt_nm])
      }
    })
    store.savPdtList.forEach((saving) => {
      if (userStore.user.like_savings.includes(saving.id)) {
        like_savings.value.push([saving.fin_prdt_cd, saving.fin_prdt_nm])
      }
    })
  } else {
    window.alert('로그인이 필요합니다.')
    router.push({ name: 'login' })
  }
}

</script>

<style scoped>
h3 {
  margin-bottom: 20px;
}
.result {
  text-align: center;
  margin-left: 30px;
  margin-bottom: 20px;
  padding: 0 20px;
  border-bottom: 3px solid #FBAF5E;
}
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.container {
  display: flex;
}

.content {
  flex: 1;
  padding: 20px;
}

.sidebar {
  width: 100px;
  background-color: rgba(244, 244, 244, 0.7);
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  margin-top: 0;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-top: 10px;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.sidebar a:hover {
  color: #007bff;
}
.sidelist {
  font-size: 21px;
}

.modal {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
	z-index: 9001;
}
.modal-content {
	position: relative;
  width: 80%;
  height: max-content;
  background-color: rgb(250, 249, 249);
	display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #000;
  padding: 1rem;
  margin: 0 auto;
  margin-top: 1rem;
  animation: move 0.1s ease-in;
}
.modal-content button {
	position: absolute;
}
#close-btn {
	position: absolute;
	top: 10px;
	right: 10px;
}
input{
  position: relative;
  cursor: text;
  font-size: 25px;
  line-height: 20px;
  padding: 0 16px;
  height: 50px;
  width: 150px;
  background-color: #fff;
  border: 1px solid #d6d6e7;
  border-radius: 3px;
  color: rgb(35, 38, 59);
  box-shadow: inset 0 1px 4px 0 rgb(119 122 175 / 30%);
  overflow: hidden;
  transition: all 100ms ease-in-out;
  margin-right: 5px;
  margin-left: 30px;
  margin-bottom: 20px;
}
input:focus {
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