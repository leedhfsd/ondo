import { useState } from "react";
import styled from "styled-components";
import useAuthStore from "../../../../store/app/authStore";

const View = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const InputMessage = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 10%;
  padding-bottom: 20px;
  padding: 0px 30px;
  form {
    height: 100%;
    & > * {
      height: 60%;
    }
    display: flex;
    input {
      border: 1px solid black;
      flex: 1;
      padding: 10px 0px 10px 20px;
      margin-right: 10px;
    }
    div {
      button {
        background-color: pink;
        border: 1px solid black;
        height: 100%;
        border-radius: 0;
      }
    }
  }
`;

const MessageList = styled.div`
  flex: 1;
  max-height: 90%;
  overflow-y: scroll;
  background-color: white;
  margin: 20px 30px;
  padding: 30px 25px;
  border: 1px solid black;
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${({ isOwnMessage }) =>
    isOwnMessage ? "row-reverse" : "row"};
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-left: ${({ isOwnMessage }) => (isOwnMessage ? "20px" : "0")};
    margin-right: ${({ isOwnMessage }) => (isOwnMessage ? "0" : "20px")};
  }
  & > div {
    font-size: 20px;
    background-color: ${({ isOwnMessage }) =>
      isOwnMessage ? "#e0f7fa" : "#fae6e5"}; // 다른 색상 적용
    padding: 10px 30px;
    border-radius: 30px;
    border-bottom-left-radius: ${({ isOwnMessage }) =>
      isOwnMessage ? "30px" : "0"};
    border-bottom-right-radius: ${({ isOwnMessage }) =>
      isOwnMessage ? "0" : "30px"};
  }
  margin-bottom: 20px;
`;

export default function Chat({ messages, sendMessage }) {
  const [message, setMessage] = useState("");
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));

  return (
    <View>
      <MessageList>
        {messages.map((msg, index) => {
          const isOwnMessage = user.name === msg.from;
          return (
            <Message key={index} isOwnMessage={isOwnMessage}>
              <img src={msg.profileUrl || user.profileUrl} alt="User Profile" />
              <div>{msg.content}</div>
            </Message>
          );
        })}
      </MessageList>
      <InputMessage>
        <form
          className="form-inline"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(message);
            setMessage(""); // 메시지 전송 후 입력 필드를 비웁니다.
          }}
        >
          <input
            type="text"
            id="message"
            placeholder="메세지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div>
            <button id="send" type="submit">
              전송
            </button>
          </div>
        </form>
      </InputMessage>
    </View>
  );
}
