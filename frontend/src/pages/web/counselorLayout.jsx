import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { styled, keyframes } from "styled-components";
import { Link } from "react-router-dom";
import ReservationSpot from "./components/checkReservation/ReservationSpot";
import useAuthStore from "../../store/app/authStore";
import IncorrectAccessModal from "./components/incorrectAccessModal";
import Centerpage from "./centerpage";

const View = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #3b3a83;
  display: flex;
  overflow-y: hidden;
  padding-right: 20px;
  /* font-family: "Dongle", sans-serif;
  font-weight: 400;
  font-style: normal; */
  font-family: "Jua", sans-serif;
  font-weight: 400;
  font-style: normal;
`;
const Header = styled.div`
  padding: 10px 30px 10px 0px;
  color: white;
  font-size: 30px;
  display: flex;
  align-items: flex-end; /* 세로 방향 가운데 정렬 */
  width: 100%; /* 전체 너비를 차지하게 설정 */
  height: 60px; /* 원하는 높이 지정 */
  box-sizing: border-box; /* 패딩 포함한 박스 모델 사용 */
`;

const HomeLeft = styled.div`
  height: 100%;
  width: 230px;
  background-color: #3b3a83;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0px 20px 30px;
`;

const HomeRight = styled.div`
  /* height: 100%; */
  flex: 1;
  background-color: #f5f5fa;
  display: flex;
  border-radius: 30px;
  margin: 20px 0px 20px 0px;
`;
// const Profile = styled.div`
//   padding: 50px 0px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   & > .profile-img {
//     width: 120px;
//     height: 120px;
//     & > svg {
//       color: black;
//       width: 100%;
//       height: 100%;
//     }
//   }
//   & > .username {
//     color: black;
//     margin-top: 10px;
//     font-size: 25px;
//   }
// `;

const Profile = styled.div`
  padding: 50px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .profile-img-container {
    width: 200px;
    height: 200px;
    border: 3px #ffffff solid;
    overflow: hidden;
    border-radius: 50%;
    margin-bottom: 20px; // 이미지와 이름 사이의 간격
  }

  .profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover; // 이미지가 컨테이너를 꽉 채우도록 함
  }

  .username {
    color: black;
    font-size: 25px;
  }
`;

const StyledLink = styled(Link)`
  width: 100%;
  /* color: white; */
  font-weight: 500;
  font-size: 20px;
  padding: 20px 0px 20px 20px;
  border-bottom-left-radius: 30px;
  border-top-left-radius: 30px;
  background-color: #3b3a83;
  text-align: start;
  display: flex;
  /* align-items: center; */
  & > div:nth-child(1) {
    margin-right: 5px;
  }
  color: ${({ isActive }) => (isActive ? "#3b3a83" : "#f5f5fa")};
  background-color: ${({ isActive }) => (isActive ? "#f5f5fa" : "#3b3a83")};
  &:hover {
    color: ${({ isActive }) => (isActive ? "#3b3a83" : "#f5f5fa")};
  }

  &: hover{
    color: #AFB5CE;
    background-color: #f5f5fa;
  }
`;

const Nav = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 100%;
`;

const wave = keyframes`
  0%, 40%, 100% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-5px);
  }
`;


const LogoutBtn = styled.button`
  display: flex;
  color: white;
  background-color: rgba(0, 0, 0, 0);
  margin-bottom: 10px;
  padding-left: 25%;
  padding-right: 25%;
  & > span{
    font-size: 17px;
  }
  &:hover > span {
    font-weight: 1000;
    animation: ${wave} 1.5s ease-in-out;
    // ease-in-out: 처음에는 느리게, 중간에는 빠르게, 마지막에는 다시 느리게 애니메이션이 실행
    animation-iteration-count: 1;

    &:nth-child(1) {
      animation-delay: 0.1s;
    }
    &:nth-child(2) {
      animation-delay: 0.13s;
    }
    &:nth-child(3) {
      animation-delay: 0.16s;
    }
    &:nth-child(4) {
      animation-delay: 0.19s;
    }
    &:nth-child(5) {
      animation-delay: 0.22s;
    }
    &:nth-child(6) {
      animation-delay: 0.25s;
    }
    &:nth-child(7) {
      animation-delay: 0.28s;
    }
`;

const ChangeSpot = styled.div`
  width: 50%;
`;

const mainProfileUrl = "https://d1kbrt3q8264bl.cloudfront.net/profile.png";

function CounselorLayout() {
  const { role, user, counselorLogout, checkAuth } = useAuthStore((state) => ({
    role: state.role,
    user: state.user,
    counselorLogout: state.counselorLogout,
    checkAuth: state.checkAuth,
  }));

  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 가져오기
  const [isModalOpen, setIsModalOpen] = useState(false);

  const logout = async () => {
    console.log("logout");
    await counselorLogout();
    navigate("/counselor/login");
  };

  const counselorCloseModal = () => {
    setIsModalOpen(false);
    //로그인이 안된 경우
    if (!role) {
      navigate("/counselor/login");
    }
    //로그인이 되어있는데 유저인 경우
    else if (role === "USER") {
      navigate("/member/home");
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      console.log("counselorLayout - role:", role, "user:", user);
      // await checkAuth(); // 인증 상태를 먼저 확인합니다.

      if (!role) {
        navigate("/counselor/login");
      }
      /* //로그인이 안된 경우 또는 로그인이 되어있긴한데 유저가 해당 페이지로 와버린 경우
      else if (role !== "COUNSELOR") {
        setIsModalOpen(true);
      } */
    };

    checkAuthentication();
  }, [role, user, checkAuth]);

  return (
    <View>
      <HomeLeft>
        {/* <Profile>
          <div className="profile-img-container">
            {user?.profileUrl ? (
              <img className="profile-img" src={user.profileUrl} alt="프로필" />
            ) : (
              <img
                className="profile-img"
                src={mainProfileUrl}
                alt="기본 프로필"
              />
            )}
          </div>
          <div className="username">{user?.name} 상담사님</div>
        </Profile> */}
        <Header>
          <div>Menu</div>
        </Header>
        <Nav>
          <StyledLink to="" isActive={location.pathname === "/counselor"}>
            <div>
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
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                />
              </svg>
            </div>
            <div>일정관리</div>
          </StyledLink>
          <StyledLink
            to="daylist/상담사아이디"
            isActive={location.pathname.includes("daylist")}
          >
            <div>
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
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
            </div>
            <div>상담내역</div>
          </StyledLink>
          <StyledLink
            to="mypage"
            isActive={location.pathname.includes("mypage")}
          >
            <div>
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <div>마이페이지</div>
          </StyledLink>
          <StyledLink
            to="updatepassword/상담사아이디"
            isActive={location.pathname.includes("updatepassword")}
          >
            <div>
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
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <div> 비밀번호 변경</div>
          </StyledLink>
        </Nav>
        <LogoutBtn onClick={logout}>
          <span>
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
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
              />
            </svg>
          </span>
          {/* <div>LogOut</div> */}
          <span>L</span>
          <span>o</span>
          <span>g</span>
          <span>O</span>
          <span>u</span>
          <span>t</span>
        </LogoutBtn>
      </HomeLeft>
      <HomeRight>
        <ReservationSpot />
        <ChangeSpot>
          <Centerpage />
        </ChangeSpot>
      </HomeRight>
      <IncorrectAccessModal
        isOpen={isModalOpen}
        closeModal={counselorCloseModal}
      />
    </View>
  );
}

export default CounselorLayout;
