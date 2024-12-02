import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/app/authStore";
import axios from "axios";
import Button from "../../../components/app/Button";
import Footer from "../../../components/app/Footer";
import notice from "./../../../assets/images/notice.png";
import "./Mypage.css";
import useFcmStore from "../../../store/app/FcmStore.js";

const mainProfileUrl = "https://d1kbrt3q8264bl.cloudfront.net/profile.png";

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // 쿠키를 포함하기 위해 필요
});

const MyPage = () => {
  const nav = useNavigate();
  const { logout, checkAuth, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const { fcmtoken } = useFcmStore();

  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        nav("/member/login");
      }
      setLoading(false);
    };

    init();
  }, [checkAuth, nav]);

  const onClickInfoEdit = () => {
    if (user) {
      nav(`/member/info/${user.id}/update`);
    }
  };

  const onClickLogout = async () => {
    const success = await logout(fcmtoken);
    if (success) {
      nav("/member/main");
    } else {
      alert("로그아웃 실패!");
    }
  };

  const onClickCounseling = () => {
    nav("/member/counseling/list");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="Mypage">
      <div className="UserCardBack">
        <div id="My-notice">
          <p>My Page</p>
          <div style={{ width: "30px", height: "30px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
          </div>
        </div>
        <div className="UserCard">
          <img
            src={user.profileUrl || mainProfileUrl}
            alt="Profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          <div className="UserInfo">
            <p id="MP-UserName">
              {user.name} 님({user.nickname})
            </p>
            <p id="MP-Email">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="MypageCenter">
        <Button onClick={onClickCounseling} text="내 상담리스트" />
        <Button onClick={onClickInfoEdit} text="내 정보 수정" />
        <Button onClick={onClickLogout} text="로그아웃" />
      </div>
      <Footer />
    </div>
  );
};

export default MyPage;
