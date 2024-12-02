import { useState, useEffect } from 'react';
import axios from 'axios';
import {styled, keyframes} from 'styled-components';
import './EditTimeTableComponent.css';

const View = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 30px;
`;

const Table = styled.div`
  border: 2px #E6E6E6 solid;
  border-radius: 10px;
  & > table > tbody > tr > td
  {
    cursor: pointer
  }
`;

// 빛나는 효과
const shine = keyframes`
  0% {
    opacity: 1;
  }
  40% {
    opacity: 1;
  }
  100% {
    left: 125%;
    opacity: 0;
  }
`;

const Save = styled.div`
  display: inline-block;
  & > button {
    float: right;
    width: 120px;
    color: white;
    background-color: #121481;
    border-radius: 30px;

    position: relative;
    overflow: hidden; /* 내부의 넘치는 효과가 잘리는 것을 방지 */
  }::before {
    position: absolute;
    top: 0;
    left: -75%;
    z-index: 2;
    display: block;
    content: '';
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,.3) 100%);
    transform: skewX(-25deg);
    opacity: 0;
  }:hover::before {
    opacity: 1;
    animation: ${shine} .75s;
  }
`;

const Test = styled.div`
  & > td{
  }:hover{
    backgroun-color: blue;
  }
`

const baseUrl = import.meta.env.VITE_BASE_URL;

const EditTimeTableComponent = ({ handleEditState, SaveDataState, saveData }) => {
  console.log('-----------------렌더링 확인용----------------')
    // 첫 렌더링 때 조회된 데이터를 기반으로 색칠할 셀 목록(selectedCells)에 셀 데이터 담기
    useEffect(() => {
      daysOfWeek.forEach((day, index) => {
        if (daysOfWeekList.includes(day)&&saveData) {
          // const dayStr = testSD[day]; // 각 요일에 해당하는 문자열 저장(현재는 테스트용 데이터를 넘기는 중)
          const dayStr = saveData[day]; // 각 요일에 해당하는 문자열 저장(현재는 테스트용 데이터를 넘기는 중)
          for (let i = 0; i < 10; i++) {
            if (dayStr[i] === '1') {
              setSelectedCells(prevSelectedCells => [
                ...prevSelectedCells,
                `${i}-${index + 1}`
              ]); // 상태 업데이트 함수의 콜백을 사용하여 안전하게 상태 업데이트
            }
          }
        }
      });
    }, []); // 빈 의존성 배열을 사용하여 컴포넌트가 처음 마운트될 때만 실행
  const [selectedCells, setSelectedCells] = useState([]);
  const [schedule, setSchedule] = useState([
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0']
  ]);

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const daysOfWeekList = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  // const daysOfWeekDict = { 'sunday': 1, 'monday': 2, 'tuesday': 3, 'wednesday': 4, 'thursday': 5, 'friday': 6, 'saturday': 7}
  
  const handleCellClick = (rowIndex, colIndex) => {
    if (colIndex === 0) return; // 1열은 선택 불가
    const cellKey = `${rowIndex}-${colIndex}`;
    const newSelectedCells = selectedCells.includes(cellKey)
      ? selectedCells.filter(key => key !== cellKey)
      : [...selectedCells, cellKey];

    const newSchedule = schedule.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        newSelectedCells.includes(`${rIndex}-${cIndex}`) ? '1' : '0'
      )
    );

    setSelectedCells(newSelectedCells);
    setSchedule(newSchedule);
  };

  console.log(selectedCells);
  const isSelected = (rowIndex, colIndex) => {
    return selectedCells.includes(`${rowIndex}-${colIndex}`);
  };


  // (table body부분)- 2. 열 생성(각각의 칸 생성)
  // cell을 생성하며 색칠하는 작업까지 한 번에 이뤄짐
  const renderCell = (content, rowIndex, colIndex) => (
     <td
      key={colIndex}
      onClick={() => handleCellClick(rowIndex, colIndex)}
      style={{ backgroundColor: isSelected(rowIndex, colIndex) ? '#D6D6D6' : 'transparent' }}
    >
      {content}
    </td>
  );

  // (table body부분)- 1. 행 생성
  const renderRow = (rowContent, rowIndex) => (
    <tr key={rowIndex}>
      {rowContent.map((cellContent, colIndex) => renderCell(cellContent, rowIndex, colIndex))}
    </tr>
  );

  const tableContent = [
    ['', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    ['9:00\
      -\
      10:00', '', '', '', '', '', '', ''],
    ['10:00\
      -\
      11:00', '', '', '', '', '', '', ''],
    ['11:00\
      -\
      12:00', '', '', '', '', '', '', ''],
    ['12:00\
      -\
      1:00', '', '', '', '', '', '', ''],
    ['1:00\
      -\
      2:00', '', '', '', '', '', '', ''],
    ['2:00\
      -\
      3:00', '', '', '', '', '', '', ''],
    ['3:00\
      -\
      4:00', '', '', '', '', '', '', ''],
    ['4:00\
      -\
      5:00', '', '', '', '', '', '', ''],
    ['5:00\
      -\
      6:00', '', '', '', '', '', '', ''],
  ];

  
  const [SaveSchedule, handleSaveSchedule] = useState({})
  
  const ReadSchedule = async () => {
    try{
      const response = await axios.get(`${baseUrl}/counselor/schedule`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log('요일별 일정 조회 성공');
        console.log('서버 응답:', response.data);
        console.log('saveData에 넣을 데이터:', response.data.data.schedule);
        handleSaveSchedule(response.data.data.schedule) // 저장된 데이터 조회해서 SaveSchedule에 집어넣기
      }
    } catch (err) {
      console.error('에러 발생:', err)
    }
  } 

  // 요일별 일정을 수정
  const UpdateSchedule = async () => {
    const scheduleResult = {};
    daysOfWeek.forEach((day, colIndex) => {
      const dayValues = schedule.map((row) => row[colIndex + 1]); // 열 값을 추출, 1열은 제외하고 2열부터 시작
      scheduleResult[day] = dayValues.join('');
    });
  
    try {
      const response = await axios.put(
        `${baseUrl}/counselor/schedule`,
        {
          monday: scheduleResult.monday,
          tuesday: scheduleResult.tuesday,
          wednesday: scheduleResult.wednesday,
          thursday: scheduleResult.thursday,
          friday: scheduleResult.friday,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // 쿠키를 포함하여 요청
        }
      );
      if (response.status === 200) {
        console.log('성공적으로 변경되었습니다.');
        console.log('서버 응답:', response.data);
        SaveDataState(scheduleResult); // saveData를 부모로 전달
        handleEditState(false); // 편집 모드 종료
      }
    } catch (error) {
      console.error('에러 발생:', error);
      console.log(scheduleResult);
    }
  };
  

  return (
    <View>
      {/* <p>수정 모드</p> */}
      <Table>
        <table>
          <thead>
            <tr>{tableContent[0].map((content, colIndex) => <th key={colIndex} style={{ color: colIndex === 1 ? '#FF0000' : 'black' }}>{content}</th>)}</tr>
          </thead>
          <tbody>
            {tableContent.slice(1).map((rowContent, rowIndex) => renderRow(rowContent, rowIndex))}
          </tbody>
        </table>
      </Table>
      <Save>
        <button onClick={UpdateSchedule}>저장</button>
      </Save>
    </View>
  );
};

export default EditTimeTableComponent;
