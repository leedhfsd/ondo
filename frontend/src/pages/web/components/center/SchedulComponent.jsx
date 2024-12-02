import styled from "styled-components";
import { useState } from "react";
import TimeTableComponent from "./TimeTableComponent";
import DetailSchedulComponent from "./DetailSchedulComponent";

const View = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  // padding: 0px 0px;
  width: 100%;
`
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

const Content = styled.div`
  display: flex;
  padding: 0px 45px;
  // width: 100%;
  // margin: 0 auto;
`

const Schedul = () => {
  const [ timetable, TimetableState ] = useState(true)
  // const [ activecolor, ActiveColorState ] = useState('black')
  const toggle = (e) => {
    console.log(e.target)
    const check = e.target.id
    { check ==='timetable' ?
      TimetableState(true)      :
      TimetableState(false)
    }
    // { check ==='timetable' ?
    //   ActiveColorState('blue'):
    //   ActiveColorState('black')

    //   // TimetableState(false)
    // }
     
  }
  return(
    <View>
      <Tab>
        <p onClick={toggle} id="timetable" style={{cursor: "pointer"}}>요일별 일정</p>
        <span>|</span> 
        <p onClick={toggle} id="detail" style={{cursor: "pointer"}}>상세 일정</p>
      </Tab>
      
      <Content>
        { timetable ? 
        <TimeTableComponent />
        : 
        <DetailSchedulComponent />
        }
      </Content>
    </View>
  )
}

export default Schedul;