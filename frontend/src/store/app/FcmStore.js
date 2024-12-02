import { create } from "zustand";

// 상태를 정의하는 기본 스토어
const useFcmStore = create((set) => ({
  fcmtoken: null, // 기본 상태

  // 게시글 목록 설정 (API 응답 구조에 맞게 수정)
  setFcmToken: (response) => {
    set((state) => {
      if (response) {
        return {
          fcmtoken: response,
        };
      }
    });
  },
}));

export default useFcmStore;
