import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MissionButton from '../../../components/app/MissionButton';

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true
});

function CompletedMissionsPage() {
  const [completedMissions, setCompletedMissions] = useState([]);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchCompletedMissions() {
      try {
        const response = await api.get('/mission/getComplete');
        if (response.data.success) {
          setCompletedMissions(response.data.data.completeMission);
        } else {
          throw new Error('완료된 미션을 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('완료된 미션 가져오기 실패:', error);
        setError(`완료된 미션을 불러오는 데 실패했습니다.`);    // 백틱으로 감싸서 줄바꿈
      }
    }

    fetchCompletedMissions();
  }, []);

  const renderCompletedMissions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {completedMissions.map((mission, index) => (
        <MissionButton
          key={mission.id}
          mission={mission}
          isCompleted={true}
          missionType={mission.type}
        />
      ))}
    </div>
  );

  return (
    <div className='scroll'>
      <div className="container mx-auto p-4" id='CompletedMissionsPage'>
        <button onClick={() => nav('/member/mission/list')} className="mb-4 bg-[#BFA1FF] text-white px-4 py-2 rounded">
          미션 페이지로 돌아가기
        </button>
        <h1 className="text-2xl font-bold mb-4">완료한 미션</h1>
        {error && <div className="text-center text-red-500 mb-4">{error}</div>}
        {renderCompletedMissions()}
      </div>
    </div>
  );
}

export default CompletedMissionsPage;