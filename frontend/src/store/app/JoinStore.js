import { create } from 'zustand'
import axios from 'axios'
const baseUrl = import.meta.env.VITE_BASE_URL;

const useJoinStore = create((set) => ({
  error: null,
  success: false,
  signUp: async (userData) => {
    set({ error: null, success: false })
    try {
      const response = await axios.post(`${baseUrl}/member/join`, userData)
      if (response.data.success) {
        set({ success: true })
      } else {
        set({ error: response.data.message || '회원가입에 실패했습니다.' })
      }
    } catch (error) {
      set({ error: error.message || '회원가입 중 오류가 발생했습니다.' })
    }
  },
}))

export default useJoinStore