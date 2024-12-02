import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/app/authStore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import IncorrectAccessModal from "./components/incorrectAccessModal";
import LogoImg from "./../../assets/images/onDo로고_그림자.png";
import Swal from "sweetalert2";

const View = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #ffffff;
`;

const Logo = styled.img`
  width: 20%;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 20px;
  font-weight: 300;
  color: #888;
  margin-bottom: 40px;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3); /* 텍스트 그림자 추가 */
`;

const Input = styled.input`
  width: 320px;
  padding: 10px;
  border-radius: 10px;
  background-color: #fceeee;
  text-align: center;
  font-size: 1rem;
  color: #888;
  &:hover,
  &:focus {
    outline: none;
  }
  &:nth-child(1) {
    margin-bottom: 20px;
  }
`;

const Button = styled.button`
  width: 100px;
  height: 100%;
  padding: 10px;
  margin-left: 20px;
  border-radius: 10px;
  border: none;
  background-color: #ffd8a1;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover,
  &:focus {
    outline: none;
    background-color: #fec069;
  }
`;
const LoginForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const CounselorLogin = () => {
  const [credentials, setCredentials] = useState({ id: "", password: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role, user, counselorLogin } = useAuthStore((state) => ({
    role: state.role,
    user: state.user,
    counselorLogin: state.counselorLogin,
    checkAuth: state.checkAuth,
  }));
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      await counselorLogin(credentials.id, credentials.password, {
        withCredential: true,
      });
      navigate("/counselor");
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "로그인에 실패했습니다.",
      });
    }
  };

  const counselorCloseModal = async () => {
    setIsModalOpen(false);
    if (role === "USER") {
      navigate("/member/home");
    } else if (role === "COUNSELOR") {
      navigate("/counselor");
    }
  };

  const checkAuthentication = () => {
    console.log("counselorLogin - " + role);
    //유저가 로그인 페이지에 들어온 경우
    console.log(isModalOpen);
    if (role === "USER" || role === "COUNSELOR") {
      setIsModalOpen(true);
      //상담사가 로그인 페이지에  들어온 경우
    }
    //그 외엔 로그인 하러 들어온 사람...
  };
  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <View>
      <Subtitle>당신의 잠든 일상을 깨우는, 따스한</Subtitle>
      <Logo src={LogoImg} alt="Logo" />
      <LoginForm>
        <InputArea>
          <Input
            type="text"
            name="id"
            value={credentials.id}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
          />
          <Input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
          />
        </InputArea>
        <Button onClick={handleLogin}>로그인</Button>
      </LoginForm>
      <IncorrectAccessModal
        isOpen={isModalOpen}
        closeModal={counselorCloseModal}
      />
    </View>
  );
};

export default CounselorLogin;
