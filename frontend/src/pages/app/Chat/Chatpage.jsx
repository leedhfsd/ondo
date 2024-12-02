import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/app/Spinner";
import chat_send from "./../../../assets/images/chat_send.png";
import back from "./../../../assets/images/back.png";
import chrface from "./../../../assets/images/test_chara.png";
import "./Chatpage.css";
import styled, { keyframes } from "styled-components";

const Back = styled.div`
  margin-right: 10px;
`;
const baseUrl = import.meta.env.VITE_BASE_URL;
const api = axios.create({ baseURL: baseUrl, withCredentials: true });
const typing = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Letter = styled.span`
  opacity: 0;
  animation: ${typing} 1s infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

const Loading = styled.div`
  display: inline-block;
`;

const Chatpage = () => {
  const size = 20;
  const nav = useNavigate();
  const [character, setCharacter] = useState(null);
  const [characterLoading, setCharacterLoading] = useState(true);
  const [characterError, setCharacterError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [pageNum, setPageNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const chatContainerRef = useRef(null);
  const loadingRef = useRef(null);

  const getChatbotMessage = useCallback(async () => {
    const response = await api.get(
      `/chatbot/list?page=${pageNum}&size=${size}`
    );
    if (response.status === 200) {
      setPageNum((prevPageNum) => prevPageNum + 1);
    }
    return response.data.data.chattingList;
  }, [pageNum, size]);

  const getCharacter = useCallback(async () => {
    setCharacterLoading(true);
    setCharacterError(null);
    try {
      const characterResponse = await api.get("/character/getCharacter", {
        timeout: 5000,
      });
      const fetchedCharacter = characterResponse.data.data.character;
      if (fetchedCharacter && fetchedCharacter.name) {
        setCharacter(fetchedCharacter);
      } else {
        setCharacterError("Invalid character data received");
        setCharacter({ name: "Unknown" });
      }
    } catch (error) {
      setCharacterError(error.message || "Failed to fetch character");
      setCharacter({ name: "Unknown" });
    } finally {
      setCharacterLoading(false);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  const sendMessage = useCallback(async () => {
    if (userInput.trim() !== "" && !isLoading) {
      setIsLoading(true);
      const currentInput = userInput;
      setUserInput("");

      try {
        const response = await api.post(
          "/chatbot/insert",
          { message: currentInput },
          { headers: { "Content-Type": "application/json" } }
        );
        const newMessages = response.data.data.responseChatting;
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      } catch (error) {
        setUserInput(currentInput);
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    }
  }, [userInput, isLoading, scrollToBottom]);

  const loadMoreMessages = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const oldMessages = await getChatbotMessage();
      if (oldMessages.length < size) {
        setHasMore(false);
      }
      setMessages((prevMessages) => [
        ...oldMessages.reverse(),
        ...prevMessages,
      ]);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, getChatbotMessage, size]);

  useEffect(() => {
    getCharacter();
  }, [getCharacter]);

  useEffect(() => {
    if (!isInitialized) {
      const initializeChat = async () => {
        setIsLoading(true);
        try {
          const initialMessages = await getChatbotMessage();
          setMessages(initialMessages.reverse());
          scrollToBottom();
        } catch (error) {
          console.error("Error initializing chat:", error);
        } finally {
          setIsInitialized(true);
          setIsLoading(false);
        }
      };
      initializeChat();
    }
  }, [isInitialized, getChatbotMessage, scrollToBottom]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreMessages();
        }
      },
      { threshold: 1.0 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [hasMore, isLoading, loadMoreMessages]);

  const handleInputChange = useCallback((event) => {
    setUserInput(event.target.value);
  }, []);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="Chat">
      <div className="CharacterName">
        <Back onClick={() => nav("/member/home")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Back>
        <img
          src={chrface}
          alt="다람이 얼굴"
          style={{
            borderRadius: "50%",
            border: "2px solid black",
            width: "50px",
            height: "50px",
            objectFit: "cover",
            cursor: "default",
          }}
        />
        {characterLoading ? (
          <div>Loading character...</div>
        ) : characterError ? (
          <div>Error: {characterError}</div>
        ) : character ? (
          <div>{character.name}</div>
        ) : (
          <div>Unknown Character</div>
        )}
      </div>

      <div className="ChatContentWrapper">
        <div className="ChatContent" ref={chatContainerRef}>
          <div ref={loadingRef} style={{ height: "1px" }} />
          <div className="ChatScreen">
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                {index === 0 ||
                formatMessageDate(message.createdAt) !==
                  formatMessageDate(messages[index - 1].createdAt) ? (
                  <div className="date-separator">
                    {formatMessageDate(message.createdAt)}
                  </div>
                ) : null}
                <div
                  className={`message-container ${message.sender === "user" ? "user" : "bot"}`}
                >
                  <div
                    className={
                      message.sender === "user" ? "user-message" : "bot-message"
                    }
                  >
                    {message.content}
                  </div>
                  <div className="message-time">
                    {formatMessageTime(message.createdAt)}
                  </div>
                </div>
              </React.Fragment>
            ))}
            {isLoading && (
              <Loading>
                {"입력 중...".split("").map((char, index) => (
                  <Letter key={index} delay={index * 0.1}>
                    {char}
                  </Letter>
                ))}
              </Loading>
            )}
          </div>
        </div>
      </div>

      <div className="ChatboxWrapper">
        <div className="Chatbox">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
          />
          <img onClick={sendMessage} src={chat_send} alt="Send" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Chatpage);
