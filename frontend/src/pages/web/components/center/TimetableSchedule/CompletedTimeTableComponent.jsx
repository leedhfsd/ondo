import { useState, useEffect } from 'react';
import axios from 'axios';
import {styled, keyframes} from 'styled-components';
import './EditTimeTableComponent.css';

import EditImg from './../../../../../assets/images/editPen.png'

const View = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 30px;
`;

const Table = styled.div`
  border: 2px #E6E6E6 solid;
  border-radius: 10px;
`;

// 흔들림 애니메이션 정의
const shake = keyframes`
  0%, 100% {
    transform: rotate(0deg);
  }
  20%, 60% {
    transform: rotate(-10deg);
  }
  40%, 80% {
    transform: rotate(10deg);
  }
`;

const EditBtn = styled.div`

  // margin-left: 85%;
  //   background-color: #ffa79d;
  // height: fit-content;
  // width: fit-content;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // border: none;
  // border-radius: 5px;
  // cursor: pointer;

  & > div:hover img {
    animation: ${shake} 0.5s;
  }
  & > div{
    display: flex;
    align-items: center;
    cursor: pointer;
    float: right;
  }
`

const Save = styled.div`
  display: inline-block;
  & > button {
    float: right;
    width: 120px;
    color: white;
    background-color: #121481;
    border-radius: 30px;
  }
`;

const testSD = {monday: '110000000', 
                tuesday: '100100000', 
                wednesday: '100000000', 
                thursday: '100000000', 
                friday: '100000000'} // 테스트용 더미데이터

const CompletedTimeTable = ({ handleEditState, saveData }) => {

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const daysOfWeekList = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const [selectedCells, setSelectedCells] = useState([]);

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

                  
  console.log('-----------------렌더링 확인용----------------')

  const isSelected = (rowIndex, colIndex) => {
    return selectedCells.includes(`${rowIndex}-${colIndex}`);
  };


  // (table body부분)- 2. 열 생성(각각의 칸 생성)
  // cell을 생성하며 색칠하는 작업까지 한 번에 이뤄짐
  const renderCell = (content, rowIndex, colIndex) => (
     <td
      key={colIndex}
      // onClick={() => handleCellClick(rowIndex, colIndex)}
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

  
  // 요일별 일정을 수정
  const EditSchedule = async () => {
    handleEditState(true)
    
  };

  return (
    <View>
        <EditBtn onClick={EditSchedule}>
          <div>
            <img style={{height: '25px', width: '25px'}} src={EditImg} alt="" />
            <p style={{color: '#757575'}}>수정하기</p>
          </div>
        </EditBtn>
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
      {/* <Save>
        <button onClick={EditSchedule}>수정</button>
      </Save> */}
    </View>
  );
};

export default CompletedTimeTable;
