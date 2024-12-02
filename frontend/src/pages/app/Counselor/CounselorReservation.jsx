import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCounselorStore from "../../../store/app/CounselorStore";
import CLCard from "../../../components/app/Counselor/CLCard";
import Button2 from "../../../components/app/Button2";
import Calendar from "../../../components/app/Calendar";
import TimeSlots from "../../../components/app/TimeSlots";
import BorderImg from "../../../assets/images/구분선.png";
import back from "../../../assets/images/back.png";
import styled from "styled-components";
import { formatLocalDateToISO } from "../../../utils/dateUtils";
import Swal from "sweetalert2";

const FullWidthCLCard = styled(CLCard)`
  width: 100% !important;
`;

const Reservation = () => {
  const { counselorId } = useParams();
  const nav = useNavigate();
  const {
    selectedCounselor,
    fetchCounselorDetails,
    fetchCounselorSchedule,
    makeReservation,
    counselorSchedule,
    displayGender,
  } = useCounselorStore();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (counselorId) {
      fetchCounselorDetails(counselorId);
      fetchCounselorSchedule(counselorId);
    }
  }, [counselorId, fetchCounselorDetails, fetchCounselorSchedule]);

  // console.log(counselorSchedule)

  const handleReservation = async () => {
    if (!counselorId || !selectedDate || !selectedTime) {
      Swal.fire({
        icon: "warning",
        title: "상담사 ID, 날짜, 시간을 모두 선택해주세요.",
      });
      return;
    }

    const [hours, minutes] = selectedTime.split(":");
    const reservationDate = new Date(selectedDate);
    reservationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const reservDate = formatLocalDateToISO(reservationDate);

    try {
      const result = await makeReservation(
        parseInt(counselorId),
        reservDate,
        note
      );
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "예약되었습니다.",
        });
        nav("/member/counseling/main");
      } else {
        Swal.fire({
          icon: "error",
          title: "예약에 실패했습니다.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "예약 중 오류가 발생했습니다.",
      });
    }
  };

  const onClickBack = () => {
    nav("/member/counseling/main");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="scroll">
        <div className="flex-grow">
          <div
            className="bg-[#6ABFB4] rounded-2xl p-4 mb-5"
            style={{
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <img
                onClick={onClickBack}
                style={{ cursor: "pointer", padding: "10px 0px" }}
                src={back}
                alt="Back"
              />
            </div>
            {selectedCounselor && (
              <FullWidthCLCard
                name={selectedCounselor.name}
                gender={displayGender(selectedCounselor.gender)}
                field={selectedCounselor.field}
                intro={selectedCounselor.intro}
                reservId={counselorId}
                showCancelButton={false}
              />
            )}
            <br />
            <h1 className="text-2xl font-bold mb-4">예약일지</h1>
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            <TimeSlots
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              unavailableTimes={counselorSchedule}
            />
          </div>
          <img src={BorderImg} alt="" className="w-full" />
          <div className="p-4">
            <textarea
              maxLength={100}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: "100%",
                border: "1px black solid",
                borderRadius: "10px",
                height: "80px",
                padding: "5px 10px",
                resize: "none",
              }}
              placeholder="힘든 점이나 고민점 혹은 하고싶은 말을 자유롭게 적어보세요.
(ex. 은둔기간: 2024.05~
      요즘 잠이 안 와요..."
            ></textarea>
            <br />
            <br />
            <Button2 text="예약 확정하기" onClick={handleReservation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
