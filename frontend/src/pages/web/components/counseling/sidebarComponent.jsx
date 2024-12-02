import { useState, useCallback, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import styled, { css } from "styled-components";
import UserInfoComponent from "./userInfoComponent";
import Chat from "./chat";
import useAuthStore from "../../../../store/app/authStore";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import Swal from "sweetalert2";

const Tag = styled.div`
  position: absolute;
  top: 50px;
  right: ${({ hidden }) => (hidden ? "0px" : "-50px")};
  width: 50px;
  height: 100px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  background-color: #fae6e6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: left 0.3s ease;
`;

const View = styled.div`
  width: ${({ hidden, isUser }) => (hidden ? "0" : isUser ? "100%" : "35%")};
  height: ${({ isUser }) => (isUser ? "100vh" : "100vh")};
  background-color: #fae6e6;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.3s ease;
  overflow: hidden;
`;

const Header = styled.div`
  background-color: inherit;
  display: flex;
  align-items: center;
  padding: 20px 0px 0px 0px;
  padding-left: 20px;
  & > div:nth-child(1) {
    display: flex;
    width: 90%;
  }
`;

const Col = styled.div`
  background-color: inherit;
  font-size: 15px;
  padding: 5px 10px;
  cursor: pointer;
  ${({ active }) =>
    active &&
    css`
      background-color: white;
      color: #ffb1b1;
      border-radius: 50px;
    `}
`;

const Row = styled.div`
  flex: 1;
  overflow-y: hidden;
`;

let stompClient = null;
const baseUrl = import.meta.env.VITE_BASE_URL;

const SideBar = ({ memberInfo, hideChatView, hidden, setHidden }) => {
  const { role } = useAuthStore((state) => ({
    role: state.role,
  }));

  const [isChat, setIsChat] = useState(true);
  // const [hidden, setHidden] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const sessionId = localStorage.getItem("sessionId");
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));
  const chatRef = useRef(null);
  const userInfoRef = useRef(null);

  const toggleChat = useCallback((status) => {
    setIsChat(status);
  }, []);

  const hiddenSidebar = () => {
    if (role === "COUNSELOR") {
      setHidden(true);
    } else {
      setHidden(true);
      hideChatView(); // 사이드바를 숨길 때 ChatView도 숨기도록 설정
    }
  };

  const showSideBar = () => {
    setHidden(false);
  };

  useEffect(() => {
    if (sessionId) {
      connect();
    }
  }, [sessionId]);

  useEffect(() => {
    if (isConnected && sessionId) {
      stompClient.subscribe(`/topic/messages/${sessionId}`, (message) => {
        if (!isHistoryLoading) {
          showMessage(JSON.parse(message.body));
        }
      });

      fetchHistory(sessionId);
    }
  }, [isConnected, sessionId]);

  const connect = () => {
    if (!sessionId) {
      Swal.fire({
        icon: "warning",
        title: "세션 아이디를 입력해주세요",
      });
      return;
    }

    //서버로 올릴 때 wss로 변경해야함
    stompClient = new Client({
      brokerURL: "wss://i11c110.p.ssafy.io/gs-guide-websocket",
    });

    stompClient.onConnect = (frame) => {
      setIsConnected(true);
      console.log("Connected: " + frame);
    };

    stompClient.onWebSocketError = (error) => {
      console.error("Error with websocket", error);
    };

    stompClient.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    stompClient.activate();
  };

  const fetchHistory = async (sessionId) => {
    try {
      setIsHistoryLoading(true);
      const response = await axios.get(`${baseUrl}/history/${sessionId}`);
      const fetchedMessages = Array.isArray(response.data) ? response.data : [];
      showHistory(fetchedMessages);
      setIsHistoryLoading(false);
    } catch (error) {
      console.error("Error fetching history:", error);
      setIsHistoryLoading(false);
    }
  };

  const disconnect = () => {
    if (stompClient !== null) {
      stompClient.deactivate();
    }
    setIsConnected(false);
    console.log("Disconnected");
  };

  const sendMessage = (messageContent) => {
    if (stompClient !== null && messageContent.trim() !== "") {
      stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({
          sessionId: sessionId,
          from: user.name,
          content: messageContent,
        }),
      });
    }
  };

  const showMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const showHistory = (messages) => {
    setMessages(messages);
  };

  return (
    <>
      <View hidden={hidden} isUser={role === "USER"}>
        <Header>
          <div>
            <Col onClick={() => toggleChat(true)} active={isChat}>
              채팅
            </Col>
            {role === "COUNSELOR" ? (
              <div style={{ display: "flex" }}>
                <Col>|</Col>
                <Col onClick={() => toggleChat(false)} active={!isChat}>
                  내담자 정보
                </Col>
              </div>
            ) : null}
          </div>
          <div>
            <FontAwesomeIcon
              style={{ width: "20px", height: "30px", cursor: "pointer" }}
              icon={faAnglesRight}
              onClick={hiddenSidebar}
            />
          </div>
        </Header>
        {role === "COUNSELOR" ? (
          <>
            <Row style={{ display: isChat ? "block" : "none" }}>
              <Chat
                ref={chatRef}
                isConnected={isConnected}
                messages={messages}
                sendMessage={sendMessage}
                connect={connect}
                disconnect={disconnect}
              />
            </Row>
            <Row style={{ display: !isChat ? "block" : "none" }}>
              <UserInfoComponent ref={userInfoRef} memberInfo={memberInfo} />
            </Row>
          </>
        ) : (
          <Row>
            <Chat
              ref={chatRef}
              isConnected={isConnected}
              messages={messages}
              sendMessage={sendMessage}
              connect={connect}
              disconnect={disconnect}
            />
          </Row>
        )}
      </View>
      <Tag hidden={hidden} onClick={showSideBar}>
        <FontAwesomeIcon
          style={{ width: "50px", height: "30px" }}
          icon={faChevronLeft}
        />
      </Tag>
    </>
  );
};

export default SideBar;