import { styled, keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    z-index: -10;
  }
`;

const waveAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
`;

const BlackBackGround = styled.div.attrs((props) => ({
  fadeOutTrigger: props.fadeOutTrigger,
}))`
  width: 100%;
  height: 100%;
  background-color: black;
  position: absolute;
  z-index: 20;
  opacity: 0;
  animation: ${({ fadeOutTrigger }) => (fadeOutTrigger ? fadeOut : fadeIn)} 2s
    forwards;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px;
`;

const WaveText = styled.span`
  display: inline-block;
  animation: ${waveAnimation} 1.5s infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

const Btn = styled.div`
  font-size: 25px;
  font-weight: 900;
  position: fixed;
  width: fit-content;
  bottom: 0;
  color: white;
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

const Text = styled.div`
  font-size: 25px;
  animation: ${fadeIn} 2s forwards;
`;

export default function BlackView({ clickCount, handleClick }) {
  const renderWaveText = (text) => {
    return text.split("").map((char, index) => (
      <WaveText key={index} delay={index * 0.1}>
        {char}
      </WaveText>
    ));
  };

  return (
    <>
      <BlackBackGround>
        {clickCount === 2 && <Text>{renderWaveText("이동중 ...")}</Text>}
        {clickCount === 3 && <Text>저기...?</Text>}
      </BlackBackGround>
      <Btn
        onClick={() => {
          handleClick();
        }}
      >
        Click!
      </Btn>
    </>
  );
}
