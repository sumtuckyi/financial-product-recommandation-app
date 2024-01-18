<template>
	<div class="container">
		<h1>금융 상품 조회</h1>
		<div class="wrapper1">
			<h3>인기상품</h3>
			<div>
				<ul class="best-pdts">
					<li 
						v-for="pdt in temp_pdts"
						:key="pdt.id"
						class="card"
						@click="goDetail(pdt.fin_prdt_cd)"
					>
					<p class="pdt-name">{{ pdt.fin_prdt_nm }}</p>
					<p class="bank-name">{{ pdt.kor_co_nm }}</p>
					<p class="rate-info">{{ pdt.mtrt_int }}</p>
				</li>
				</ul>
			</div>
		</div>
		<div class="wrapper4">
			<RouterLink :to="{ name: 'deposit' }">
				<div class="card-2" @mouseover="changeImageSrc(1)" @mouseout="resetImageSrc(1)">
					예금 조회<img :src="img_src_1" alt="icon">
				</div>
			</RouterLink>
			<RouterLink :to="{ name: 'saving' }">
				<div class="card-2" @mouseover="changeImageSrc(2)" @mouseout="resetImageSrc(2)">
					적금 조회<img :src="img_src_2" alt="">
				</div>
			</RouterLink>
		</div>
		<div class="wrapper3">
			<div class="innerbox">
				<h3>은행 및 상품 이름으로 검색</h3>
				<form @submit.prevent="goSearch">
					<input id="bank-search-input" type="text" v-model.trim="keyword" placeholder="은행이나 상품 이름을 입력하세요.">
					<button type="submit">검색</button>
				</form>
			</div>
		</div>
		<div class="wrapper2">
			<h3>기간별 상품 조회</h3>
			<div class="box">
				<form @submit.prevent="filterPdt">
					<div id="pdt">
						<p class="field">예금종류</p>
						<!-- <input type="radio" name="all-pdt" value="all-pdt" v-model="type">
						<label for="all-pdt">전체</label> -->
						<input type="radio" name="dep" value="dep" v-model="type" id="dep">
						<label for="dep">예금</label>
						<input type="radio" name="sav" value="sav" v-model="type" id="sav">
						<label for="sav">적금</label>
					</div>
					<div id="period">
						<p class="field">가입기간</p>
						<input type="radio" name="all" value="all" v-model="period" id="all">
						<label for="all">전체</label>
						<input type="radio" name="6" value="6" v-model="period" id="6">
						<label for="6">6개월</label>
						<input type="radio" name="12" value="12" v-model="period" id="12">
						<label for="12">12개월</label>
						<input type="radio" name="24" value="24" v-model="period" id="24">
						<label for="24">24개월</label>
						<input type="radio" name="36" value="36" v-model="period" id="36">
						<label for="36">36개월</label>
					</div>
					<button id="search-btn">조회</button>
					<p v-if="isError">아직 선택을 마치지 않았습니다.</p>
				</form>
			</div>
		</div>
		
	</div>
	 
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios';
import { useCounterStore } from '../stores/counter';
import { useRoute, useRouter } from 'vue-router';
const products = ref([])
const temp_pdts = ref([]) // 나중에 가입자수가 많은 순으로 3개의 상품만 받아서 저장할 것
const store = useCounterStore()
const router = useRouter()

const type = ref(null)
const period = ref(null)
const isError = ref(false)
const keyword = ref('')

const img_src_1 = ref('../../public/zoom-dynamic-color.png')
const img_src_2 = ref('../../public/zoom-dynamic-color.png')
const changeImageSrc = function (idx) {
	if (idx === 1) {
		img_src_1.value = '../../public/zoom-dynamic-gradient.png'
	} else {
		img_src_2.value = '../../public/zoom-dynamic-gradient.png'
	}
}
const resetImageSrc = function (idx) {
	if (idx === 1) {
		img_src_1.value = '../../public/zoom-dynamic-color.png'
	} else {
		img_src_2.value = '../../public/zoom-dynamic-color.png'
	}
}

const filterPdt = function () {
	// 사용자가 하나라도 선택하지 않으면
	if (!period.value || !type.value) {
		console.log("dd")
		// Display an error message or handle the case where both fields are not selected
		// alert('Please select values for both fields');
		isError.value = true
		return
	} else { // 두 가지 필드를 모두 선택한 경우
		isError.value = false
		router.push({ name:'searchBestPdt', params: { type: type.value, per: period.value }})
	}
	console.log(type.value, period.value)
}

const goSearch = function () {
	if (keyword.value === '') {
		window.alert('검색어를 입력해주세요!')
	} else {
		router.push({ name: 'bankSearch', params: { name: keyword.value }})
	}
}

