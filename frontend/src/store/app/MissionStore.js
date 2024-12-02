import { create } from 'zustand'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

const useMissionStore = create((set, get) => ({
    missions: {
        daily: [],
        typical: []
    },
    setMissions: (missions) => set({ missions }),
    completeMission: async (type, missionTitle) => {
        try {
            // 타이틀로 처리
            set(state => ({
                missions: {
                    ...state.missions,
                    [type]: state.missions[type].map(mission => 
                        mission.title === missionTitle ? { ...mission, completeFlag: true } : mission
                    )
                }
            }));

            // 서버에 완료 요청(여기서 완료 처리)
            const response = await api.post("/mission/complete", { title: missionTitle });

            if (!response.data.success) {
                // 서버 요청 실패 시 rollback
                set(state => ({
                    missions: {
                        ...state.missions,
                        [type]: state.missions[type].map(mission => 
                            mission.title === missionTitle ? { ...mission, completeFlag: false } : mission
                        )
                    }
                }));
                throw new Error("서버에서 미션 완료 처리에 실패했습니다.");
            }
        } catch (error) {
            console.error("미션 완료 처리 실패:", error);
            throw error;
        }
    },
    fetchMissions: async () => {
        try {
            const [typicalResponse, dailyResponse] = await Promise.all([
                api.get("/mission/todayTypical"),
                api.get("/mission/todayDaily"),
            ]);

            if (typicalResponse.data.success && dailyResponse.data.success) {
                const newMissions = {
                    typical: typicalResponse.data.data.typicalMission || [],
                    daily: dailyResponse.data.data.dailyMission || [],
                };
                set({ missions: newMissions });
            } else {
                throw new Error("서버에서 미션 데이터를 가져오는데 실패했습니다.");
            }
        } catch (error) {
            console.error("미션 가져오기 실패:", error);
            throw error;
        }
    },
}))

export default useMissionStore