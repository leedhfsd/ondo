import {styled, keyframes} from "styled-components";
import { useState, useEffect } from "react";
import CounselorCalendar from "./CounselorCalendar";
import CounselorTimeSlots from "./CounselorTimeSlots";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const View = styled.div`
  margin: 0 auto;
  width: 95%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Calen = styled.div`
  // border: 1px black solid;
  // padding: 10px;
  // border-radius: 20px;
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
  padding-bottom: 20px; 
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

const TimeSlots = styled.div`
  width:  90%;
  margin: 0 auto;
  // padding: 5px 0px;
`;

const DetailSchedulComponent = () => {
  // const todayDate = new Date();
  // const customTodayDate = todayDate.toISOString().split('T')[0];
  const todayDate = new Date();
  const customTodayDate = todayDate.toLocaleDateString('en-CA'); // 'en-CA'는 'YYYY-MM-DD' 형식을 제공
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(customTodayDate);
  const [selectedTime, setSelectedTime] = useState([]);
  const [saveTime, setSaveTimeState] = useState([]);
  const [readyToRender, setReadyToRender] = useState(false);

  useEffect(() => {
    if (saveTime && saveTime.length > 0) {
      setSelectedTime(saveTime);
      setReadyToRender(true);
    } else {
      setSelectedTime([]);
      setReadyToRender(true);
    }
  }, [saveTime]);
  

  useEffect(() => {
    console.log('selectedDate 채워졌는지 확인용(부모):', selectedTime);
  }, [selectedTime]);


  // 날짜별 일정 수정(저장): Asia/Seoul 시간으로 선택 후 저장하는 과정에서는 UTC시간으로 바꿔 저장함
  const handleSaveClick = async () => {
    console.log(selectedDate2);
    console.log(selectedTime);

    const scheduleList = [];
    // const selectedTime = ["09:00", "10:00"]
    // selectedTime.forEach((time) => {
    //   // Combine selectedDate2 and time into a Date object and convert to UTC
    //   const [hours, minutes] = time.split(':');
    //   const localDateTime = new Date(selectedDate2);
    //   localDateTime.setHours(hours);
    //   localDateTime.setMinutes(minutes);
    //   console.log('localDateTime 확인용', localDateTime)
    //   scheduleList.push(localDateTime.toISOString().replace('.000Z', '')); // Remove milliseconds and Z
    //   console.log('UTC로 변환된 후의 리스트인가?', scheduleList)
    // });

    // const date = selectedDate2.replace(/-/g, '');
    // console.log('date 확인용', date);
    // console.log(scheduleList)
    
    selectedTime.forEach((time) => {
      // Combine selectedDate2 and time into a Date object
      const [hours, minutes] = time.split(':');
      const localDateTime = new Date(selectedDate2);
      localDateTime.setHours(hours);
      localDateTime.setMinutes(minutes);
    
      // Format the date-time in YYYY-MM-DDTHH:mm:ss without UTC conversion
      const formattedDateTime = localDateTime.getFullYear() +
        '-' + String(localDateTime.getMonth() + 1).padStart(2, '0') +
        '-' + String(localDateTime.getDate()).padStart(2, '0') +
        'T' + String(localDateTime.getHours()).padStart(2, '0') +
        ':' + String(localDateTime.getMinutes()).padStart(2, '0') +
        ':00';
    
      scheduleList.push(formattedDateTime);
    });
    const date = selectedDate2.replace(/-/g, '');
    
    console.log(scheduleList);

    try {
      const response = await axios.post(`${baseUrl}/counselor/schedule/${date}`,
        { schedule: scheduleList }, 
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true, // 쿠키를 포함하여 요청
        }
      );
      if (response.status === 200) {
        console.log('일정 등록 성공');
        console.log('서버 응답:', response.data); // DB에는 UTC 시간 기준으로 저장되며, 답변 또한 UTC 시간으로 보여짐
      }
    } catch (err) {
      console.error('에러 발생:', err);
    }
  };

  return (
    <View>
      {/* <Option> */}
        <Calen>
          <CounselorCalendar 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate} 
            setSelectedDate2={setSelectedDate2} 
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime} 
            setSaveTimeState={setSaveTimeState}
          />
        </Calen>
        <TimeSlots>
        {readyToRender ? (
          <CounselorTimeSlots 
            selectedDate={selectedDate} 
            selectedTime={selectedTime} 
            setSelectedTime={setSelectedTime}
            saveTime={saveTime} 
          />
        ) : (
          <div>Loading...</div> // 데이터가 로딩 중일 때 표시될 로딩 메시지
        )}
        </TimeSlots>
      {/* </Option> */}
      <Save>
        <button onClick={handleSaveClick}>저장</button>
      </Save>
    </View>
  );
};

export default DetailSchedulComponent;
