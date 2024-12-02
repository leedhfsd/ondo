import "./Loginpage.css";
import { useState } from "react";
import Button from "../../../components/app/Button";
import kakaologin from "./../../../assets/images/kakaologin.png";
import naverlogin from "./../../../assets/images/naverlogin.png";
import useAuthStore from "../../../store/app/authStore";
import useFcmStore from "../../../store/app/FcmStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Loginpage = () => {
  const nav = useNavigate();
  const login = useAuthStore((state) => state.login);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { fcmtoken, setFcmToken } = useFcmStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // 에러 메시지 초기화
    try {
      const success = await login(email, password, fcmtoken);
      if (success) {
        await checkAuth();
        nav("/member/home");
        await Swal.fire({
          icon: "success",
          title: "로그인에 성공했습니다.",
        });
      } else {
        setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
      console.error("Login error:", error);
    }
  };
  const onClickKakao = () => {
    window.location.href =
      "http://i11c110.p.ssafy.io:8081/oauth2/authorization/kakao";
  };

  const onClickNaver = () => {
    window.location.href =
      "http://i11c110.p.ssafy.io:8081/oauth2/authorization/naver";
  };
  const onClickJoin = () => {
    nav("/member/join");
  };

  return (
    <main className="Loginpage">
      <p id="Title">로그인</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-id">아이디</label>
          <br />
          <input
            id="login-id"
            type="text"
            placeholder="아이디"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <br />
          <input
            id="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button
          style={{ marginBottom: "10px" }}
          text={"로그인"}
          type="submit"
        />
      </form>
      <div className="cross-line">
        <div></div>
        <div>or</div>
        <div></div>
      </div>
      <img
        onClick={onClickKakao}
        src={kakaologin}
        style={{ cursor: "pointer", marginBottom: "10px" }}
        alt="Kakao Login"
      />
      <img
        onClick={onClickNaver}
        src={naverlogin}
        style={{ cursor: "pointer", marginBottom: "10px" }}
        alt="Naver Login"
      />
      <p
        className="cursor-pointer text-center text-sm text-gray-500"
        onClick={onClickJoin}
        style={{ cursor: "pointer", color: "gray" }}
      >
        회원가입하기
      </p>
    </main>
  );
};

export default Loginpage;
