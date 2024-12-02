import { useState, useEffect } from 'react';
import axios from "axios";
import styled from 'styled-components';


const YYYYMM = styled.div`
  color: #121481;
  & > span {
    font-size: 24px;
  }
`

const Btn = styled.div`
  display: flex;
  gap: 13px;
  & > button {
    color: white;
    background-color: #D2D3E0;
  }
`

const baseUrl = import.meta.env.VITE_BASE_URL;

const CounselorCalendar = ({ selectedDate, setSelectedDate, setSelectedDate2, selectedTime, setSelectedTime, setSaveTimeState }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜(초기값은 오늘로)
  const [dayScheduleList, setDayScheduleList] = useState([]);

  useEffect(() => {
    setSelectedDate(currentDate.getDate());
  }, []);

  // 날짜별 일정 조회(불러오기)
  const handleDateClick = async (date) => {
    console.log("날짜 조회 하는 중")
    setSaveTimeState([])
    setSelectedDate(date); // 선택한 날짜 selectDate에 저장
    setSelectedTime([]); // 선택한 날짜에 대한 선택한 시간 리스트 초기화
    const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date); // 선택된 날짜 한국 시간

    const inputdate = fullDate.getFullYear().toString() +
    String(fullDate.getMonth() + 1).padStart(2, '0') +
    String(fullDate.getDate()).padStart(2, '0'); // 선택된 날짜 YYYYMMDD(한국 시간 기준)

    console.log('url 확인용:', inputdate);

    console.log('fullDate 확인용', fullDate)

// fullDate를 YYYY-MM-DD 형식의 문자열로 변환하여 다시 저장
    const formattedDate = fullDate.getFullYear().toString() +
    '-' + String(fullDate.getMonth() + 1).padStart(2, '0') +
    '-' + String(fullDate.getDate()).padStart(2, '0'); // 선택된 날짜 YYYY-MM-DD
    setSelectedDate2(formattedDate)

    try {
      const response = await axios.get(`${baseUrl}/counselor/schedule/${inputdate}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("응답 데이터:", response.data.data.schedule)

      // 시간 부분만 추출하여 리스트에 저장
      const scheduleInLocalTime = response.data.data.schedule.map(dateTime => {
        const localTime = new Date(dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return localTime;
      });

      console.log(scheduleInLocalTime)

      if (response.status === 200) {
        console.log('상세 일정 조회 성공')
        setSaveTimeState(scheduleInLocalTime) // response.data.data.schedule에 있는 시간대의 시간만 뽑아 scheduleInLocalTime에
        // 저장한 후 saveTime state에 저장

        // console.log('selectedDate 채워졌는지 확인용(자식):', selectedTime)
      }

    } catch (err) {
      console.error("에러 발생:", err)
    }
  };

  const handleMonthChange = (increment) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + increment);
      return newDate;
    });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getMonthStart = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  return (
    <>
      <div className="bg-white rounded-lg p-4">
        {/* 캘린더 상단 버튼 및 년/월 */}
        <div className="flex justify-between items-center text-gray-600 mb-2">
          <YYYYMM>
            <span className="text-xl font-semibold">
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </span>
          </YYYYMM>
          <Btn>
            <button 
              onClick={() => handleMonthChange(-1)} 
              className="text-sm p-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
            >
              &lt;
            </button>
            <button 
              onClick={() => handleMonthChange(1)} 
              className="text-sm p-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
            >
              &gt;
            </button>
          </Btn>
        </div>


        <div className="grid grid-cols-7 gap-2 text-center">
          {['일', '월', '화', '수', '목', '금', '토'].map(day => (
            <div key={day} className="text-gray-700 font-semibold">{day}</div>
          ))}
          {Array.from({ length: getMonthStart(currentDate) }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1).map(date => (
            <div 
              key={date} 
              className={`cursor-pointer ${
                date === selectedDate ? 'bg-blue-100 rounded-full' : ''
              } ${
                [0, 6].includes(new Date(currentDate.getFullYear(), currentDate.getMonth(), date).getDay()) ? 'text-red-500' : ''
              }`}
              onClick={() => handleDateClick(date)}
            >
              {date}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CounselorCalendar;