onMounted(() => {
	
	store.save_deposits() // db -> 스토어 
	// store.save_savings()
	const temp_data = store.depPdtList // 스토어에서 예금 상품 리스트 가져오기
	console.log('정렬 이전', temp_data)
	temp_data.sort((a, b) => 
			b.like_users.length - a.like_users.length
		)	
	console.log(temp_data[4].like_users.length)
	temp_pdts.value = temp_data.slice(0, 3)
})

watch(() => store.depPdtList, (newvalue) => {
	const temp_data = newvalue // 스토어에서 예금 상품 리스트 가져오기
	console.log('정렬 이전', temp_data)
	temp_data.sort((a, b) => 
			b.like_users.length - a.like_users.length
		)	
	console.log(temp_data[4].like_users.length)
	temp_pdts.value = temp_data.slice(0, 3)
})

const goDetail = function (key) {
	router.push({name: 'depositDetail', params: {id: key}})
}

</script>

<style scoped>
* {
	box-sizing: content-box;
}
a {
	text-decoration: none;
	margin: 0.5rem;
}
.container {
	width: 100vw;
	/* height: 1200px; */
	display: flex;
	flex-direction: column;
	align-items: center;
	/* padding: 2rem; */
	margin: 0 auto;
	margin-top: 2rem;
	/* border: 1px solid darkcyan; */
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-use-select: none;
	user-select: none;
}
.wrapper1 {
	/* border: 1px solid black; */
	background-color: #8bb3eece;
	width: 100vw;
	padding: 2rem;
	display: flex;
	flex-direction: column;
	text-align: center;
}
.wrapper2 {
	/* border: 1px solid rosybrown; */
	display: flex;
	width: 100%;
	height: 300px;
	padding: 2rem;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/* background-color: #EDEFF2; */
}
.wrapper3 {
	/* border: 1px solid darkred; */
	display: flex;
	width: 100vw;
	height: 300px;
	/* padding-left: 600px; */
	flex-direction: column;
	justify-content: center;
	background-color: #EDEFF2;
}
.wrapper4 {
	display: flex;
	width: auto;
	height: 300px;
	align-items: center;
}
.field {
	color: #081894;
	font-size: 20px;
}
.best-pdts {
	display: flex;
	justify-content: center;
}
.card {
	width: 200px;
	height: 250px;
	margin: 0 1.5rem;
	padding: 2rem;
	background-color: aliceblue;
	border-radius: 5px;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	transition: transform 0.3s ease-in-out;
}
.card:hover {
    transform: scale(1.15);
	box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}
.card-2 {
	width: 300px;
	height: 100px;
	margin: 0 1.5rem;
	padding: 2rem;
	background-color: #EDEFF2;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	transition: transform 0.3s ease-in-out;
	font-size: 50px;
	display: flex;
	justify-content: space-around;
	align-items: center;

}
.card-2:hover {
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	transform: scale(1.1);
}
.pdt-name {
	font-size: 25px;
}
.bank-name {
	color: #3c4fe0;
	font-weight: bold;
	
}
.rate-info {
	margin-top: 10px;
	font-size: 13px;	
	text-align: justify;
}
#pdt {
	margin: 0.5rem;
	display: flex;
	padding: 0.5rem;
	font-size: 20px;
}
#pdt > * {
	margin-right: 1rem;
}
#period {
	margin: 0.5rem;
	display: flex;
	padding: 0.5rem;
	font-size: 20px;
}
#period > * {
	margin-right: 1rem;
}

.innerbox {
	width: initial;
	margin: 0 auto;
}
img {
	width: 70px;
	height: 70px;
}
li {
	list-style: none;
}
h1 {
	margin-bottom: 1rem;
	font-size: 50px;
}
h3 {
	margin-bottom: 2rem;
	font-size: 30px;
}
a {
	color: #3c4fe0;
	margin: 0;
}
/* .innerbox form {
	height: 80px;
} */
.innerbox button {
	height: 50px;
	width: 75px;
	margin-left: 5px;
}
#search-btn {
	display: block;
	margin: 0 auto;
	height: 50px;
	width: 75px;
	margin-top: 20px;
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
  font-size: 14px;
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
#bank-search-input {
	position: relative;
	cursor: text;
	font-size: 14px;
	line-height: 20px;
	width: 500px;
	height: 40px;
	background-color: #fff;
	border: 1px solid #d6d6e7;
	border-radius: 3px;
	color: rgb(35, 38, 59);
	box-shadow: inset 0 1px 4px 0 rgb(119 122 175 / 30%);
	overflow: hidden;
	transition: all 100ms ease-in-out;
	padding: 0.5rem;
}
#bank-search-input:focus {
	border-color: #3c4fe0;
	box-shadow: 0 1px 0 0 rgb(35 38 59 / 5%);
}
</style>