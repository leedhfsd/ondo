import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { styled } from "styled-components";
import { Link } from "react-router-dom";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatLocalDateToISO } from "../../../../utils/dateUtils";
import { keyframes } from "styled-components";
import Swal from "sweetalert2";

const View = styled.div`
  padding: 20px 20px;
  width: 100%;
  height: 25%;
  display: flex;
  position: relative;
  align-items: center;
  background-color: white;
  border: 3px solid #ffa79d;
  border-radius: 10px;
  margin-bottom: 30px;
  position: relative;
  ${(props) =>
    props.past &&
    `
      border-color: gray;
    `}
`;

const Col = styled.div`
  & > .member-info {
    font-weight: 800;
    font-size: 20px;
  }
  &:nth-child(2) {
    flex: 2;
    & > div:nth-child(2) {
      color: gray;
      margin-top: 5px;
    }
  }
  &:nth-child(3) {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
  }
`;

const shine = keyframes`
  0% {
    opacity: 1;
  }
  40% {
    opacity: 1;
  }
  100% {
    left: 125%;
    opacity: 0;
  }
`;
const CreateCounselingRoomBtn = styled.button`
  background-color: #ffa79d;
  height: 50%;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 20px;
  position: relative;
  overflow: hidden; /* 내부의 넘치는 효과가 잘리는 것을 방지 */

  &::before {
    position: absolute;
    top: 0;
    left: -75%;
    z-index: 2;
    display: block;
    content: "";
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 100%
    );
    transform: skewX(-25deg);
    opacity: 0;
  }

  &:hover::before {
    opacity: 1;
    animation: ${shine} 0.75s;
  }
`;

// const CreateCounselingRoomBtn = styled.button`
//   background-color: #ffa79d;
//   height: 50%;
//   /* width: 80%; */
//   width: fit-content;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: white;
//   border-radius: 20px;
// `;

const MemberImg = styled.div`
  padding-right: 20px;
  & > svg,
  & > img {
    width: 50px;
    height: 50px;
  }
`;

const CancelReservationBtn = styled.button`
  /* background-color: #ffa79d; */
  position: absolute;
  color: white;
  width: 20px;
  height: 30px;
  top: 5px;
  right: 0;
  background-color: white;
  /* left: 100%; */
  /* bottom: 5%; */
  color: #ffa79d;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const baseUrl = import.meta.env.VITE_BASE_URL;
const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : baseUrl;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

function Reservation({ reservation }) {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState();
  const [reservationFormattedDate, setReservationFormattedDate] = useState();
  const [timeRemaining, setTimeRemaining] = useState();
  const [age, setAge] = useState();

  const createCounselingRoom = async (event) => {
    event.stopPropagation();
    // if (timeRemaining === 0) {
    try {
      if (!localStorage.getItem("sessionId")) {
        const sessionResponse = await axios.post(
          `${baseUrl}/counseling/sessions`,
          { reservationId: reservation.reservationId },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // default를 true로 설정
          }
        );
        localStorage.setItem("sessionId", sessionResponse.data.data.session_id);
      }
      navigate("/counselingroom", {
        state: {
          reservationId: reservation.reservationId,
          memberId: reservation.memberId,
        },
      });
    } catch (error) {
      console.error("Error creating counseling room:", error);
    }
    // } else return;
  };

  const changeDateFormat = () => {
    let date = new Date(reservation.reservationDate);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
    let day = String(date.getDate()).padStart(2, "0");
    let hours = String(date.getHours()).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");

    let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

    setReservationFormattedDate(formattedDate);
  };

  const handleCancelClick = async () => {
    const result = await Swal.fire({
      title: "이미지를 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      cancelRequest(reservation.reservationId);
    }
  };

  const cancelRequest = async (reservId) => {
    console.log(reservId);
    if (!reservId) {
      Swal.fire({
        icon: "warning",
        title: "잘못된 입력입니다.",
      });
      return;
    }

    try {
      const response = await api.delete(`/counselor/reservation`, {
        data: {
          reservationId: reservId,
        },
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "예약이 취소 되었습니다.",
        });
        window.location.reload(); // 페이지 새로고침
      } else {
        Swal.fire({
          icon: "error",
          title: "예약 취소에 실패했습니다.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "예약 취소 중 오류가 발생했습니다.",
      });
    }
  };

  useEffect(() => {
    changeDateFormat();
    calculateTimeRemaining();
    calculateAge(reservation.memberBirthday);
  }, []);

  // 시간 차이 계산
  const calculateTimeRemaining = () => {
    let today = new Date();
    let reservationDate = new Date(reservation.reservationDate + "Z"); // 'Z'를 추가하여 UTC임을 명시
    let timeDifference = reservationDate - today;
    let hoursDifference = timeDifference / (1000 * 60 * 60);
    let minutesDifference = timeDifference / (1000 * 60);

    if (timeDifference <= 0) {
      setTimeRemaining(-1); // 예약 시간이 이미 지난 경우
    } else if (minutesDifference <= 60) {
      setTimeRemaining(0); // 예약 시간으로부터 1시간 이내인 경우
    } else {
      setTimeRemaining(Math.ceil(hoursDifference / 24)); // 일 단위로 남은 시간을 계산
    }
  };

  const calculateAge = (memberBirthday) => {
    const today = new Date();
    const birthDate = new Date(memberBirthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    setAge(age);
  };
  const ViewMemberInfo = () => {
    navigate("/counselor/info/member", {
      state: {
        memberId: reservation.memberId,
      },
    });
  };

  return (
    <View onClick={ViewMemberInfo} past={timeRemaining < 0}>
      <Col>
        {false ? (
          <MemberImg></MemberImg>
        ) : (
          <MemberImg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </MemberImg>
        )}
      </Col>
      <Col>
        <div className="member-info">
          {reservation.memberName}(만 {age}세)
        </div>
        <div>상담일: {reservationFormattedDate}</div>
      </Col>
      <Col>
        {timeRemaining > 0 ? (
          <CancelReservationBtn onClick={handleCancelClick}>
            <FontAwesomeIcon icon={faX} />
          </CancelReservationBtn>
        ) : null}
        <CreateCounselingRoomBtn onClick={createCounselingRoom}>
          입장
        </CreateCounselingRoomBtn>
        {/* {timeRemaining >= 0 ? (
          <CreateCounselingRoomBtn onClick={createCounselingRoom}>
            {timeRemaining > 1
              ? `D-${Math.floor(timeRemaining)}`
              : timeRemaining === 0
                ? `입장`
                : `D-day`}
          </CreateCounselingRoomBtn> */}
        {/* ) : null} */}
      </Col>
    </View>
  );
}

export default Reservation;
