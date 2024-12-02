import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
const api = axios.create({
  baseURL: baseUrl,
  // withCredentials: false, // 기본으로 false 세팅 -> 나중에 함수에서 true로 가게
});

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      accessToken: null,
      refreshToken: null,
      login: async (email, password, fcmtoken) => {
        try {
          const response = await api.post(
            "/member/login",
            { email, password, fcmtoken },
            { withCredentials: true }
          );
          console.log(response);
          if (response.data.success) {
            set({
              role: "USER",
              accessToken: response.data.data.token.accessToken,
              refreshToken: response.data.data.token.refreshToken,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Login failed:", error);
          return false;
        }
      },
      userDelete: async (password) => {
        try {
          const response = await api.delete(`/member/delete`, {
            data: { password: password },
            withCredentials: true,
          });
          if (response.data.success) {
            set({
              role: null,
              user: null,
              accessToken: null,
              refreshToken: null,
            });
            return true;
          }
          console.error("Logout failed:", response.data.message);
          return false;
        } catch (error) {
          console.error(
            "Logout failed:",
            error.response ? error.response.data : error.message
          );
          return false;
        }
      },
      logout: async (fcmtoken) => {
        try {
          const response = await api.post(
            "/member/logout",
            { fcmtoken },
            { withCredentials: true }
          );
          if (response.data.success) {
            set({
              role: null,
              user: null,
              accessToken: null,
              refreshToken: null,
            });
            return true;
          }
          console.error("Logout failed:", response.data.message);
          return false;
        } catch (error) {
          console.error(
            "Logout failed:",
            error.response ? error.response.data : error.message
          );
          return false;
        }
      },
      checkAuth: async () => {
        // console.log("hello?")
        try {
          const response = await api.get("/member/me", {
            withCredentials: true,
          });
          if (response.data.success) {
            console.log("checkAuth" + response);
            set({ user: response.data.data.user, role: "USER" });
            return true;
          }
          set({ user: null });
          return false;
        } catch (error) {
          console.error("Auth check failed:", error);
          set({ user: null });
          return false;
        }
      },
      counselorLogin: async (id, password) => {
        try {
          const response = await api.post(
            "/counselor/login",
            { id, password },
            { withCredentials: true }
          );
          if (response.data.success) {
            const info = await api.get("/counselor/mypage", {
              withCredentials: true,
            });
            console.log(info);
            set({
              user: info.data.data.counselor,
              role: "COUNSELOR",
              accessToken: response.data.data.token.accessToken,
              refreshToken: response.data.data.token.refreshToken,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Login failed:", error);
          return false;
        }
      },
      counselorLogout: async () => {
        try {
          await api.post("/counselor/logout", {}, { withCredentials: true });
          set({
            role: null,
            user: null,
            accessToken: null,
            refreshToken: null,
          });
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),

    {
      name: "auth-storage", // 로컬 스토리지에 저장될 키 이름
      getStorage: () => localStorage, // 기본 로컬 스토리지를 사용
    }
  )
);

export default useAuthStore;
