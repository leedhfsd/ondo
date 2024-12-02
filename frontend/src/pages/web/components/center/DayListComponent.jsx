import { useState } from 'react';
import styled from "styled-components";
import DetailSchedulComponent from "./DetailSchedulComponent";
import DayListCalendar from "./DayListCalendar";
import DayListReservationList from './DayListReservationList';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const View = styled.div`
  margin: 0 auto;
  padding-top: 10px;
  width: 95%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // gap: 20px;
`;

const Tab = styled.div`
  color: #121481;
  font-weight: 600;
  // font-size: 36px;
  display: flex;
  gap: 10px;
  margin: 0 auto;
  font-size: 25px;
  padding: 15px 0px;
  & > p:active{
    color: #F7867A;
  }
`

const Calen = styled.div`
  // border: 1px black solid;
  // padding: 10px;
  // border-radius: 20px;
`;
const Content = styled.div`
  // display: flex;
  padding: 0px 45px;
  // width: 100%;
  // margin: 0 auto;
`



// const Save = styled.div`
//   display: inline-block;
//   & > button {
//     float: right;
//     width: 120px;
//     color: white;
//     background-color: #121481;
//     border-radius: 30px;
//   }
// `;

const DayList = () => {

  
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, '0');
  const day = String(todayDate.getDate()).padStart(2, '0');

  const customTodayDate = `${year}${month}${day}`;

  console.log(customTodayDate); // 20240809

  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜만 저장(ex: 2024-08-07이면 selectedDate === 7)
  const [selectedDate2, setSelectedDate2] = useState(customTodayDate); // 선택된 날짜의 YYYYMMDD
  // const [selectedTime, setSelectedTime] = useState([]);
  const [ loading, setLoading ] = useState(true)

  return(
    <View>
      <Tab>상담 내역</Tab>
      <Content>
        <Calen>
          <DayListCalendar
                selectedDate={selectedDate} 
                setSelectedDate={setSelectedDate} 
                setSelectedDate2={setSelectedDate2} 
                // setSelectedTime={setSelectedTime} 
              />
        </Calen>
        <br />
          <DayListReservationList selectedDate={selectedDate2} />
      </Content>
    </View>
  )
}

export default DayList;