import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import EditTimeTableComponent from './TimetableSchedule/EditTimeTableComponent';
import CompletedTimeTable from './TimetableSchedule/CompletedTimeTableComponent';

const View = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 30px;
`;

const baseUrl = import.meta.env.VITE_BASE_URL;

const TimeTableComponent = () => {
  const [Edit, handleEditState] = useState(false);
  const [saveData, SaveDataState] = useState(() => {
    // 초기 로드 시, localStorage에서 데이터 불러오기
    const savedData = localStorage.getItem('saveData');
    return savedData ? JSON.parse(savedData) : null;
  });

  useEffect(() => {
    // API를 통해 최신 데이터를 가져오기
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/counselor/schedule`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          const newSchedule = response.data.data.schedule;
          SaveDataState(newSchedule);

          // 최신 데이터를 localStorage에 저장
          localStorage.setItem('saveData', JSON.stringify(newSchedule));
        }
      } catch (error) {
        console.error('데이터 가져오기 에러:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // saveData가 변경될 때마다 localStorage에 저장
    if (saveData) {
      localStorage.setItem('saveData', JSON.stringify(saveData));
    }
  }, [saveData]);

  return (
    <View>
      {Edit ? (
        <EditTimeTableComponent saveData={saveData} handleEditState={handleEditState} SaveDataState={SaveDataState} />
      ) : saveData ? (
        <CompletedTimeTable handleEditState={handleEditState} saveData={saveData} />
      ) : (
        <p>Loading...</p> // 데이터를 로드 중일 때 표시할 내용
      )}
    </View>
  );
};

export default TimeTableComponent;
