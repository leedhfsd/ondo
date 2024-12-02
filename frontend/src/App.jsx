import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/app/authStore";

import CounselorNotFoundPage from "./pages/web/components/counselorNotFoundPage";
import CounselorLogin from "./pages/web/counselorLogin";
import CounselingRoom from "./pages/web/counselingRoom";
import CounselorJoin from "./pages/web/counselorJoin";
import CounselorLayout from "./pages/web/counselorLayout";
import MobileLayout from "./pages/app/mobileLayout";

import UserInfoComponent from "./pages/web/components/counseling/userInfoComponent";
import Centerpage from "./pages/web/centerpage";
// import DetailSchedulComponent from "./components/center/DetailSchedulComponent";
import DetailSchedulComponent from "./pages/web/components/center/DetailSchedulComponent";
import TimeTableComponent from "./pages/web/components/center/TimeTableComponent";
import DayList from "./pages/web/components/center/DayListComponent";
import CounselorMypage from "./pages/web/components/center/CounselorMypageComponent";
import UpdatePassword from "./pages/web/components/center/UpdatePassword";
import Schedul from "./pages/web/components/center/SchedulComponent";

import Logopage from "./pages/app/Member/Logopage";
import Loginpage from "./pages/app/Member/Loginpage";
import Story from "./pages/app/OurStory/story";
import Namepage from "./pages/app/Home/Namepage";
import Notfoundpage from "./pages/app/Notfoundpage";
import Homepage from "./pages/app/Home/Homepage";
import Chatpage from "./pages/app/Chat/Chatpage";
import Boardpage from "./pages/app/Board/Boardpage";
import BoardDetailpage from "./pages/app/Board/BoardDetailpage";
import BoardCreatepage from "./pages/app/Board/BoardCreatepage";
import BoardUpdatepage from "./pages/app/Board/BoardUpdatepage";
import MyUpdateForm from "./pages/app/Member/MyUpdatepage";

import Join from "../src/pages/app/Member/Join";
import OAuthCallback from "./pages/app/Member/OAuthCallback";
import MyPage from "../src/pages/app/Member/MyPage";
import Mission from "./pages/app/Mission/Mission";
import CompletedMission from "./pages/app/Mission/CompletedMissions";
import CounselorList from "../src/pages/app/Counselor/CounselorList";
import CounselorMain from "../src/pages/app/Counselor/CounselorMain";
import CounselorReservation from "../src/pages/app/Counselor/CounselorReservation";
import CounselorDetail from "../src/pages/app/Counselor/CounselorDetail";
import HomeUserInfoComponent from "./pages/web/components/center/homeUserInfoComponent";
// import DetailSchedulComponent from "./pages/web/components/center/DetailSchedulComponent";

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import useFcmStore from "../src/store/app/FcmStore.js";
// import { onBackgroundMessage } from "firebase/messaging/sw";

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyAk9W2eCQ5qrmgZv4WvC--1_WuflqeXZ0Y",
    authDomain: "ondo-ffd48.firebaseapp.com",
    projectId: "ondo-ffd48",
    storageBucket: "ondo-ffd48.appspot.com",
    messagingSenderId: "11671201090",
    appId: "1:11671201090:web:8883a7703bea1735ac14db",
    measurementId: "G-E488XVDL6J",
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const { setFcmToken } = useFcmStore();

  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);

    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      icon: "/assets/icons/character_icon.png",
      badge: "/assets/icons/favicon76.png",
      data: {
        url: "/member/chat", // 클릭 시 이동할 경로
      },
    };

    //포그라운드에서 알림을 표시하는 코드
    if (Notification.permission === "granted") {
      const notification = new Notification(
        notificationTitle,
        notificationOptions
      );

      // 알림 클릭 이벤트 처리
      notification.onclick = (event) => {
        console.log("클릭함!!");
        event.preventDefault(); // 기본 동작 방지
        window.location.href = notificationOptions.data.url; // 경로 이동
      };
    }
  });

  useEffect(() => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );

        getToken(messaging, {
          vapidKey: import.meta.env.REACT_APP_VAPID,
        })
          .then((currentToken) => {
            if (currentToken) {
              console.log("FCM Token:", currentToken);
              setFcmToken(currentToken);
            } else {
              console.log(
                "No registration token available. Request permission to generate one."
              );
            }
          })
          .catch((err) => {
            console.error("An error occurred while retrieving token. ", err);
          });
      })
      .catch((err) => {
        console.error("Service Worker registration failed: ", err);
      });
  }, [setFcmToken]);

  return (
    <Router>
      <Routes>
         <Route path="" element={<Navigate to="/member/main" />} />
        <Route path="/" element={<Navigate to="/member/main" />} />
        {/* 상담사 */}
        <Route path="/counselor/login" element={<CounselorLogin />}></Route>
        <Route path="/counselor/join" element={<CounselorJoin />}></Route>
        <Route path="/counselor" element={<CounselorLayout />}>
          <Route path="" element={<Schedul />} />
          {/* <Route path="" element={<TimeTableComponent/> }/> */}
          {/* <Route path="detail" element={<DetailSchedulComponent/> }/> */}
          <Route path="daylist/:id" element={<DayList />} />
          <Route path="mypage" element={<CounselorMypage />} />
          <Route path="updatepassword/:id" element={<UpdatePassword />} />
          {/* <Route path="userinfo" element={<UserInfo />} /> */}
          <Route path="info/member" element={<HomeUserInfoComponent />}></Route>
          <Route path="*" element={<CounselorNotFoundPage />} />
        </Route>
        {/* 상담방 */}
        {/* counseling으로 이동할 때 sessionId값을 가지고 이동해야함 -> sessionId로 token발급을 하고 그걸 바탕으로 session에 참가 가능 */}
        <Route path="counselingroom" element={<CounselingRoom />}></Route>
        {/* 유저 */}
        <Route path="/member" element={<MobileLayout />}>
          <Route path="oauth-callback" element={<OAuthCallback />} />
          <Route path="main" element={<Logopage />} />
          <Route path="login" element={<Loginpage />} />
          <Route path="story" element={<Story />} />
          <Route path="home" element={<Homepage />} />
          <Route path="chat" element={<Chatpage />} />
          <Route path="board" element={<Boardpage />} />
          <Route path="board/create" element={<BoardCreatepage />} />
          <Route path="board/:articleId/update" element={<BoardUpdatepage />} />
          <Route path="board/:articleId" element={<BoardDetailpage />} />
          <Route path="join" element={<Join />} />
          <Route path="profile" element={<MyPage />} />
          <Route path="mission/list" element={<Mission />} />
          {/* 완료된 미션 목록 페이지 */}
          <Route path="mission/completed" element={<CompletedMission />} />
          <Route path="counseling/list" element={<CounselorList />} />
          <Route path="counseling/main" element={<CounselorMain />} />
          <Route
            path="counseling/reserve/:counselorId"
            element={<CounselorReservation />}
          />
          <Route
            path="counseling/:counselorId/detail"
            element={<CounselorDetail />}
          />
          <Route path="info/:id/update" element={<MyUpdateForm />} />
          <Route path="*" element={<CounselorNotFoundPage />} />
        </Route>
        {/* )} */}
        <Route path="/*" element={<CounselorNotFoundPage />} />
      </Routes>
    </Router>
  );
}
export default App;
