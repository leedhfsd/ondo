import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useMissionStore from "../../../store/app/MissionStore";
import MissionButton from "../../../components/app/MissionButton";
import char from "./../../../assets/images/test_chara.png";
import "./Mission.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

// axios 인스턴스 생성
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

function MissionPage() {
  const nav = useNavigate();
  const { missions, setMissions, completeMission } = useMissionStore();
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [selectedMissionType, setSelectedMissionType] = useState(null);

  useEffect(() => {
    async function fetchMissions() {
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
          setMissions(newMissions);
        } else {
          throw new Error("서버에서 미션 데이터를 가져오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("미션 가져오기 실패:", error);
        setError(
          "미션을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요."
        );
      }
    }

    fetchMissions();
  }, [setMissions]);

  // 캐릭터 카드 클릭시, 완료된 미션 조회
  const handleCharCardClick = () => {
    nav("/member/mission/completed");
  };

  const handleComplete = async () => {
    try {
      await completeMission(selectedMissionType, selectedMission.title);
      setIsModalOpen(false);
    } catch (error) {
      setError("미션 완료 처리에 실패했습니다. 다시 시도해 주세요.");
    }
  };
  
  const handleOpenModal = (type, mission) => {
    setSelectedMission(mission);
    setSelectedMissionType(type);
    setIsModalOpen(true);
  };

  const renderMissions = (type) => {
    const sortedMissions = [...missions[type]].sort((a, b) => {
      if (a.completeFlag === b.completeFlag) {
        return type === "typical" ? -1 : 1;
      }
      return b.completeFlag - a.completeFlag;
    });

    return (
      <div className="space-y-4">
        {sortedMissions.map((mission) => (
          <MissionButton
            key={mission.title}
            mission={mission}
            onComplete={() => handleOpenModal(type, mission)}
            isCompleted={mission.completeFlag}
            missionType={type}
          />
        ))}
      </div>
    );
  };

  const completedMissionsCount =
    missions.daily.filter((m) => m.completeFlag).length +
    missions.typical.filter((m) => m.completeFlag).length;
  const totalMissionsCount = missions.daily.length + missions.typical.length;
  const remainingMissions = totalMissionsCount - completedMissionsCount;
  const testExp =
    totalMissionsCount > 0
      ? (completedMissionsCount / totalMissionsCount) * 100
      : 0;

  return (
    <div className="scroll">
      <div className="container p-4" id="MissionPage">
        {error && <div className="text-center text-red-500 mb-4">{error}</div>}
        <div
          className="charCard"
          onClick={handleCharCardClick}
          style={{ cursor: "pointer" }}
        >
          <img src={char} alt="Character" />
          <div className="charCard-r">
            <div id="EXP-bar">
              <p>
                {completedMissionsCount} / {totalMissionsCount}
              </p>
              <div
                id="EXP"
                style={{ width: `${testExp}%`, borderRadius: "30px" }}
              ></div>
            </div>
            {totalMissionsCount === completedMissionsCount ? (
              <div>
                <p>우와~ 모든 미션을 달성했구나!</p>
                <p>정말 대단해! 고생했어 🙌</p>
              </div>
            ) : (
              <div>
                <p>오늘 완수한 미션은 {completedMissionsCount}개야!</p>
                <p>앞으로 {remainingMissions}개만 더 하면 끝! 파이팅해보자</p>
              </div>
            )}
          </div>
        </div>
        <div style={{ width: "100%", padding: "0px 10px" }}>
          <h2 className="text-2xl font-bold my-4">특별 미션</h2>
          {renderMissions("typical")}
        </div>
        <div style={{ width: "100%", padding: "0px 10px" }}>
          <h2 className="text-2xl font-bold my-4">데일리 미션</h2>
          {renderMissions("daily")}
        </div>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>미션 완료 체크</h2>
            <div className="modal-actions">
              <button onClick={handleComplete} className="btn-confirm">
                확인
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-cancel"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MissionPage;
