<template>
	<div class="container">
		<h3><span id="strong">{{ keyword }}</span>(으)로 검색한 상품입니다.</h3>
		<div class="wrapper">
			<p v-if="!isDepEmpty"><h4>예금상품</h4></p>
			<div v-for="pdt in pdtList_d" :key="pdt.id" class="card_d" @click="goDetail_d(pdt.fin_prdt_cd)">
				<div class="box-info">
					<p class="bank">{{ pdt.kor_co_nm }}</p>
					<p class="pdt">{{ pdt.fin_prdt_nm }}</p>
				</div>
				<div class="box-rate">
					<p v-if="pdt.min_option === pdt.max_option" class="rate">{{ pdt.max_option + '%' }}</p>
					<p v-else class="rate">
					<span class="min">{{ pdt.min_option + '~' }} </span>
					{{ pdt.max_option + '%' }}</p>
				</div>
			</div>
		</div>
		<div class="wrapper">
			<p v-if="!isSavEmpty"><h4>적금상품</h4></p>
			<div v-for="pdt in pdtList_s" :key="pdt.id" class="card_s"  @click="goDetail_s(pdt.fin_prdt_cd)">
				<div class="box-info">
					<p class="bank">{{ pdt.kor_co_nm }}</p>
					<p class="pdt">{{ pdt.fin_prdt_nm }}</p>
				</div>
				<div class="box-rate">
					<p v-if="pdt.min_option === pdt.max_option" class="rate">{{ pdt.max_option + '%' }}</p>
					<p v-else class="rate">
						<span class="min">{{ pdt.min_option + '~' }}</span>
						{{ pdt.max_option + '%' }}</p>
				</div>
			</div>
			
		</div>
		<p v-if="noResult">검색 결과가 없습니다.</p>
	</div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue'
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useCounterStore } from '../stores/counter';

const route = useRoute()
const router = useRouter()
const store = useCounterStore()
const keyword = route.params.name // 사용자가 검색을 원하는 은행명
const pdtList_d = ref([]) // 해당 은행의 예금 상품 리스트 
const pdtList_s = ref([]) // 해당 은행의 적금 상품 리스트 
const temp_list = ref([]) 
const temp_list2 = ref([])

const isDepEmpty = computed(() => {
	return pdtList_d.value.length === 0
})

const isSavEmpty = computed(() => {
	return pdtList_s.value.length === 0
})

const noResult = computed(() => {
	return (pdtList_d.value.length === 0) && (pdtList_d.value.length === 0)
})

const goDetail_d = function (key) {
	router.push({name: 'depositDetail', params: {id: key}})
}
const goDetail_s = function (key) {
	router.push({name: 'savingDetail', params: {id: key}})
}
onMounted(() => {
	console.log(keyword)
	// 해당 은행의 예금 상품 조회
	// console.log(store.depPdtList)
	temp_list.value = store.depPdtList
	
	const temp = temp_list.value.filter((item) => 
		item.kor_co_nm.includes(keyword) || item.fin_prdt_nm.includes(keyword))
	console.log(temp)
	pdtList_d.value = temp
	
	// 해당 은행의 적금 상품 조회
	temp_list2.value = store.savPdtList

	const temp2 = temp_list2.value.filter((item) => 
		item.kor_co_nm.includes(keyword) || item.fin_prdt_nm.includes(keyword))
	pdtList_s.value = temp2
	
})


// const searchArticles = () => {
//   articles.value = articleStore.articles
//   const searchResult = articles.value.filter((article) => 
//     article.title.includes(search.value) || article.content.includes(search.value)
//   )
//   console.log(searchResult)
//   articles.value = searchResult
// }

</script>

<style scoped>
.container {
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
	width: 75%;
	height: auto;
	margin-top: 2rem;
	margin-bottom: 3rem;
}
h3 {
	margin: 0 auto;
	font-size: 2rem;
	font-weight: 350;
}
.wrapper {
	margin: 0 auto;
	margin-top: 1rem;
	width: 800px;
}
.card_d {
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
	margin: 1rem auto;
	padding: 2rem;
	width: 700px;
	align-items: center;
	display: flex;
	justify-content: space-between;
}
.card_s {
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
	padding: 2rem;
	margin: 1rem auto;
	width: 700px;
	align-items: center;
	display: flex;
	justify-content: space-between;
}

#strong {
	color: #0c3ff7;
	font-size: 2.5rem;
}
.pdt {
	font-size: 1.5rem;
}
.bank {
	color: #00B6FF;
}
.rate {
	font-size: 2rem;
	color: #E76E29;
}
.min {
	font-size: 1.75rem;
	color: #E99143;
}
h4 {
	border-bottom: #0c3ff7 1px solid;
}
</style>