import { styled, keyframes } from "styled-components";
import { useEffect, useRef, useState } from "react";
import background from "../../../../assets/images/ourstory/forest.jpg";
import Character from "../../../../assets/images/ourstory/down_character.png";
import Snow from "./snow";

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const zoomIn = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.7);
  }
`;

const View = styled.div`
  height: 100%;
  width: 100%;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  position: relative;
  &.zoom-in {
    animation: ${zoomIn} 2s forwards;
  }
`;

const Black = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  animation: ${fadeOut} 2s ease-in-out forwards;
`;

const CharacterBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const CharacterImg = styled.img`
  position: absolute;
  top: 55%;
  width: 100px;
  height: 70px;
`;

const Btn = styled.div`
  font-size: 25px;
  font-weight: 900;
  position: fixed;
  width: fit-content;
  bottom: 0;
  padding-bottom: 50px;
  background-color: rgba(0, 0, 0, 0);
  height: fit-content;
  pointer-events: all;
  z-index: 200;
  &:focus,
  &:hover {
    outline: none;
    border: none;
  }
`;

const Text = styled.pre`
  position: fixed;
  margin-top: 20px;
  width: 90%;
  max-width: 360px;
  width: 90%;
  min-height: 10%;
  padding: 20px 30px;
  background-color: #0000008d;
  color: white;
  z-index: 10;
  &.zoom-in {
    animation: ${fadeIn} 2s forwards;
  }
`;

export default function Forest({ clickCount, handleClick }) {
  const [isZoomIn, setIsZoomIn] = useState(false);
  const viewRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (isZoomIn) {
      viewRef.current.classList.add("zoom-in");
      textRef.current.classList.add("zoom-in");
    }
  }, [isZoomIn]);

  return (
    <>
      {isZoomIn && (
        <Text ref={textRef}>
          뭐야... 다람쥐잖아?{"\n"}왜 이런 곳에 있는거지?{"\n"}
          일단 집으로 데려가야겠다...
        </Text>
      )}
      <View ref={viewRef}>
        <CharacterBox>
          <CharacterImg src={Character} />
        </CharacterBox>
        <Black />
        <Snow />
      </View>
      <Btn
        onClick={() => {
          setIsZoomIn(true);
          handleClick();
        }}
      >
        Click!
      </Btn>
    </>
  );
}
