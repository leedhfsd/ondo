import "./Homepage.css";
import Thermometer from "../../../components/app/Thermometer";
import Balloon from "../../../components/app/Balloon";
import tail from "../../../assets/images/characterMove/tail.png";
import acorn from "../../../assets/images/characterMove/acorn.png";
import defaultEmogi from "../../../assets/images/characterMove/1.png";
import smileEmogi from "../../../assets/images/characterMove/2.png";
import surprisedEmogi from "../../../assets/images/characterMove/3.png";
import chat from "./../../../assets/images/chat.png";
import back_img from "./../../../assets/images/home_back2.jpg";

import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import styled, { keyframes, css } from "styled-components";

const moveUpDown = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(-10deg);
  }
`;

const heartAnimation1 = keyframes`
  0% {
    transform: scale(0.5) translateY(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) translateY(-40px);
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(-60px);
    opacity: 0;
  }
`;

const heartAnimation2 = keyframes`
  0% {
    transform: scale(0.5) translateY(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) translateY(-30px) rotate(15deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(-40px) rotate(-15deg);
    opacity: 0;
  }
`;

const Heart1 = styled.div`
  & > svg {
    color: #ff0000;
  }
  position: absolute;
  top: -30px;
  left: 20%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  z-index: 3;
  animation: ${heartAnimation1} 1s ease-out forwards;
`;

const Heart2 = styled.div`
  & > svg {
    color: #ff1900;
  }
  position: absolute;
  top: -20px;
  left: 30%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  z-index: 3;
  animation: ${heartAnimation2} 1.2s ease-out forwards;
`;
const Heart3 = styled.div`
  & > svg {
    color: orange;
  }
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  z-index: 3;
  animation: ${heartAnimation1} 1.2s ease-out forwards;
`;
const Heart4 = styled.div`
  & > svg {
    color: #ff237b;
  }
  position: absolute;
  top: -10px;
  left: 60%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  z-index: 3;
  animation: ${heartAnimation2} 1.2s ease-out forwards;
`;
const CharacterBody = styled.div`
  img:nth-child(1) {
    position: relative;
    height: 180px;
    z-index: 2;
  }

  img:nth-child(2) {
    bottom: 0;
    z-index: 1;
    position: absolute;
    height: 170px;

    ${({ move }) =>
      move === 1 &&
      css`
        animation: ${moveUpDown} 1s linear 3;
      `}
  }
`;

const Acorn = styled.div`
  position: absolute;
`;

const CharacterBox = styled.div``;

const Homepage = () => {
  const renderCount = useRef(0);
  const [character, setCharacter] = useState({});
  const [characterState, setCharacterState] = useState({
    text: "안녕",
    img: defaultEmogi,
  });
  const [previousNum, setPreviousNum] = useState(null);
  const [showHeart, setShowHeart] = useState(false);

  const CharacterStateList = [
    { text: "안녕", imgNum: 1, move: 0 },
    { text: "행복한 하루 보내길 바라!", imgNum: 2, move: 1 },
    {
      text: "나를 위해 도토리를 모아줘서 고마워 ~ 너 덕분에 따뜻해",
      imgNum: 3,
      move: 1,
    },
    {
      text: "오늘 하루는 어때? 난 너가 날 보러와줘서 너무 좋아",
      imgNum: 2,
      move: 1,
    },
  ];

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
  });

  const getCharacter = async () => {
    const characterResponse = await api.get("/character/getCharacter");
    console.log(characterResponse);
    setCharacter(characterResponse.data.data.character);
    console.log(characterResponse.data.data.character);
  };

  useEffect(() => {
    getCharacter();
  }, []);

  useEffect(() => {
    renderCount.current += 1;
  });

  const nav = useNavigate();

  const onClickChat = () => {
    return nav("/member/chat");
  };

  const changeCharacterStatus = () => {
    let num;
    do {
      num = Math.floor(Math.random() * CharacterStateList.length);
    } while (num === previousNum);

    let img = null;
    if (CharacterStateList[num].imgNum === 1) {
      img = defaultEmogi;
    } else if (CharacterStateList[num].imgNum === 2) {
      img = smileEmogi;
    } else {
      img = surprisedEmogi;
    }

    setCharacterState({
      text: CharacterStateList[num].text,
      img: img,
      move: CharacterStateList[num].move,
    });
    setPreviousNum(num);
  };

  const handleMouseEnter = () => {
    setShowHeart(true);
    // console.log("이벤트 발생");
    setTimeout(() => setShowHeart(false), 1000);
  };

  return (
    <div className="homepage">
      <div className="home-content">
        <div className="charaInfo">
          <p id="char-name">{character.name}</p>
          <p id="char-level">Lv.{character.level}</p>
        </div>
        <div id="thermometer">
          <Thermometer character={character} />
        </div>
        <div className="Char-ballon">
          <Balloon text={characterState.text} />
        </div>
        <div onClick={changeCharacterStatus} className="Char-daram">
          <CharacterBox onMouseEnter={handleMouseEnter}>
            {showHeart && (
              <div>
                <Heart1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                </Heart1>
                <Heart2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                </Heart2>
                <Heart3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                </Heart3>
                <Heart4>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                </Heart4>
              </div>
            )}
            <Acorn>
              <img src={acorn} />
            </Acorn>
            <CharacterBody move={characterState.move}>
              <img src={characterState.img} alt="" />
              <img src={tail} />
            </CharacterBody>
          </CharacterBox>
        </div>
        <div className="chatBtn">
          <img onClick={onClickChat} src={chat} style={{ cursor: "pointer" }} />
        </div>
      </div>
      <img id="back-img" src={back_img} />
    </div>
  );
};

export default Homepage;
