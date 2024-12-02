import React, { useState } from "react";
import styled from "styled-components";

const PreJoinView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f2f2f2;
  font-family: "Jua", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 25px;
  background-color: #3b3a83;
`;

const Box = styled.div`
  width: 33%;
  padding: 50px 0px;
  background-color: white;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  & > p {
    font-size: 30px;
  }

  @media (max-width: 360px) {
    & {
      width: 360px; 
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    & > div {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
`;

const Title = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

const Btns = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  gap: 10px;
`

const Button = styled.button`
  width: 95%;
  margin: 10px;
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
  
  /* 기본 배경색은 white, 특정 상태에 따라 red로 변경 */
  background-color: ${(props) => (props.isOn ? "#FFA79D" : "white")};
  color: ${(props) => (props.isOn ? "white" : "black")};

  &:hover {
    background-color: #FFA79D;
    color: white;
  }

  @media (max-width: 360px) {
    & {
      width: 80%; 
    }
  }
`;

const PreJoinComponent = ({ onJoin }) => {
  const [micStatus, setMicStatus] = useState(true);
  const [cameraStatus, setCameraStatus] = useState(true);

  const handleJoin = () => {
    onJoin({ micStatus, cameraStatus });
  };

  return (
    <PreJoinView>
      <Box>
        <Title>
        <img alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICA8cGF0aCBkPSJNIDEwLjQ5MDIzNCAyIEMgMTAuMDExMjM0IDIgOS42MDE3NjU2IDIuMzM4NTkzOCA5LjUwOTc2NTYgMi44MDg1OTM4IEwgOS4xNzU3ODEyIDQuNTIzNDM3NSBDIDguMzU1MDIyNCA0LjgzMzgwMTIgNy41OTYxMDQyIDUuMjY3NDA0MSA2LjkyOTY4NzUgNS44MTQ0NTMxIEwgNS4yODUxNTYyIDUuMjQ4MDQ2OSBDIDQuODMyMTU2MyA1LjA5MjA0NjkgNC4zMzM3NSA1LjI3OTM1OTQgNC4wOTM3NSA1LjY5MzM1OTQgTCAyLjU4NTkzNzUgOC4zMDY2NDA2IEMgMi4zNDY5Mzc1IDguNzIxNjQwNiAyLjQzMzkyMTkgOS4yNDg1IDIuNzk0OTIxOSA5LjU2MjUgTCA0LjExMzI4MTIgMTAuNzA4OTg0IEMgNC4wNDQ3MTgxIDExLjEzMDMzNyA0IDExLjU1OTI4NCA0IDEyIEMgNCAxMi40NDA3MTYgNC4wNDQ3MTgxIDEyLjg2OTY2MyA0LjExMzI4MTIgMTMuMjkxMDE2IEwgMi43OTQ5MjE5IDE0LjQzNzUgQyAyLjQzMzkyMTkgMTQuNzUxNSAyLjM0NjkzNzUgMTUuMjc4MzU5IDIuNTg1OTM3NSAxNS42OTMzNTkgTCA0LjA5Mzc1IDE4LjMwNjY0MSBDIDQuMzMyNzUgMTguNzIxNjQxIDQuODMyMTU2MiAxOC45MDg5MDYgNS4yODUxNTYyIDE4Ljc1MzkwNiBMIDYuOTI5Njg3NSAxOC4xODc1IEMgNy41OTU4ODQyIDE4LjczNDIwNiA4LjM1NTM5MzQgMTkuMTY2MzM5IDkuMTc1NzgxMiAxOS40NzY1NjIgTCA5LjUwOTc2NTYgMjEuMTkxNDA2IEMgOS42MDE3NjU2IDIxLjY2MTQwNiAxMC4wMTEyMzQgMjIgMTAuNDkwMjM0IDIyIEwgMTMuNTA5NzY2IDIyIEMgMTMuOTg4NzY2IDIyIDE0LjM5ODIzNCAyMS42NjE0MDYgMTQuNDkwMjM0IDIxLjE5MTQwNiBMIDE0LjgyNDIxOSAxOS40NzY1NjIgQyAxNS42NDQ5NzggMTkuMTY2MTk5IDE2LjQwMzg5NiAxOC43MzI1OTYgMTcuMDcwMzEyIDE4LjE4NTU0NyBMIDE4LjcxNDg0NCAxOC43NTE5NTMgQyAxOS4xNjc4NDQgMTguOTA3OTUzIDE5LjY2NjI1IDE4LjcyMTY0MSAxOS45MDYyNSAxOC4zMDY2NDEgTCAyMS40MTQwNjIgMTUuNjkxNDA2IEMgMjEuNjUzMDYzIDE1LjI3NjQwNiAyMS41NjYwNzggMTQuNzUxNSAyMS4yMDUwNzggMTQuNDM3NSBMIDE5Ljg4NjcxOSAxMy4yOTEwMTYgQyAxOS45NTUyODIgMTIuODY5NjYzIDIwIDEyLjQ0MDcxNiAyMCAxMiBDIDIwIDExLjU1OTI4NCAxOS45NTUyODIgMTEuMTMwMzM3IDE5Ljg4NjcxOSAxMC43MDg5ODQgTCAyMS4yMDUwNzggOS41NjI1IEMgMjEuNTY2MDc4IDkuMjQ4NSAyMS42NTMwNjMgOC43MjE2NDA2IDIxLjQxNDA2MiA4LjMwNjY0MDYgTCAxOS45MDYyNSA1LjY5MzM1OTQgQyAxOS42NjcyNSA1LjI3ODM1OTQgMTkuMTY3ODQ0IDUuMDkxMDkzNyAxOC43MTQ4NDQgNS4yNDYwOTM4IEwgMTcuMDcwMzEyIDUuODEyNSBDIDE2LjQwNDExNiA1LjI2NTc5MzcgMTUuNjQ0NjA3IDQuODMzNjYwOSAxNC44MjQyMTkgNC41MjM0Mzc1IEwgMTQuNDkwMjM0IDIuODA4NTkzOCBDIDE0LjM5ODIzNCAyLjMzODU5MzcgMTMuOTg4NzY2IDIgMTMuNTA5NzY2IDIgTCAxMC40OTAyMzQgMiB6IE0gMTIgOCBDIDE0LjIwOSA4IDE2IDkuNzkxIDE2IDEyIEMgMTYgMTQuMjA5IDE0LjIwOSAxNiAxMiAxNiBDIDkuNzkxIDE2IDggMTQuMjA5IDggMTIgQyA4IDkuNzkxIDkuNzkxIDggMTIgOCB6Ij48L3BhdGg+Cjwvc3ZnPg=="/>
        <p>마이크 및 카메라 설정</p>
        <img alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICA8cGF0aCBkPSJNIDEwLjQ5MDIzNCAyIEMgMTAuMDExMjM0IDIgOS42MDE3NjU2IDIuMzM4NTkzOCA5LjUwOTc2NTYgMi44MDg1OTM4IEwgOS4xNzU3ODEyIDQuNTIzNDM3NSBDIDguMzU1MDIyNCA0LjgzMzgwMTIgNy41OTYxMDQyIDUuMjY3NDA0MSA2LjkyOTY4NzUgNS44MTQ0NTMxIEwgNS4yODUxNTYyIDUuMjQ4MDQ2OSBDIDQuODMyMTU2MyA1LjA5MjA0NjkgNC4zMzM3NSA1LjI3OTM1OTQgNC4wOTM3NSA1LjY5MzM1OTQgTCAyLjU4NTkzNzUgOC4zMDY2NDA2IEMgMi4zNDY5Mzc1IDguNzIxNjQwNiAyLjQzMzkyMTkgOS4yNDg1IDIuNzk0OTIxOSA5LjU2MjUgTCA0LjExMzI4MTIgMTAuNzA4OTg0IEMgNC4wNDQ3MTgxIDExLjEzMDMzNyA0IDExLjU1OTI4NCA0IDEyIEMgNCAxMi40NDA3MTYgNC4wNDQ3MTgxIDEyLjg2OTY2MyA0LjExMzI4MTIgMTMuMjkxMDE2IEwgMi43OTQ5MjE5IDE0LjQzNzUgQyAyLjQzMzkyMTkgMTQuNzUxNSAyLjM0NjkzNzUgMTUuMjc4MzU5IDIuNTg1OTM3NSAxNS42OTMzNTkgTCA0LjA5Mzc1IDE4LjMwNjY0MSBDIDQuMzMyNzUgMTguNzIxNjQxIDQuODMyMTU2MiAxOC45MDg5MDYgNS4yODUxNTYyIDE4Ljc1MzkwNiBMIDYuOTI5Njg3NSAxOC4xODc1IEMgNy41OTU4ODQyIDE4LjczNDIwNiA4LjM1NTM5MzQgMTkuMTY2MzM5IDkuMTc1NzgxMiAxOS40NzY1NjIgTCA5LjUwOTc2NTYgMjEuMTkxNDA2IEMgOS42MDE3NjU2IDIxLjY2MTQwNiAxMC4wMTEyMzQgMjIgMTAuNDkwMjM0IDIyIEwgMTMuNTA5NzY2IDIyIEMgMTMuOTg4NzY2IDIyIDE0LjM5ODIzNCAyMS42NjE0MDYgMTQuNDkwMjM0IDIxLjE5MTQwNiBMIDE0LjgyNDIxOSAxOS40NzY1NjIgQyAxNS42NDQ5NzggMTkuMTY2MTk5IDE2LjQwMzg5NiAxOC43MzI1OTYgMTcuMDcwMzEyIDE4LjE4NTU0NyBMIDE4LjcxNDg0NCAxOC43NTE5NTMgQyAxOS4xNjc4NDQgMTguOTA3OTUzIDE5LjY2NjI1IDE4LjcyMTY0MSAxOS45MDYyNSAxOC4zMDY2NDEgTCAyMS40MTQwNjIgMTUuNjkxNDA2IEMgMjEuNjUzMDYzIDE1LjI3NjQwNiAyMS41NjYwNzggMTQuNzUxNSAyMS4yMDUwNzggMTQuNDM3NSBMIDE5Ljg4NjcxOSAxMy4yOTEwMTYgQyAxOS45NTUyODIgMTIuODY5NjYzIDIwIDEyLjQ0MDcxNiAyMCAxMiBDIDIwIDExLjU1OTI4NCAxOS45NTUyODIgMTEuMTMwMzM3IDE5Ljg4NjcxOSAxMC43MDg5ODQgTCAyMS4yMDUwNzggOS41NjI1IEMgMjEuNTY2MDc4IDkuMjQ4NSAyMS42NTMwNjMgOC43MjE2NDA2IDIxLjQxNDA2MiA4LjMwNjY0MDYgTCAxOS45MDYyNSA1LjY5MzM1OTQgQyAxOS42NjcyNSA1LjI3ODM1OTQgMTkuMTY3ODQ0IDUuMDkxMDkzNyAxOC43MTQ4NDQgNS4yNDYwOTM4IEwgMTcuMDcwMzEyIDUuODEyNSBDIDE2LjQwNDExNiA1LjI2NTc5MzcgMTUuNjQ0NjA3IDQuODMzNjYwOSAxNC44MjQyMTkgNC41MjM0Mzc1IEwgMTQuNDkwMjM0IDIuODA4NTkzOCBDIDE0LjM5ODIzNCAyLjMzODU5MzcgMTMuOTg4NzY2IDIgMTMuNTA5NzY2IDIgTCAxMC40OTAyMzQgMiB6IE0gMTIgOCBDIDE0LjIwOSA4IDE2IDkuNzkxIDE2IDEyIEMgMTYgMTQuMjA5IDE0LjIwOSAxNiAxMiAxNiBDIDkuNzkxIDE2IDggMTQuMjA5IDggMTIgQyA4IDkuNzkxIDkuNzkxIDggMTIgOCB6Ij48L3BhdGg+Cjwvc3ZnPg=="/>
        </Title>
        <Btns>
          <Button
            isOn={!micStatus}
            onClick={() => setMicStatus(!micStatus)}
          >
            {micStatus ? "마이크 끄기" : "마이크 켜기"}
          </Button>
          <Button
            isOn={!cameraStatus}
            onClick={() => setCameraStatus(!cameraStatus)}
          >
            {cameraStatus ? "카메라 끄기" : "카메라 켜기"}
          </Button>
          <Button onClick={handleJoin}>상담 입장하기</Button>
        </Btns>
      </Box>
    </PreJoinView>
  );
};

export default PreJoinComponent;
