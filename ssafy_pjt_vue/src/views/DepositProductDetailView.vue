<template>
	<div class="container">
		<div class="wrapper">
			<button @click="goBack">뒤로가기</button>
			<h1>상품 안내</h1>
			<div class="box">
				<p class="join-way">
					<span v-for="(item, index) in data.join_way?.replace(/\u0022/g, '').split(',')" :key="index">
						<span>{{ item + '  ' }}</span>
					</span>
				</p>
				<h2 class="pdt-name">{{ data.fin_prdt_nm }}</h2>
				<div class="content">
					<p>
						<p><strong>만기 후 이자율 : </strong></p>
						<span v-for="(item, index) in data.mtrt_int?.split(/[-※]/)" :key="index">
							<span>{{ item }}<br></span>
						</span>
					</p>
					<p><strong>가입대상 :</strong>{{ data.join_member }}</p>
					<p><strong>최고한도 :</strong>{{ max_limit }}</p>
					<p><strong>우대조건 :</strong>{{ data.spcl_cnd }}</p>
					<!-- <p><strong>가입제한 :</strong>{{ data.join_deny }}</p> -->
					<p><strong>기타 유의사항 :</strong>{{ data.etc_note }}</p>
				</div>
				<div class="buttons">
					<button v-if="!isLike" @click="likeProduct(data.fin_prdt_cd)">관심상품에 저장</button>
					<button v-else @click="likeProduct(fin_prdt_cd)">관심상품에서 삭제</button>
					<button @click="addToArray(data)">비교하기</button>
				</div>
			</div>
			<div class="options">
				<ul>
					<li v-for="opt in opts">
						<div class="opt-item">
							<p>금리 유형 : {{ opt.intr_rate_type_nm }}</p>
							<p>저축기간 : {{ opt.save_trm }}개월</p>
							<p v-if="onChange && opt.id === onChangePk">최고우대금리 : <input style="width: 100px; font-size: 16px;" type="number" v-model="intr_rate2" step="0.01"></p>
							<p v-else>최고우대금리 : {{ opt.intr_rate2 }}</p>
							<button v-if="userStore.user.is_staff && !onChange" @click="letsChange(opt)">금리 수정</button>
							<button v-if="onChange && opt.id === onChangePk" @click="changeRate(opt.id)">수정하기</button>
						</div>
						<button @click="joinDeposit(opt.id)">가입하기</button>
					</li> 
				</ul>
			</div>
	
		</div>
		<div v-if="showModal" class="modal">
				<div class="modal-content">
					<button @click="closeModal" id="close-btn">닫기</button>
					<h3>예금 상품 비교하기</h3>
					<p v-if="isEmpty">아직 담은 상품이 없습니다.</p>
					<table v-else>
						<thead>
							<tr>
								<th>상품명</th>
								<th>은행명</th>
								<th>우대조건</th>
								<th>최고한도</th>
								<th>기타사항</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in Arr" :key="item.id" class="card">
								<td>{{ item.fin_prdt_nm }}</td>
								<td>{{ item.kor_co_nm }}</td>
								<td>{{ item.spcl_cnd }}</td>
								<td>{{ max_limit }}</td>
								<td>{{ item.etc_note }}</td>
								<button class="closebutton" @click="deletePdt(item.id)">X</button>
							</tr>
						</tbody>
					</table>
					<!-- <div class="container">
						<div v-for="item in Arr" :key="item.id" class="card">
							<button @click="deletePdt(item.id)">삭제</button>
							<p>{{ item.fin_prdt_nm }}</p>
							<p>{{ item.kor_co_nm }}</p>
							<p>{{ item.mtrt_int }}</p>
						</div>
					</div> -->
				</div>
			</div>
	</div>
</template>

<script setup>
import { useCounterStore } from '../stores/counter';
import { useUserStore } from '../stores/user';
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const store = useCounterStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const opts = ref([])
const isEmpty = computed(() => {
	return Arr.value.length === 0
})
const get_dep_opts = function (fin_prdt_cd) {
    axios({
      method: 'get',
      url: `${store.API_URL}/api2/deposits/options/${fin_prdt_cd}/`
    })
      .then((res) => {
        console.log(res)
				opts.value = res.data
				console.log(opts.value)
      })
      .catch((err) => {
        console.log(err)
      })
  }
const showOpts = function (fin_prdt_cd) {
	get_dep_opts(fin_prdt_cd)

}
// 비교할 상품 2개를 담을 배열
let Arr = ref(store.ArrForDepCom)
// 사용자가 클릭하면 해당 상품을 비교상품 배열에 추가 - 중복 제거, 2개로 제한
const addToArray = function (product) {
	// console.log(store.ArrForCmpDep)

	if(Arr.value.length < 2){
		if(Arr.value.length === 0) {
			Arr.value.push(product)
			// 한 개가 담겼을 때, 모달 띄우기
			showModal.value = true
		} else {
			if(Arr.value[0].id != product.id){
				Arr.value.push(product)
				showModal.value = true
				// console.log(ArrForCmp.value)
			} else {
				const answer = window.confirm('이미 담은 상품입니다.')
				if (answer === true) {
					showModal.value = true
				}
			}
		}
		
	} else {
		const answer = window.confirm('이미 2개의 상품을 담았습니다.')
		if (answer === true) {
			showModal.value = true
		}
	}
}
const closeModal = function () {
	showModal.value = false
}

