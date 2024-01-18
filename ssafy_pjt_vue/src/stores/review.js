import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'

export const useReviewStore = defineStore('review', () => {
  const router = useRouter()
  const reviews = ref([])
  const API_URL = 'http://127.0.0.1:8000'

  const getReviews = function () {
    axios({
      method: 'get',
      url: `${API_URL}/reviews/`
    })
      .then((res) => {
        reviews.value = res.data
        reviews.value.sort((a, b) => b.id - a.id)
      })
      .catch(err => console.log(err))
  }

  return { API_URL, reviews, getReviews }
}, { persist: true })
