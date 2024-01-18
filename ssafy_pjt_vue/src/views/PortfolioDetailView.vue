<template>
  <div class="container">
    <div class="portfolio-container">
      <form class="form-list">
        <div class="form-item">
          <p>직업:</p>
          <p>수입:</p>
          <p>나이:</p>
          <p>선호 은행:</p>
          <p>저축 성향:</p>
        </div>
        <div class="form-item">
          <p>{{ userStore.portfolio.job }}</p>
          <p>{{ userStore.portfolio.income }}</p>
          <p>{{ userStore.portfolio.age }}</p>
          <p>{{ userStore.portfolio.preffered_bank }}</p>
          <p>{{ userStore.typeChange[userStore.portfolio.investment_type] }}</p>
        </div>
      </form>
      <div>
        <RouterLink :to="{ name: 'portfolioupdate' }">
          <button>수정하기</button>
        </RouterLink>
      </div>
    </div>
    <h1 style="text-align: center;">포트폴리오를 기반으로 상품을 추천해 드릴게요!</h1>
    <div class="my-products-list">
      <div class="product-card">
        <h2>예금 상품 추천</h2>
        <br>
        <div v-for="deposit in deplist.slice(0, 5)">
          {{ deposit.kor_co_nm }} - <RouterLink class="router" :to="{ name: 'depositDetail', params: {id: deposit.fin_prdt_cd} }">{{ deposit.fin_prdt_nm }}</RouterLink>
        </div>
      </div>
      <div class="product-card">
        <h2>적금 상품 추천</h2>
        <br>
        <div v-for="saving in savlist.slice(0, 5)">
          {{ saving.kor_co_nm }} - <RouterLink class="router" :to="{ name: 'savingDetail', params: {id: saving.fin_prdt_cd} }">{{ saving.fin_prdt_nm }}</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user';
import { useCounterStore } from '../stores/counter';
import axios from 'axios';

const userStore = useUserStore()
const store = useCounterStore()
const deplist = ref(store.depPdtList)
const savlist = ref(store.savPdtList)

deplist.value.forEach((deposit) => {
  let point = 0
  if (userStore.portfolio.job === '직장인' || userStore.portfolio.job === '프리랜서') {
    if (deposit.max_limit === -1) {
      point += 15
    }
  }
  if (userStore.portfolio.income < 30000000) {
    if (deposit.join_deny === 2) {
      point += 20
    }
  }
  if (userStore.portfolio.age > 60) {
    if (deposit.join_way.includes('영업점') || deposit.join_way.includes('전화')) {
      point += 25
    }
  }
  if (deposit.kor_co_nm.includes(userStore.portfolio.preffered_bank)) {
    point += 25
  }
  let max_trm = 0
  deposit.depositoption_set.forEach((option) => {
    max_trm = Math.max(max_trm, option.save_trm)
  })
  if (userStore.portfolio.investment_type === 1) {
    if (max_trm <= 12) {
      point += 15
    }
  } else if (userStore.portfolio.investment_type === 2) {
    if (max_trm = 24) {
      point += 15
    }
  } else if (userStore.portfolio.investment_type === 3) {
    if (max_trm = 36) {
      point += 15
    }
  }
  deposit.point = point
})
deplist.value.sort((a, b) => b.point - a.point,
(a, b) => b.max_option - a.max_option)

savlist.value.forEach((saving) => {
  let point = 0
  if (userStore.portfolio.job === '직장인' || userStore.portfolio.job === '프리랜서') {
    if (saving.max_limit === -1 || saving.max_limit > 500000) {
      point += 15
    }
  }
  if (userStore.portfolio.income < 30000000) {
    if (saving.join_deny === 2) {
      point += 20
    }
  }
  if (userStore.portfolio.age > 60) {
    if (saving.join_way.includes('영업점') || saving.join_way.includes('전화')) {
      point += 25
    }
  }
  if (saving.kor_co_nm.includes(userStore.portfolio.preffered_bank)) {
    point += 25
  }
  let max_trm = 0
  saving.savingoption_set.forEach((option) => {
    max_trm = Math.max(max_trm, option.save_trm)
  })
  if (userStore.portfolio.investment_type === 1) {
    if (max_trm <= 12) {
      point += 15
    }
  } else if (userStore.portfolio.investment_type === 2) {
    if (max_trm = 24) {
      point += 15
    }
  } else if (userStore.portfolio.investment_type === 3) {
    if (max_trm = 36) {
      point += 15
    }
  }
  saving.point = point
})
savlist.value.sort((a, b) => b.point - a.point,
(a, b) => b.max_option - a.max_option)

console.log(deplist.value)
console.log(savlist.value)
</script>

<style scoped>
.router {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}
.container {
  width: 80%;
  margin: 0 auto;
  margin-top: 30px;
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
.portfolio-container {
  width: 95%;
  margin: 0 auto;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100px;
  padding-bottom: 30px;
}
.form-list {
  display: flex;
  margin-top: 50px;
  margin-bottom: 100px;
}
.form-item {
  height: 130px;
  font-size: 25px;
  margin-right: 50px;
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