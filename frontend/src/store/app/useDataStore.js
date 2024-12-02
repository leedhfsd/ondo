import { create } from 'zustand'
import axios from 'axios'

// articleId가 제대로 할당 아직 안 됨!!

const useDataStore = create((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchData: async () => {
    set({ isLoading: true })
    try {
        // 예시당
      const response = await axios.get('https://api.example.com/data')
      set({ data: response.data, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch data', isLoading: false })
    }
  },
  postData: async (newData) => {
    set({ isLoading: true })
    try {
        // 예시라고
      const response = await axios.post('https://api.example.com/data', newData)
      set({ data: response.data, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to post data', isLoading: false })
    }
  },
}))

export default useDataStore