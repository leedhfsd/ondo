import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserVideoComponent from "./components/counseling/openVideoComponent";
import LoadingComponent from "./components/counseling/loadingComponent";
import PreJoinComponent from "./components/counseling/preJoinComponent";
import {
  faMicrophoneSlash,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import SideBar from "./components/counseling/sidebarComponent";
import useAuthStore from "../../store/app/authStore";

const View = styled.div`
  width: 100vw;
  height: 100vh;
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  @media (max-width: 360px) {
    & {
      width: 360px;
      height: 100vh;
    }
  }
`;

const WebCamView = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #000000;
`;

const VideoView = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  #main-video {
    padding: 10px;
    border-radius: 50px;
    border: 5px solid yellow;
    @media (min-width: 381px) {
      margin-right: 20px;
    }
    @media (max-width: 380px) {
      margin-bottom: 20px;
    }
  }

  video,
  canvas {
    border-radius: 50px;
  }

  @media (max-width: 360px) {
    padding: 0px 10px;
    & {
      width: 360px;
      height: 90vh;
      display: flex;
      flex-direction: column;
    }
  }
`;

const Nav = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  width: 100%;
  button {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin: 0px 5px;
    color: white;
    background-color: #333333;
    & > div > svg {
      color: white;
    }
    &:nth-child(3) {
      background-color: #f83d39;
    }
  }
`;

const SmallViewChatBtn = styled.button`
  display: none;

  @media (max-width: 380px) {
    display: block;
  }
`;

const baseUrl = import.meta.env.VITE_BASE_URL;
const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : baseUrl;

const CounselingRoom = () => {
  const { role } = useAuthStore((state) => ({
    role: state.role,
  }));

  const [filterEnabled, setFilterEnabled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileChatView, setIsMobileChatView] = useState(false);
  const [isViewVisible, setIsViewVisible] = useState(true);

  const sessionId = localStorage.getItem("sessionId");
  const reservationId = location.state.reservationId;
  const memberId = location.state.memberId;
  const [memberInfo, setMemberInfo] = useState({});

  const [preJoin, setPreJoin] = useState(true);

  const [session, setSession] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
  const [micStatus, setMicStatus] = useState(true);
  const [cameraStatus, setCameraStatus] = useState(true);

  const [hidden, setHidden] = useState(true);


  const toggleChatView = useCallback(() => {
    setIsMobileChatView((prev) => !prev);
  }, []);

  const hideChatView = useCallback(() => {
    setIsMobileChatView(false);
  }, []);

  const joinSession = useCallback(
    async (micStatus, cameraStatus) => {
      const OV = new OpenVidu();
      const mySession = OV.initSession();

      mySession.on("streamCreated", (event) => {
        if (
          event.stream.connection.connectionId !==
          mySession.connection.connectionId
        ) {
          const subscriber = mySession.subscribe(event.stream, undefined);
          setSubscribers((prevSubscribers) => [
            ...prevSubscribers,
            subscriber,
          ]);
        }
      });

      mySession.on("streamDestroyed", (event) => {
        setSubscribers((prevSubscribers) =>
          prevSubscribers.filter(
            (subscriber) => subscriber !== event.stream.streamManager
          )
        );
      });

      mySession.on("exception", (exception) => {
        console.warn(exception);
      });

      const token = await getToken(sessionId);

      try {
        await mySession.connect(token);

        const publisher = await OV.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: micStatus,
          publishVideo: cameraStatus,
          resolution: "640x480",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: false,
        });

        mySession.publish(publisher);

        const devices = await OV.getDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        const currentVideoDeviceId = publisher.stream
          .getMediaStream()
          .getVideoTracks()[0]
          .getSettings().deviceId;
        const currentVideoDevice = videoDevices.find(
          (device) => device.deviceId === currentVideoDeviceId
        );

        setSession(mySession);
        setPublisher(publisher);
        setCurrentVideoDevice(currentVideoDevice);
        getMemberInfo();
      } catch (error) {
        console.error("Error initializing publisher:", error);
      }
    },
    [sessionId]
  );

  const getMemberInfo = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/counselor/getMember?memberId=${memberId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("================유저정보 받아오기===================");
      setMemberInfo(response.data.data.member);
    } catch (e) {
      console.log(e);
    }
  };

  const leaveSession = useCallback(async () => {
    try {
      await axios.post(
        `${baseUrl}/counseling/sessions/${sessionId}/leave`,
        { reservationId: reservationId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error notifying server about leaving session:", error);
    }

    localStorage.removeItem("sessionId");
    setSession(undefined);
    setPublisher(undefined);
    setSubscribers([]);
    if (session) {
      session.disconnect();
    }

    if (role === "USER") {
      navigate("/counseling/list");
    } else {
      navigate("/counselor");
    }
  }, [session, sessionId, reservationId, role, navigate]);

  const getToken = async (sessionId) => {
    const response = await axios.post(
      `${baseUrl}/counseling/sessions/${sessionId}/connections`,
      { role: role === "COUNSELOR" ? "counselor" : "user" },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data.data.token;
  };

  const handleJoin = ({ micStatus, cameraStatus }) => {
    setMicStatus(micStatus);
    setCameraStatus(cameraStatus);
    setPreJoin(false);
    joinSession(micStatus, cameraStatus);
  };

  const leaveCounseling = () => {
    if (role === "COUNSELOR") {
      navigate("/counselor");
    } else {
      navigate("/member/counseling/main");
    }
  };

  const toggleFilter = () => {
    setFilterEnabled((prev) => !prev);
  };

  useEffect(() => {
    if (publisher) {
      publisher.publishVideo(cameraStatus);
    }
  }, [cameraStatus, publisher]);

  useEffect(() => {
    if (publisher) {
      publisher.publishAudio(micStatus);
    }
  }, [micStatus, publisher]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      leaveSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [leaveSession]);

  useEffect(() => {
    const rootElement = document.getElementById("root");
    rootElement.style.overflow = "hidden";
  }, [location.pathname]);

  return (
    <div style={{ overflowY: "hidden" }}>
      {preJoin ? (
        <PreJoinComponent onJoin={handleJoin} />
      ) : session !== undefined ? (
        <View isVisible={isViewVisible}>
          {!isMobileChatView ? (
            <WebCamView>
              <VideoView>
                {publisher !== undefined && (
                  <div id="main-video" className="col-md-6">
                    <UserVideoComponent
                      streamManager={publisher}
                      filterEnabled={filterEnabled}
                    />
                  </div>
                )}
                {subscribers.map((subscriber, index) => (
                  <div key={index} id={`sub-video-${index}`} className="col-md-6">
                    <UserVideoComponent streamManager={subscriber} />
                  </div>
                ))}
              </VideoView>
              <Nav>
                <button onClick={() => setMicStatus(!micStatus)}>
                  {micStatus ? (
                    <div>
                      <FontAwesomeIcon icon={faMicrophone} />
                    </div>
                  ) : (
                    <div>
                      <FontAwesomeIcon icon={faMicrophoneSlash} />
                    </div>
                  )}
                </button>
                <button onClick={() => setCameraStatus(!cameraStatus)}>
                  {cameraStatus ? (
                    <div>
                      {/* Camera on SVG */}
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
                          d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div>
                      {/* Camera off SVG */}
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
                          d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
                        />
                      </svg>
                    </div>
                  )}
                </button>
                <button id="buttonLeaveSession" onClick={leaveCounseling}>
                  <div>
                    {/* Leave session SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </button>
                {role === "COUNSELOR" && (
                  <button id="buttonLeaveSession" onClick={leaveSession}>
                    <div>상담종료</div>
                  </button>
                )}
                <button onClick={toggleFilter}>
                  <div>필터</div>
                </button>
                {role === "COUNSELOR" ? null : (
                  <SmallViewChatBtn onClick={toggleChatView}>채팅</SmallViewChatBtn>
                )}
              </Nav>
            </WebCamView>
          ) : (
            <div></div>
          )}
          <SideBar
            memberInfo={memberInfo}
            onBack={() => setIsViewVisible(true)}
            setIsViewVisible={setIsViewVisible}
            hideChatView={hideChatView} // 콜백 함수 전달
            hidden={hidden}
            setHidden={setHidden}
          />
        </View>
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
};

export default CounselingRoom;