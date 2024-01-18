<template>
  <div v-if="userStore.user.is_staff" class="staff">
    <h1>관리자님 안녕하세요!</h1>
  </div>
  <div v-else class="container">
    <div class="profile-container">
      <form class="form-list">
        <div class="form-item">
          <p>아이디:</p>
          <p>이메일:</p>
          <p>이름:</p>
        </div>
        <div class="form-item">
          <p>{{ userStore.user.username }}</p>
          <p>{{ userStore.user.email }}</p>
          <p>{{ userStore.user.last_name+userStore.user.first_name }}</p>
        </div>
      </form>
      <div>
        <RouterLink :to="{ name: 'profileupdate'}">
          <button>회원정보 수정</button>
        </RouterLink>
        <RouterLink :to="{ name: 'passwordchange'}">
          <button>비밀번호 변경</button>
        </RouterLink>
        <RouterLink 
          :to="{ name: 'portfoliocreate' }"
          v-if="!userStore.pfExist"><button>포트폴리오 만들기</button></RouterLink>
        <RouterLink v-else :to="{ name: 'portfoliodetail' }"><button>포트폴리오 보기</button></RouterLink>
      </div>
    </div>
    <div class="my-products-list">
      <div class="product-card">
        <h2>가입한 예금 상품</h2>
        <br>
        <div v-for="deposit in my_deposits">
          {{ deposit.pk }}: {{ deposit.coname }} - <RouterLink class="router" :to="{ name: 'depositDetail', params: {id: deposit.fin_prdt_cd} }">{{ deposit.prdtname }}</RouterLink>
        </div>
      </div>
      <div class="product-card">
        <h2>가입한 적금 상품</h2>
        <br>
        <div v-for="saving in my_savings">
          {{ saving.pk }}: {{ saving.coname }} - <RouterLink class="router" :to="{ name: 'savingDetail', params: {id: saving.fin_prdt_cd} }">{{ saving.prdtname }}</RouterLink>
        </div>
      </div>
    </div>
    <div class="canvas">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCounterStore } from '../stores/counter';
import { onMounted, ref } from 'vue';
import { Chart, registerables } from 'chart.js'

const userStore = useUserStore()
const store = useCounterStore()
const my_deposits = ref([])
const my_savings = ref([])

onMounted(() => {
  userStore.getUser()
})

let pkD = 1
let pkS = 1

store.depPdtList.forEach((deposit) => {
  deposit.depositoption_set.forEach((option) => {
    if (userStore.user.my_depositoptions.includes(option.id)) {
      my_deposits.value.push({pk: pkD++, coname: deposit.kor_co_nm, prdtname: deposit.fin_prdt_nm, rate: option.intr_rate2, fin_prdt_cd: deposit.fin_prdt_cd})
    }
  })
})

store.savPdtList.forEach((saving) => {
  saving.savingoption_set.forEach((option) => {
    if (userStore.user.my_savingoptions.includes(option.id)) {
      my_savings.value.push({pk: pkS++, coname: saving.kor_co_nm, prdtname: saving.fin_prdt_nm, rate: option.intr_rate2, fin_prdt_cd: saving.fin_prdt_cd})
    }
  })
})

const rates = []
const labels = []

my_deposits.value.forEach((deposit) => {
  rates.push(deposit.rate)
  labels.push(deposit.prdtname)
})
my_savings.value.forEach((saving) => {
  rates.push(saving.rate)
  labels.push(saving.prdtname)
})

Chart.register(...registerables)
const chartCanvas = ref('');
let chartInstance = null;
onMounted(() => {
  if (!userStore.user.is_staff) {
	  chartInstance = new Chart(chartCanvas.value?.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '최고우대금리',
            data: rates,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
						backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              	beginAtZero: true,
				ticks: {
				stepSize: 1,
				},
				min: 0,
				max: 10,
            },
        }
      }}
			)
  }
} )

</script>

<style scoped>
.router {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}
.staff {
  text-align: center;
  height: 650px;
}
.container {
  width: 80%;
  margin: 0 auto;
  margin-top: 30px;
}
.profile-container {
  /* border: 1px solid lightgray; */
  width: 95%;
  margin: 0 auto;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
}
.form-list {
  display: flex;
  margin-top: 50px;
  margin-bottom: 100px;
}
.form-item {
  height: 50px;
  font-size: 25px;
  margin-right: 50px;
}

.my-products-list {
  display: flex;
  justify-content: space-evenly;
  margin-top: 5%;
  margin-bottom: 5%;
}
.product-card {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  width: 40%;
  padding: 3%;
}
.canvas {
  width: 70%;
  margin: 0 auto;
}


button {
  margin-right: 1rem;
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