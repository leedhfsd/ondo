import "./CLCard.css";
import { useNavigate, Link } from "react-router-dom";
import useCounselorStore from "../../../store/app/CounselorStore";
import Swal from "sweetalert2";
const mainProfileUrl = "https://d1kbrt3q8264bl.cloudfront.net/profile.png";

const CLCard = ({
  name,
  gender,
  field,
  reservationDate,
  intro,
  is_complete,
  reservId,
  counselingUrl,
  profileUrl,
  isExpired,
  showCancelButton = true,
  counselorId,
}) => {
  const nav = useNavigate();
  const { calculateDday, displayGender, cancelReservation } =
    useCounselorStore();

  const dday = calculateDday(reservationDate);

  const handleCounselingClick = () => {
    if (counselingUrl) {
      localStorage.setItem("sessionId", counselingUrl);
      nav(`/counselingroom`, {
        state: {
          sessionId: counselingUrl,
          reservationId: "",
          memberId: "",
        },
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "아직 상담 시간이 되지 않았습니다.",
        text: "상담 시간에 다시 시도해주세요",
      });
    }
  };

  const handleCancelClick = async () => {
    const result = await Swal.fire({
      title: "정말 취소하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      try {
        await cancelReservation(reservId);
        Swal.fire({
          icon: "success",
          title: "상담 예약이 취소되었습니다.",
        });
        window.location.reload();
      } catch (error) {
        Swal.fire({
          icon: "warning",
          title: "오류가 발생했습니다.",
        });
      }
    }
  };

  return (
    <div
      className="CLCard"
      style={is_complete ? { backgroundColor: "rgb(238, 237, 237)" } : null}
    >
      {reservationDate && (
        <div style={{ display: "flex", alignItems: "center" }}>
          {reservationDate && (
            <div
              style={{
                display: "flex",
                padding: "5px 0px",
                alignItems: "center",
              }}
            >
              <p id="CL-Date">
                {new Date(reservationDate).toLocaleDateString()}
              </p>
              <p style={{ margin: "0px 10px" }}>|</p>
              <p className="CS-Date">
                {reservationDate.split("T")[1].slice(0, 5)}
              </p>
            </div>
          )}
        </div>
      )}
      <div className="CLCardIn">
        <img
          style={{ marginRight: "20px" }}
          src={profileUrl || mainProfileUrl}
          alt={`${name} 상담사 프로필`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = mainProfileUrl;
          }}
        />
        <div className="CSInfo">
          <p id="CS-CounselorName">
            {name} 상담자({displayGender(gender)})
          </p>
          <p id="CS-Counselorfield">{field}</p>
          <p id="CS-Counselorintro">{intro}</p>
          {reservId && (
            <Link to={`/member/counseling/${counselorId}/detail`}>
              <div
                style={{
                  textAlign: "right",
                  fontSize: "80%",
                  color: "black",
                  textDecoration: "underline",
                }}
              >
                더보기
              </div>
            </Link>
          )}
        </div>
      </div>
      <div className="CS-CardFooter">
        {dday && showCancelButton && (
          <div className="cancel-button" onClick={handleCancelClick}>
            취소
          </div>
        )}
        <div>
          {dday && (
            <button onClick={handleCounselingClick} id="DdayBtn">
              {counselingUrl ? <div>입장</div> : <div>{dday}</div>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CLCard;
