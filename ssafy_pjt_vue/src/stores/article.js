import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'

export const useArticleStore = defineStore('article', () => {
  const router = useRouter()
  const articles = ref([])
  const API_URL = 'http://127.0.0.1:8000'

  const getArticles = function () {
    axios({
      method: 'get',
      url: `${API_URL}/articles/`
    })
      .then((res) => {
        articles.value = res.data
        articles.value.sort((a, b) => b.id - a.id)
      })
      .catch(err => console.log(err))
  }

  return { API_URL, articles, getArticles }
}, { persist: true })