// 비교함에 담은 상품 삭제하기
const deletePdt = function (id) {
	Arr.value = Arr.value.filter((item) => item.id !== id)
	store.ArrForDepCom = Arr.value
	console.log(id)
	console.log(Arr.value)
}

const max_limit = computed(() => {
	return data.value.max_limit !== -1 ? data.value.max_limit : '없음'
})

const isLike = ref(false)

const data = ref('')
const fin_prdt_cd = route.params.id
onMounted(() => {
	axios({
		method: 'get',
		url: `${store.API_URL}/api2/deposits/${fin_prdt_cd}/`
	})
		.then((res) => {
			console.log(res)
			data.value = res.data
			isLike.value = res.data.like_users.includes(userStore.user.pk)
		})
		.catch((err) => {
			console.log(err)
		})
	showOpts(route.params.id)
})

const likeProduct = function (fin_prdt_cd) {
	if (!userStore.isLogin) {
		window.alert('로그인이 필요합니다.')
		router.push({ name: 'login' })
	} else {
		store.like_deposits(fin_prdt_cd)
		// isLike.value = userStore.user.like_deposits.includes(data.value.id)
		isLike.value = !isLike.value
		// location.reload()
	}
}

const joinDeposit = function (opt_pk) {
	if (!userStore.isLogin) {
		window.alert('로그인이 필요합니다.')
		router.push({ name: 'login' })
	} else {
		store.join_deposits(opt_pk)
	}
}

const onChange = ref(false)
const onChangePk = ref(null)
const intr_rate2 = ref(null)

const letsChange = function (opt) {
	onChange.value = !onChange.value
	onChangePk.value = opt.id
	intr_rate2.value = opt.intr_rate2
}

const changeRate = function (optId) {
	axios({
		method: 'put',
		url: `${store.API_URL}/api2/deposits/options/${optId}/change/`,
		data: {
			intr_rate2: intr_rate2.value
		},
		headers: {
			Authorization: `Token ${userStore.token}`
		}
	})
		.then((res) => {
			console.log(res)
		})
		.catch((err) => {
			console.log(err)
		})
	onChange.value = !onChange.value
	onChangePk.value = null
	intr_rate2.value = null
	showOpts(route.params.id)
	window.alert('변경이 완료되었습니다.')
	location.reload()
}

const goBack = function () {
	router.go(-1)
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
}
#back-btn {
	width: 5rem;
}
.wrapper {
	width: 1000px;
}
.box {
	margin-top: 2rem;
	padding: 2rem;
	background-color: #508ef36e;
	box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
}
.content {
	line-height: 2;
}
h1 {
	margin-top: 1rem;
	padding: 1rem;
	border-bottom: 1px solid #dddddd;
}
h2 {
	color: #0b4a8a;
	padding: 1rem 0;
	font-size: 35px;
}
.buttons {
	margin-top: 1rem;
}

.options {
	padding: 2rem;
	border-radius: 5px;
	box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
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
.card {
	position: relative;
	margin: 0;
	width: 40%;
	border: white 0.5px solid;
}
.card button {
	position: absolute;
	right: 0;
	top: 0;
}
.card p{
	margin: 0;
	padding: 0.5rem;
	font-size: 1rem;
}
ul {
	list-style: none;
	display: flex;
	flex-direction: column;
}
li {
	margin: 1rem;
	display: flex;
	justify-content: space-between;
	line-height: 2;
}
.opt-item {
	display: flex;
}
.opt-item > p {
	margin-right: 2rem;
}
@keyframes move {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
table {
  border-collapse: collapse;
  width: 70%;
  font-size: 20px;
}
/* Style the table header */
th, td {
  border: 1px solid rgba(27, 31, 35, 0.15);
  text-align: left;
  padding: 30px 10px;
	/* padding-top: 3rem; */
}

/* Add background color to alternating rows for better readability */
/* tr:nth-child(even) {
  background-color: #FFF0DD;
}
tr:nth-child(odd) {
  background-color: #FFCF96;
} */

/* Style the table header */
th {
  color: white;
  background-color: #FBAF5E;

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
	margin-right: 1rem;
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
.closebutton {
	background-color: transparent;
	border: 1px solid #FBAF5E;
	box-shadow: none;
	color: #FBAF5E;
	border-radius: 0;
	padding: 5px;
	padding-top: 3px;
	height: 25px;
}
</style>