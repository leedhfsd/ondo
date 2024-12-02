import { styled, keyframes } from "styled-components";
import { useEffect, useRef, useState } from "react";
import background from "../../../../assets/images/ourstory/back1.png";
import characterInBox1 from "../../../../assets/images/ourstory/inbox1.png";
import characterInBox2 from "../../../../assets/images/ourstory/inbox2.png";
import useAuthStore from "../../../../store/app/authStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snow from "./snow";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const View = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  position: absolute;
  z-index: 20;
  opacity: 0;
  animation: ${fadeIn} 2s forwards;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: white;
  font-size: 20px;
`;

const Layout = styled.div`
  width: 100%;
  height: 100%;

  & > .first-layout {
    position: absolute;
    z-index: 30;
    width: 100%;
    height: 100%;
  }

  & > .second-layout {
    position: relative;
    background-color: none;
    z-index: 40;
    width: 100%;
    height: 100%;
  }
`;

const ImgBox = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 40;

  & > img {
    width: 100%;
    height: 100%;
  }

  & .ani {
    animation: ${fadeIn} 2.5s forwards;
  }
`;

const TextBox = styled.div`
  width: 100%;
  min-height: 15%;
  display: flex;
  justify-content: center;
  position: relative;
  animation: ${fadeIn} 2s forwards;
`;

const Text = styled.pre`
  /* font-size: 2px; */
  display: flex;
  margin-top: 20px;
  max-width: 360px;
  width: 90%;
  padding: 20px 30px;
  background-color: #000000a6;
  color: white;
  z-index: 30;
  /* animation: ${fadeIn} 2s forwards; */
`;

const Name = styled.div`
  margin-right: 10px;
`;

const SettingName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #000000af;
  z-index: 30;
  color: white;
  pointer-events: all;

  input {
    padding: 10px 20px;
    border-radius: 10px;
    color: black;
    margin: 10px 0px;
    text-align: center;
  }

  input:focus {
    outline: none;
  }
`;

const Btn = styled.div`
  font-size: 25px;
  font-weight: 900;
  position: fixed;
  width: fit-content;
  bottom: 0;
  color: black;
  padding-bottom: 50px;
  background-color: rgba(0, 0, 0, 0);
  height: fit-content;
  pointer-events: all;
  z-index: 200;
  cursor: pointer;

  &:focus,
  &:hover {
    outline: none;
    border: none;
  }
