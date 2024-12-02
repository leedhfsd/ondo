import { useState, useEffect } from 'react';
import styled from "styled-components"
import axios from "axios";
import Reservation from '../checkReservation/reservation';

const ReservationList = styled.div`
  // align-item: center;
  padding-leff: 10px;
  height: 90%;
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

`;



const baseUrl = import.meta.env.VITE_BASE_URL;

// 상담내역(DayListComponent.jsx) 하단 
const DayListReservationList = ({selectedDate}) => {
  const [reservationList, setReservationList] = useState([]);
  const [ loading, setLoading ] = useState(true)
  
  console.log('선택된 날짜가 넘어오긴 하는지', selectedDate)
  useEffect(()=>{
    getReservationList(selectedDate)
    setReservationList([])
  }, [selectedDate])
  // const date = selectedDate

  const getReservationList = async () => {
    console.log(1)
    try {
      const response = await axios.get(
        `${baseUrl}/counselor/reservation/${selectedDate}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 쿠키를 포함하여 요청
        }
      );
      console.log(2)
      if (response.status === 200){
        console.log('날짜별 일정 조회 성공')
        console.log('응답 데이터:', response.data)
        console.log('예약 내역', response.data.data.reservations)
      }
      setReservationList(response.data.data.reservations);
      setLoading(false)
    } catch (err) {
      console.log(3)
      console.error("에러 발생:", err);
    }
  };

  // useEffect(() => {
  //   getReservationList()
  // }, [loading])

  return(
    <ReservationList>
    {reservationList.length > 0 ? (
      reservationList.map((reservation, index) => (
        <Reservation key={index} reservation={reservation} />
      ))
    ) : (
        <div style={{textAlign: 'center'}}>예약된 상담 일정이 없습니다.</div>

    )}
  </ReservationList>
  )
}

export default DayListReservationList;