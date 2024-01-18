<template>
	<div class="container">
		<div>
			<h1>예금 상품 조회</h1>
		</div>
		<div class="buttons">
			<router-link :to="{ name: 'saving' }"><button id="saving-btn">적금 상품 조회</button></router-link>
			<button @click="sortByCustomers">판매순</button>
			<button @click="sortByRate">금리순</button>
		</div>
		<div 
			v-for="product in products.slice((currentPage - 1)*perPage, currentPage * perPage)"
			:key="product.id"
			class="box"
			@click="goDetail(product.fin_prdt_cd)"
		>
			<div @click="goDetail(product.fin_prdt_cd)" class="sub-box">
				<div class="box-info">
					<p class="join-way">
						<span v-for="(item, index) in product.join_way.replace(/\u0022/g, '').split(',')" :key="index">
							<span>{{ item + ' ' }}</span>
						</span>
					</p>
					<p>{{ product.kor_co_nm }}</p>
					<p class="pdt-name">{{ product.fin_prdt_nm }}</p>
				</div>
				<div class="box-rate">
					<p v-if="product.min_option === product.max_option" class="rate">{{ product.max_option + '%' }}</p>
					<p v-else class="rate">
					<span class="min">{{ product.min_option + '~' }} </span>
					{{ product.max_option + '%' }}</p>
					<!-- <p>{{ product.min_option }}</p>
					<p v-if="product.min_option !== product.max_option">~{{ product.max_option }}</p> -->
				</div>
			</div>
		</div>
		<div class="pagination">
			<ul>
				<li 
					v-for="page in pages"
					@click="changePage(page)"
				>
					<button>{{ page }}</button>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useCounterStore } from '../stores/counter'; 
import { useRouter } from 'vue-router';
import axios from 'axios'
const store = useCounterStore()
const router = useRouter()

const products = ref([]) // 서버에서 받아온 상품 목록 저장
const goDetail = function (key) {
	router.push({name: 'depositDetail', params: {id: key}})
}

//pagination
const pages = computed(() => {
	return Array.from({length: Math.ceil(products.value.length / perPage.value)}, (v, i) => i + 1)
})
const perPage = ref(5)
const currentPage = ref(1)
const changePage = (page) => {
	currentPage.value = page
} // 표시될 페이지의 인덱스로 현재페이지를 바꿔주기 

// 상품 목록 정렬하기 - 금리 순으로 
const sortedArr_rate = ref([])
watchEffect(() => {
	sortedArr_rate.value = products.value.slice().sort((a, b) => {
		const fa = a.max_option
		const fb = b.max_option

		if (fa < fb) {
			return 1
		} if (fa > fb) {
			return -1
		} else {
			return 0
		}
	})
})
const sortByRate = function () {
	products.value = sortedArr_rate.value 
}

// 상품 목록 정렬하기 - 가입자 순으로
const sortedArr_customer = ref([]) 
watchEffect(() => {
	sortedArr_customer.value = products.value.slice().sort((a, b) => {
		const fa = a.joined_users.length
		const fb = b.joined_users.length
		if (fa < fb) {
			return 1
		} if (fa > fb) {
			return -1
		}
		return 0
	})
})
const sortByCustomers = function () {
	products.value = sortedArr_customer.value
}


onMounted(() => {
	store.get_dep()
	axios({
		method: 'get',
		url: `${store.API_URL}/api2/deposits/`
	})
		.then((res) => {
			console.log(res.data)
			products.value = res.data
		})
		.catch((err) => {
			console.log(err)
		})
})
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.box {
	display: flex;
	position: relative;
	width: 60%;
	margin: 0.5rem;
	padding: 2rem;
	border-radius: 5px;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 50px;
}
.box-info p {
	padding: 0.5rem;
}
.box-info p.join-way span:nth-child(even) {
	color: rgb(30, 30, 133);
}
.box-rate {
	color: #1E1E85;
	width: 100px;
	display: flex;
	align-items: center;
}
.min {
	font-size: 1.5rem;
	color: #3b3b9b;
}
.rate {
	font-size: 2rem;
}
#app > div > div > div > div.box-info > p.pdt-name {
	font-size: 2rem;
}
.buttons {
	margin-top: 1rem;
	width: 60%;
	display: flex;
	justify-content: end;
}
.buttons button {
	margin: 0.1rem;
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
  text-align: center;
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
#page {
	color: black;
	width: 2rem;
	height: 2rem;
	text-align: center;
}
.pagination {
	margin: 1rem;
	text-align: center;
}
.sub-box {
	display: flex;
	width: 100%;
	justify-content: space-between;
}
.join-way {
	color: cadetblue;
	font-size: 15px !important;
}
ul {
	display: flex;
	list-style: none;
	justify-content: center;
	align-items: center;
}

</style>