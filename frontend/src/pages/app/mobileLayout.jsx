import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { styled } from "styled-components";
import Footer from "../../components/app/Footer";
import useAuthStore from "../../store/app/authStore";
import IncorrectAccessModal from "../../pages/web/components/incorrectAccessModal";
import { formatLocalDateToISO } from "../../utils/dateUtils";
const View = styled.div`
  font-family: "NIXGONM-Vb";
  position: relative;
  background-color: #fff9e9;
  width: 100%;
  max-width: 420px;
  margin: auto;
  height: 100vh;
  overflow-y: hidden;
  box-shadow: rgba(100, 100, 100, 0.2) 0px 0px 29px 0px;
  @font-face {
    font-family: "PFStardust";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/PFStardust.woff")
      format("woff");
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: "DungGeunMo";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/DungGeunMo.woff")
      format("woff");
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: "양진체";
    src: url("https://fastly.jsdelivr.net/gh/supernovice-lab/font@0.9/yangjin.woff")
      format("woff");
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: "NIXGONM-Vb";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/NIXGONM-Vb.woff")
      format("woff");
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: "NIXGONFONTS B 2.0";
    src: url("./../fonts/NIXGONFONTS B 2.0.ttf");
  }
  @font-face {
    font-family: "NIXGONFONTS L 2.0";
    src: url("./../fonts/NIXGONFONTS L 2.0.ttf");
  }
  @font-face {
    font-family: "NIXGONFONTS M 2.0";
    src: url("./../fonts/NIXGONFONTS M 2.0.ttf");
  }
  @font-face {
    font-family: "morris9";
    src: url("./../fonts/모리스체-heroine762.ttf");
  }
  @font-face {
    font-family: "PF스타더스트";
    src: url("./../fonts/PF스타더스트.ttf");
  }
`;

export default function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role } = useAuthStore((state) => ({
    role: state.role,
  }));

  useEffect(() => {
    const checkAuthentication = () => {
      if(!role&&!location.pathname.startsWith("/member/login") &&!location.pathname.startsWith("/member/join")){
        navigate("/member/main")
      }
      else if(role=="COUNSELOR"){
        navigate("/counselor");
      }
      // // 유저가 아닌데 유저만 입장 가능한 URI에 접근하는 경우
      // if (
      //   !location.pathname.startsWith("/member/main") &&
      //   !location.pathname.startsWith("/member/login") &&
      //   !location.pathname.startsWith("/member/join") &&
      //   role !== "USER"
      // ) {
      //   console.log("1");
      //   setIsModalOpen(true);
      // }
      // // 유저가 맞는데 로그인/조인 화면에 들어가는 경우
      // else if (
      //   (location.pathname.startsWith("/member/main") ||
      //     location.pathname.startsWith("/member/join") ||
      //     location.pathname.startsWith("/member/login")) &&
      //   role === "USER"
      // ) {
      //   console.log(role);
      //   console.log("2");
      //   setIsModalOpen(true);
      // } else {
      //   setIsModalOpen(false);
      // }
    };

    checkAuthentication();
  }, [location.pathname]);

  useEffect(() => {
    console.log("isModalOpen: " + isModalOpen);
  }, [isModalOpen]);

  const mobileCloseModal = () => {
    setIsModalOpen(false);
    // 상담사가 들어온 경우
    if (role === "COUNSELOR") {
      navigate("/counselor");
    }
    // 유저인데 로그인으로 들어온 경우
    else if (
      (location.pathname.startsWith("/member/main") ||
        location.pathname.startsWith("/member/join") ||
        location.pathname.startsWith("/member/login")) &&
      role === "USER"
    ) {
      navigate("/member/home");
    }
    // 유저가 아닌 경우 홈화면으로 이동
    else {
      navigate("/member/main");
    }
  };

  const noFooterPaths = [
    "/member/main",
    "/member/",
    "/member/join",
    "/member/login",
    "/member/name",
    "/member/chat",
    "/member/story",
  ];

  const shouldShowFooter = !noFooterPaths.includes(location.pathname);

  return (
    <View>
      <Outlet />
      {shouldShowFooter && <Footer id="footer" />}
      <IncorrectAccessModal
        isOpen={isModalOpen}
        closeModal={mobileCloseModal}
      />
    </View>
  );
}
