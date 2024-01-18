<template>
  <div class="container">
    <h1 style="text-align: center;">포트폴리오 수정</h1>
    <form @submit.prevent="updatePortfolio"  class="form-list">
      <div class="form-item">
        <select class="select" name="jobs" id="job" v-model.trim="job" required>
          <option disabled value="">직업</option>
          <option value="직장인">직장인</option>
          <option value="프리랜서">프리랜서</option>
          <option value="주부">주부</option>
          <option value="학생">학생</option>
          <option value="무직">무직</option>
        </select>
      </div>
      <div class="form-item">
        <input class="input" type="test" v-model.trim="income" id="income" placeholder="수입">
      </div>
      <div class="form-item">
        <input class="input" type="test" v-model.trim="age" id="age" placeholder="나이">
      </div>
      <div class="form-item">
        <select class="select" name="banks" id="prefferedBank" v-model.trim="prefferedBank" required>
          <option disabled value="">선호 은행</option>
          <option v-for="bank in userStore.banklist" :value="bank">{{ bank }}</option>
        </select>
      </div>
      <div class="form-item last">
        <select class="select" name="types" id="investmentType" v-model.trim="investmentType" required>
          <option disabled value="">저축 성향</option>
          <option value="알뜰형">알뜰형</option>
          <option value="도전형">도전형</option>
          <option value="성실형">성실형</option>
        </select>
      </div>
      <button @click="submit">수정하기</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user';
import axios from 'axios';

const userStore = useUserStore()
const router = useRouter()
const job = ref(userStore.portfolio.job)
const income = ref(userStore.portfolio.income)
const age = ref(userStore.portfolio.age)
const prefferedBank = ref(userStore.portfolio.preffered_bank)
const investmentType = ref(userStore.typeChange[userStore.portfolio.investment_type])

const updatePortfolio = function () {
  const payload = {
    job: job.value,
    income: income.value,
    age: age.value,
    preffered_bank: prefferedBank.value,
    investment_type: investmentType.value
  }
  userStore.updatePortfolio(payload)
}
</script>

<style scoped>
h1 {
  font-size: 3rem;
  margin-top: 50px;
}
.container {
  height: 750px;
}
.form-list {
  text-align: center;
  margin-top: 50px;
  margin-bottom: 100px;
  padding-top: 50px;
  padding-bottom: 50px;
}
.form-item {
  margin-top: -2px;
}
.input {
  width: 50%;
  height: 50px;
  font-size: 25px;
}
.select {
  width: 50.1%;
  height: 50px;
  font-size: 25px;
}
.last {
  margin-bottom: 30px;
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
  font-size: 20px;
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