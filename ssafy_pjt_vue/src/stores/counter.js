import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import axios from 'axios'

export const useCounterStore = defineStore('counter', () => {
  const API_URL = 'http://127.0.0.1:8000'
  const ArrForDepCom = ref([])// 예금 상품 비교
  const ArrForSavCom = ref([]) //적금 상품 비교
  
  const depPdtList = ref([])
  const savPdtList = ref([])
  
  const userStore = useUserStore()
    
  const cur_unit_code = {
    // 순서 바꿨음(우리은행 참고)
    'USD': '미국 달러',
    'JPY(100)': '일본 옌(100)',
    'EUR': '유로',
    'GBP': '영국 파운드',
    'CAD': '캐나다 달러',
    'CHF': '스위스 프랑',
    'HKD': '홍콩 달러',
    'CNH': '위안화',
    'THB': '태국 바트',
    'IDR(100)': '인도네시아 루피아(100)',
    'SEK': '스웨덴 크로나',
    'AUD': '호주 달러',
    'DKK': '덴마아크 크로네',
    'NOK': '노르웨이 크로네',
    'SAR': '사우디 리얄',
    'KWD': '쿠웨이트 디나르',
    'BHD': '바레인 디나르',
    'AED': '아랍에미리트 디르함',
    'SGD': '싱가포르 달러',
    'MYR': '말레이지아 링기트',
    'NZD': '뉴질랜드 달러',
    'BND': '브루나이 달러',
  }
  
  // 장고 서버에 요청을 보내 예금상품 정보를 데이터베이스에 저장하도록 함
  const get_dep = function () {
    axios({
      method: 'get',
      url: `${API_URL}/api2/save_deposits/`
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  // 장고 서버에 요청을 보내 적금상품+옵션 정보를 데이터베이스에 저장하도록 함
  const get_sav = function () {
    axios({
      method: 'get',
      url: `${API_URL}/api2/save_savings/`
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  // 장고 서버에 요청을 보내 해당 예금상품의 옵션을 전부 가져오기
  const get_dep_opts = function (fin_prdt_cd) {
    axios({
      method: 'get',
      url: `${API_URL}/api2/deposits/options/${fin_prdt_cd}/`
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const get_sav_opts = function (fin_prdt_cd) {
    axios({
      method: 'get',
      url: `${API_URL}/api2/savings/options/${fin_prdt_cd}/`
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 장고 서버에 요청을 보내 예금상품 리스트 받아와 스토어에 저장하기 
  const save_deposits = function () {
    axios({
      method: 'get',
      url: `${API_URL}/api2/deposits/`
    })
      .then((res) => {
        console.log(res)
        depPdtList.value = res.data
        console.log(depPdtList.value)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const save_savings = function () {
    axios({
      mathod: 'get', 
      url: `${API_URL}/api2/savings/`
    })
      .then((res) => {
        console.log(res)
        savPdtList.value = res.data
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const like_deposits = function (fin_prdt_cd) {
    axios({
      method: 'post',
      url: `${API_URL}/api2/deposits/${fin_prdt_cd}/like/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        console.log(res);
        userStore.getUser()
        save_deposits() // db -> 스토어 
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const like_savings = function (fin_prdt_cd) {
    axios({
      method: 'post',
      url: `${API_URL}/api2/savings/${fin_prdt_cd}/like/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        console.log(res);
        userStore.getUser()
	      save_savings()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const join_deposits = function (opt_pk) {
    axios({
      method: 'post',
      url: `${API_URL}/api2/deposits/options/${opt_pk}/join/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        console.log(res)
        userStore.getUser()
        save_deposits() // db -> 스토어 
        if (res.data.message === 'join') {
          window.alert('가입 완료!')
        } else {
          window.alert('이미 가입한 상품입니다.')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const join_savings = function (opt_pk) {
    axios({
      method: 'post',
      url: `${API_URL}/api2/savings/options/${opt_pk}/join/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        console.log(res)
        userStore.getUser()
	      save_savings()
        if (res.data.message === 'join') {
          window.alert('가입 완료!')
        } else {
          window.alert('이미 가입한 상품입니다.')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return { API_URL, cur_unit_code, get_dep, get_sav, ArrForDepCom, ArrForSavCom, get_dep_opts, get_sav_opts,
    save_deposits, save_savings, depPdtList, savPdtList, like_deposits, like_savings,
    join_deposits, join_savings }
}, { persist: true })
