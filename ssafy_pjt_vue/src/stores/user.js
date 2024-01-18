import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const token = ref(null)
  const API_URL = 'http://127.0.0.1:8000'
  const user = ref({ pk: '' })
  const typeChange = {
    '알뜰형': 1,
    '도전형': 2,
    '성실형': 3,
    1: '알뜰형',
    2: '도전형',
    3: '성실형'
  }
  const portfolio = ref(null)
  const pfExist = computed(() => {
    if (portfolio.value === null) {
      return false
    } else {
      return true
    }
  })
  const banklist = [
    '국민은행',
    '우리은행',
    '하나은행',
    '신한은행',
    '한국스탠다드차타드은행',
    '농협은행',
    '수협은행',
    '대구은행',
    '부산은행',
    '광주은행',
    '제주은행',
    '전북은행',
    '경남은행',
    '중소기업은행',
    '한국산업은행',
    '케이뱅크',
    '카카오뱅크',
    '토스뱅크',]

  const isLogin = computed(() => {
    if (token.value === null) {
      return false
    } else {
      return true
    }
  })

  const signUp = function (payload) {
    const { username, password1, password2, email, first_name, last_name } = payload
    axios({
      method: 'post',
      url: `${API_URL}/accounts/signup/`,
      data: {
        username, password1, password2,
        email, first_name, last_name
      }
    })
      .then((res) => {
        logIn({ username, password: password1 })
        router.push({ name: 'main' })
      })
      .catch((err) => {
        const firstKey = Object.keys(err.response.data)[0]
        window.alert(`${firstKey}: ${err.response.data[firstKey]}`)
      })
  }

  const logIn = function (payload) {
    const { username, password } = payload
    axios({
      method: 'post',
      url: `${API_URL}/accounts/login/`,
      data: {
        username, password
      }
    })
      .then((res) => {
        token.value = res.data.key

        getUser()
        getPortfolio()

        router.push({ name: 'main' })
      })
      .catch((err) => {
        const firstKey = Object.keys(err.response.data)[0]
        window.alert('아이디 혹은 비밀번호를 확인해주세요.')
      })
  }

  const logOut = function () {
    axios({
      method: 'post',
      url: `${API_URL}/accounts/logout/`,
    })
      .then((res) => {
        token.value = null
        user.value = { pk: ''}
        portfolio.value = null
        router.push({ name: 'main' })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getUser = function () {
    axios({
      method: 'get',
      url: `${API_URL}/accounts/user/`,
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then((res) => {
        user.value = res.data
      })
      .catch(err => console.log(err))
  }

  const passwordChange = function (payload) {
    const { old_password, new_password1, new_password2 } = payload
    axios({
      method: 'post',
      url: `${API_URL}/accounts/password/change/`,
      data: {
        old_password, new_password1, new_password2
      },
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then((res) => {
        getUser()
        router.push({ name: 'profile' })
      })
      .catch((err) => {
        const firstKey = Object.keys(err.response.data)[0]
        window.alert(`${firstKey}: ${err.response.data[firstKey]}`)
      })
  }

  const profileUpdate = function (payload) {
    const { email, first_name, last_name } = payload
    axios({
      method: 'put',
      url: `${API_URL}/accounts/${user.value.pk}/update/`,
      data: {
        email, first_name, last_name
      },
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then((res) => {
        getUser()
        router.push({ name: 'profile' })
      })
      .catch((err) => {
        const firstKey = Object.keys(err.response.data)[0]
        window.alert(`${firstKey}: ${err.response.data[firstKey]}`)
      })
  }

  const getPortfolio = function () {
    axios({
      method: 'get',
      url: `${API_URL}/portfolios/detail/`,
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then((res) => {
        portfolio.value = res.data
      })
      .catch(err => console.log(err))
  }

  const createPortfolio = function (payload) {
    const { job, income, age, preffered_bank, investment_type } = payload
    axios({
      method: 'post',
      url: `${API_URL}/portfolios/create/`,
      data: {
        job,
        income,
        age,
        preffered_bank,
        investment_type: typeChange[investment_type]
      },
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then((res) => {
        portfolio.value = res.data
        router.push({ name: 'profile' })
      })
      .catch((err) => {
        const firstKey = Object.keys(err.response.data)[0]
        window.alert(`${firstKey}: ${err.response.data[firstKey]}`)
      })
  }

  const updatePortfolio = function (payload) {
    const { job, income, age, preffered_bank, investment_type } = payload
    axios({
      method: 'put',
      url: `${API_URL}/portfolios/detail/`,
      data: {
        job,
        income,
        age,
        preffered_bank,
        investment_type: typeChange[investment_type]
      },
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then((res) => {
        portfolio.value = res.data
        router.push({ name: 'portfoliodetail' })
      })
      .catch((err) => {
        const firstKey = Object.keys(err.response.data)[0]
        window.alert(`${firstKey}: ${err.response.data[firstKey]}`)
      })
  }

  return { API_URL, token, isLogin, user, signUp, logIn, logOut,
    typeChange, portfolio, pfExist, getUser, getPortfolio, 
    createPortfolio, updatePortfolio, passwordChange,
    profileUpdate, banklist }
}, { persist: true })
