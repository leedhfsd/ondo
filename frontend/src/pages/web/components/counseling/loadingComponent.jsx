import { useEffect, useRef } from "react";
import styled from "styled-components";

const View = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #3b3a83;
  font-family: "Jua", sans-serif;
  font-weight: 400;
  font-style: normal;

  div {
    min-width: 500px;
    padding: 40px 60px;
    border-radius: 10px;

    h1 {
      z-index: 1;
      line-height: normal;
      font-size: 8em;
      color: white;
      position: relative;
      margin: 0px;
      display: flex;
      justify-content: center;

      span {
        display: inline-block;
        animation: wave 1s infinite;
      }

      span:nth-of-type(1) {
        animation-delay: 0s;
      }
      span:nth-of-type(2) {
        animation-delay: 0.1s;
      }
      span:nth-of-type(3) {
        animation-delay: 0.2s;
      }
      span:nth-of-type(4) {
        animation-delay: 0.3s;
      }
      span:nth-of-type(5) {
        animation-delay: 0.4s;
      }
      span:nth-of-type(6) {
        animation-delay: 0.5s;
      }
      span:nth-of-type(7) {
        animation-delay: 0.6s;
      }
      span:nth-of-type(8) {
        animation-delay: 0.7s;
      }
      span:nth-of-type(9) {
        animation-delay: 0.8s;
      }
      span:nth-of-type(10) {
        animation-delay: 0.9s;
      }
    }
  }

  @keyframes wave {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @media (max-width: 360px) {
    & {
      width: 360px; /* 화면 너비가 360px 이하일 때 width 값 */
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    & div {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 80%;
      background: rgba(255, 255, 255, 0.85);
      padding: 40px 60px;
      border-radius: 10px;

      h1 {
        width: fit-content;
        height: fit-content;
        font-size: 30px;
        color: white;
        position: relative;
        margin: 0px;

        span {
          display: inline-block;
          animation: wave 1s infinite;
        }

        span:nth-of-type(1) {
          animation-delay: 0s;
        }
        span:nth-of-type(2) {
          animation-delay: 0.3s;
        }
        span:nth-of-type(3) {
          animation-delay: 0.6s;
        }
        span:nth-of-type(4) {
          animation-delay: 0.9s;
        }
        span:nth-of-type(5) {
          animation-delay: 0.12s;
        }
        span:nth-of-type(6) {
          animation-delay: 0.5s;
        }
        span:nth-of-type(7) {
          animation-delay: 0.6s;
        }
        span:nth-of-type(8) {
          animation-delay: 0.7s;
        }
        span:nth-of-type(9) {
          animation-delay: 0.8s;
        }
        span:nth-of-type(10) {
          animation-delay: 0.9s;
        }
      }
    }
  }
`;

const Ment = styled.div`
  color: #AFB5CE;
  font-size: 19px;
  padding: 0px;
`

const LoadingComponent = () => {
  return (
    <View>
      <div>
        <h1>
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </h1>
        <br />
        <hr />
        <Ment>* 화상 상담 접속을 기다리는 중입니다. *</Ment>
      </div>
    </View>
  );
};

export default LoadingComponent;
