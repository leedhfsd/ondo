import { create } from "zustand";
import axios from "axios";
import { formatLocalDateToISO } from '../../utils/dateUtils'

const baseUrl = import.meta.env.VITE_BASE_URL;
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// const formattedDate = formatLocalDateToISO(date);
// const dateString = formattedDate.split("T")[0];

// 성별 매핑 추가
const GENDER_MAP = {
  MALE: "남",
  FEMALE: "여",
};

const GENDER_REVERSE_MAP = {
  남: "MALE",
  여: "FEMALE",
};

const useCounselorStore = create((set, get) => ({
  counselors: [], // 모든 상담사 목록
  selectedCounselor: null, // 특정 상담사의 상세 정보
  counselorSchedule: {}, // 상담사의 불가능한 일정 (객체 형태로 변경)
  userReservations: [], // 사용자의 예약 목록
  isLoading: false, // 비동기 작업 위한 로딩 상태
  error: null,

  // 성별 매핑 함수 추가
  displayGender: (gender) => GENDER_MAP[gender] || gender,
  searchGender: (gender) => GENDER_REVERSE_MAP[gender] || gender,

  // 모든 상담사 목록 가져오기
  fetchCounselors: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/member/counselor/list");
      set({ counselors: response.data.data.counselorList, isLoading: false });
    } catch (error) {
      console.error("Error fetching counselors:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // 특정 상담사의 상세 정보 가져오기
  fetchCounselorDetails: async (counselorId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/member/counselor/list/${counselorId}`);
      set({
        selectedCounselor: response.data.data.counselor,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching counselor details:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // 상담사의 가능한 일정이 아니라 거르는 일정
  fetchCounselorSchedule: async (counselorId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        `/member/reservation/counselor/${counselorId}`
      );
      const schedule = response.data.data.counselorSchedule;
      // console.log('schedule', schedule)

      // 데이터 구조 변경
      const formattedSchedule = schedule.reduce((acc, dateTime) => {
        const [date, time] = dateTime.split('T');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(time.substring(0, 5));
        return acc;
      }, {});

      // console.log('formattedSchedule', formattedSchedule)

      set({ counselorSchedule: formattedSchedule, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // 예약하기
  makeReservation: async (counselorId, reservationDate, detail) => {
    set({ isLoading: true });
    try {
      const reservationDateString = formatLocalDateToISO(new Date(reservationDate));

      const response = await api.post("/member/reservation/make", {
        counselorId,
        reservationDate: reservationDateString,
        detail,
      });

      if (response.data.success) {
        const newReservation = {
          counselorId: counselorId,
          reservationDate: reservationDateString,
          detail: detail,
          counselor: get().selectedCounselor,
          dday: get().calculateDday(reservationDateString),
        };

        set((state) => ({
          userReservations: [...state.userReservations, newReservation],
          isLoading: false,
        }));
      }

      return response.data;
    } catch (error) {
      console.error(
        "Error making reservation:",
        error.response?.data || error.message
      );
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  // 사용자의 예약 목록 가져오기
  fetchUserReservations: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/member/reservation/getReservation");
      // console.log("Raw reservation data:", JSON.stringify(response.data, null, 2));

      const reservations = await Promise.all(
        response.data.data.reservationList.map(async (reservation) => {
          // console.log("Processing reservation:", JSON.stringify(reservation, null, 2));

          try {
            const counselorResponse = await api.get(
              `/member/counselor/list/${reservation.counselorId}`
            );
            // console.log("Counselor data for reservation:", JSON.stringify(counselorResponse.data, null, 2));

            return {
              ...reservation,
              dday: get().calculateDday(reservation.reservationDate),
              counselor: counselorResponse.data.data.counselor,
            };
          } catch (counselorError) {
            console.error("Error fetching counselor data:", counselorError);
            return {
              ...reservation,
              dday: get().calculateDday(reservation.reservationDate),
              counselor: null,
            };
          }
        })
      );

      // console.log("Processed reservations:", JSON.stringify(reservations, null, 2));
      set({ userReservations: reservations, isLoading: false });
    } catch (error) {
      console.error("Error fetching user reservations:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // 예약 취소하기
  cancelReservation: async (reservationId) => {
    set({ isLoading: true });
    try {
      const response = await api.delete(
        `/member/reservation/cancel/${reservationId}`
      );

      if (response.data.success) {
        const updatedReservations = get().userReservations.filter(
          (r) => r.id !== reservationId
        );
        set({ userReservations: updatedReservations, isLoading: false });
        return response.data;
      } else {
        throw new Error(response.data.message || "취소 요청이 실패했습니다.");
      }
    } catch (error) {
      console.error("예약 취소 중 오류 발생:", error.response || error);
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "상담 예약 취소 중 오류가 발생했습니다.",
      });
      throw error;
    }
  },

  // dday 계산
  calculateDday: (reservationDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reservDate = new Date(reservationDate);
    reservDate.setHours(0, 0, 0, 0);
    const timeDiff = reservDate.getTime() - today.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (dayDiff > 0) return `D-${dayDiff}`;
    if (dayDiff === 0) return "D-day";
    if (dayDiff === -1) return "상담완료";
    return null; // D-day가 지난 경우 null을 반환
  },

  // 시간계산용
  calculateExactDateTime: (reservationDate) => {
    const now = new Date();
    const reservDate = new Date(reservationDate);
    const timeDiff = reservDate.getTime() - now.getTime();
    const hoursPassed = (now.getTime() - reservDate.getTime()) / (1000 * 60 * 60);

    return {
      exactDateTime: reservDate,
      millisUntilReservation: timeDiff,
      isBeforeReservation: timeDiff > 0,
      isDuringReservation: timeDiff <= 0 && timeDiff > -60 * 60 * 1000, // 상담 시작부터 1시간 동안
      isAfterReservation: timeDiff <= -60 * 60 * 1000,
      hoursPassed: hoursPassed,
    };
  },
}));

export default useCounselorStore;