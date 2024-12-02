import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Route, Router } from "react-router-dom";

// import DetailSchedulComponent from "./components/center/DetailSchedulComponent";

const View = styled.div`
  align-items: center;
  // margin: 0 auto;
  margin-top: 50px;
  // padding: 10px 50px;
  margin-left: 5%;
  width: 95%;
  border-radius: 20px;
  height: 90%;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  overflow-y:scroll;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track { 
      background-color: rgba(231, 231, 231, 0);
  }
  &::-webkit-scrollbar-thumb { 
      border-radius: 30px;
      background-color: #c2c2c2;
  }
  &::-webkit-scrollbar-button {
      display: none;
  }
`;

const Centerpage = () => {
  return(
    <>
      <View>
        <Outlet/>
      </View>
    </>
  )
}

export default Centerpage;