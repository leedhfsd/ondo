import { useEffect } from "react";
import styled from "styled-components";

const Tab = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; // 오타 수정
  & > h3 {
    color: #121481;
    font-size: 20px;
  }
  & > p {
    font-size: 12x;
    color: #8F8F96;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const Btn = styled.div`
  & > div > button:hover{
    background-color: #D1D5DB;
    color: white;
  }
`


const CustomBtn = styled.div`
  background-color: ${(props) => (props.selected ? 'pink' : 'white')};
`;

const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const morningTimes = ['09:00', '10:00', '11:00'];
const afternoonTimes = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const CounselorTimeSlots = ({ selectedDate, selectedTime, setSelectedTime}) => {

  // useEffect(() => {
  //   console.log('saveTime 채워졌는지 확인용:', saveTime)
  //   // setSelectedTime(saveTime)
  // }, [])

  const handleTimeClick = (time) => {
    if (selectedTime.includes(time)) {
      setSelectedTime(selectedTime.filter(t => t !== time));
    } else {
      setSelectedTime([...selectedTime, time]);
    }
  };

  const selectAllTimes = (timesToSelect) => {
    const allSelected = timesToSelect.every(time => selectedTime.includes(time));
    if (allSelected) {
      setSelectedTime(selectedTime.filter(time => !timesToSelect.includes(time)));
    } else {
      const newSelectedTimes = [...new Set([...selectedTime, ...timesToSelect])];
      setSelectedTime(newSelectedTimes);
    }
  };

  const selectAllMorning = () => {
    selectAllTimes(morningTimes);
  };

  const selectAllAfternoon = () => {
    selectAllTimes(afternoonTimes);
  };

  const renderTimeButton = (time) => (
    <button 
      key={time} 
      className={`py-2 ${selectedTime.includes(time) ? 'bg-gray-300 text-white' : 'bg-white' } rounded`}
      onClick={() => handleTimeClick(time)}
    >
      {time}
    </button>
  );

  return (
    <div className="mt-4 no-outline">
      <Tab>
        <h3 className="font-bold mb-2">오전</h3>
        <p onClick={selectAllMorning}>전체선택</p>
      </Tab>
      <Btn>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {morningTimes.map(renderTimeButton)}
        </div>
      </Btn>
      <div style={{height: '5px'}}></div>
      <Tab>
        <h3 className="font-bold mb-2">오후</h3>
        <p onClick={selectAllAfternoon}>전체선택</p>
      </Tab>
      <Btn>
        <div className="grid grid-cols-3 gap-2">
          {afternoonTimes.map(renderTimeButton)}
        </div>
      </Btn>
    </div>
  );
};

export default CounselorTimeSlots;
