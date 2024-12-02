import { useNavigate } from "react-router-dom";
import vector from "./../../../assets/images/Vector.png";
import "./CardCarousel.css";
import useCounselorStore from "../../../store/app/CounselorStore";
import { useEffect } from "react";
import Swal from "sweetalert2";

const mainProfileUrl = "https://d1kbrt3q8264bl.cloudfront.net/profile.png";

const CardCarousel = ({
  name,
  reservationDate,
  gender,
  field,
  intro,
  is_completed,
  reservId,
  profileUrl,
  counselingUrl,
}) => {
  const nav = useNavigate();
  const { calculateDday, displayGender } = useCounselorStore();

  const dday = calculateDday(reservationDate);

  // useEffect(() => {
  //     console.log("CardCarousel props:", { name, reservationDate, gender, field, intro, id });
  // }, [name, reservationDate, gender, field, intro, id]);

  const handleCounselingClick = () => {
    if (counselingUrl) {
      nav(`/counselingroom`, {
        state: {
          sessionId: counselingUrl,
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

  if (!name && !gender && !field && !intro) {
    return <div>상담사 정보를 불러오는 중...</div>;
  }

  return (
    <>
      <div style={{ padding: "3% 5%" }}>
        {reservationDate && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <p className="CS-Date">
              {new Date(reservationDate).toLocaleDateString().slice(0, -1)}
            </p>
            <p style={{ margin: "0px 10px" }}>|</p>
            <p className="CS-Date">
              {reservationDate.split("T")[1].slice(0, 5)}
            </p>
          </div>
        )}
        <div className="ConSelorCardIn">
          <div>
            <img
              src={profileUrl || mainProfileUrl}
              alt={`${name} 상담사 프로필`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = mainProfileUrl;
              }}
            />
          </div>
          <div className="CounselorInfo">
            <p id="MP-CounselorName">
              {name || "이름 없음"} 상담사(
              {displayGender(gender) || "성별 미상"})
            </p>
            <div id="CS-Btn">
              <button onClick={handleCounselingClick} id="DdayBtn">
                <div>{dday}</div>
              </button>
            </div>
          </div>
          {!dday && (
            <div>
              <img src={vector} alt="Vector" />
            </div>
          )}
        </div>

        {dday && (
          <div className="CSCardFooter">
            <div></div>
          </div>
        )}
      </div>
    </>
  );
};

export default CardCarousel;