`;

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Box({ clickCount, handleClick }) {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));

  const [characterName, setCharacterName] = useState("");
  const navigate = useNavigate();
  const textRef = useRef(null);

  const saveCharacterName = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/character/changeName`,
        { name: characterName },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("이름이 성공적으로 저장되었습니다.");
      } else {
        console.log("이름 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("이름 저장 중 오류가 발생했습니다.", error);
    }
  };

  useEffect(() => {
    if (clickCount === 15) {
      navigate("/member/home");
    }
  }, [clickCount]);

  const renderContent = () => {
    switch (clickCount) {
      case 4:
        return (
          <>
            <TextBox key={clickCount}>
              <Text ref={textRef}>
                <Name>???:</Name>
                <pre>
                  여기가 어디야? {"\n"}
                  너는 누구니?
                </pre>
              </Text>
            </TextBox>
            <ImgBox>
              <img className="ani" src={characterInBox1} alt="Character" />
            </ImgBox>
          </>
        );
      case 5:
        return (
          <>
            <TextBox key={clickCount}>
              <Text ref={textRef}>
                <Name>나:</Name>
                <pre>
                  나는 {user.name}이야 {"\n"}
                  그나저나 어쩌다 이 추운 숲속에 {"\n"}
                  쓰러져 있던거야?
                </pre>
              </Text>
            </TextBox>
            <ImgBox>
              <img src={characterInBox1} alt="Character" />
            </ImgBox>
          </>
        );
      case 6:
        return (
          <>
            <TextBox key={clickCount}>
              <Text ref={textRef}>
                <Name>???:</Name>
                <pre>
                  도토리를 구하려 {"\n"}
                  산속에 들어왔는데 {"\n"}
                  갑자기 너무 많은 눈이 {"\n"}
                  내렸던 것 밖에 {"\n"}
                  기억이 나지 않아...{"\n"}
                </pre>
              </Text>
            </TextBox>
            <ImgBox>
              <img src={characterInBox1} alt="Character" />
            </ImgBox>
          </>
        );
      case 7:
        return (
          <>
            <TextBox key={clickCount}>
              <Text ref={textRef}>
                <Name>???:</Name>
                <pre>
                  혹시 괜찮다면 {"\n"}나 대신 도토리를 모아{"\n"}
                  추위에서 벗어날 수 있게 {"\n"}
                  해줄 수 있을까?{"\n"}
                </pre>
              </Text>
            </TextBox>
            <ImgBox>
              <img src={characterInBox1} alt="Character" />
            </ImgBox>
          </>
        );
      case 8:
        return (
          <>
            <TextBox key={clickCount}>
              <Text ref={textRef}>
                <Name>나:</Name>
                <pre>좋아, 내가 도와줄게 {"\n"}</pre>
              </Text>
            </TextBox>
            <ImgBox>
              <img src={characterInBox1} alt="Character" />
            </ImgBox>
          </>
        );
      case 9:
        return (
          <>
            <TextBox key={clickCount}>
              <Text ref={textRef}>
                <Name>???:</Name>
                <pre>
                  고마워.{"\n"}
                  혹시 마지막 부탁이 있는데 {"\n"}
                  들어주실 수 있니?{"\n"}
                </pre>
              </Text>
            </TextBox>
            <ImgBox>
              <img src={characterInBox1} alt="Character" />
            </ImgBox>
          </>
        );
      case 10:
        return (
          <>
            <TextBox key={clickCount}>
              <Text ref={textRef}>
                <Name>나:</Name>
                <pre>어떤건데? {"\n"}</pre>
              </Text>
            </TextBox>
            <ImgBox>
              <img src={characterInBox1} alt="Character" />
            </ImgBox>
          </>
        );
      case 11:
        return (
          <>
            <TextBox key={clickCount}>
              <Text ref={textRef}>
                <Name>???:</Name>
                <pre>
                  이름을 지어줄 수 있어?{"\n"}내 이름이 잘 기억나지않아...
                  {"\n"}
                </pre>
              </Text>
            </TextBox>
            <ImgBox>
              <img src={characterInBox1} alt="Character" />
            </ImgBox>
          </>
        );
      case 12:
        return (
          <>
            <TextBox key={clickCount}>
              <Text ref={textRef}>
                <Name>나:</Name>
                <pre>알겠어 내가 지어줄게!</pre>
              </Text>
            </TextBox>
            <ImgBox>
              <img src={characterInBox1} alt="Character" />
            </ImgBox>
          </>
        );
      case 13:
        return (
          <SettingName>
            <p>캐릭터의 이름을 입력해주세요</p>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
            />
            <div
              onClick={() => {
                handleClick();
                saveCharacterName();
              }}
            >
              저장
            </div>
          </SettingName>
        );
      case 14:
        return (
          <>
            <TextBox key={clickCount}>
              <Text ref={textRef}>
                <Name>{characterName}:</Name>
                <pre>
                  {characterName}? 너무 마음에 들어!{"\n"}
                  그럼 앞으로 잘부탁해 {":)!"}
                </pre>
              </Text>
            </TextBox>
            <ImgBox>
              <img src={characterInBox1} alt="Character" />
            </ImgBox>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Layout>
        <div className="first-layout">
          <Snow />
        </div>
        <div className="second-layout">{renderContent()}</div>
      </Layout>
      <View />
      {clickCount !== 13 && <Btn onClick={handleClick}>Click!</Btn>}
    </>
  );
}
