import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import useCounselorStore from "../../../store/app/CounselorStore";
import CounselorCard from "../../../components/app/Counselor/CounselorCard";
import CounselorListCard from "../../../components/app/Counselor/CounselorListCard";
import "./CounselorMain.css";

const CounselorMain = () => {
  const { userReservations, counselors, fetchUserReservations, fetchCounselors, displayGender, calculateDday, calculateExactDateTime } = useCounselorStore();
  const [filteredCounselors, setFilteredCounselors] = useState([]);

  const center = {
    display: filteredCounselors == 0 ? "flex" : "none",
    justifyContent: filteredCounselors == 0 ? "center" : "none",
    alignItems: filteredCounselors == 0 ? "center" : "none",
    height: filteredCounselors == 0 ? "40vh" : "none",
  };
  useEffect(() => {
    fetchUserReservations();
    fetchCounselors();
  }, [fetchUserReservations, fetchCounselors]);

  // 유효한 예약인지(시간 위주 체크)
  const validReservations = useMemo(() => {
    return userReservations.filter(reservation => {
      const { hoursPassed } = calculateExactDateTime(reservation.reservationDate);
      return hoursPassed < 1; // 1시간 이상 지나지 않은 예약만 포함
    });
  }, [userReservations, calculateExactDateTime]);

  // 날짜대로 정렬 위한 
  const sortedReservations = useMemo(() => {
    return [...validReservations].sort((a, b) => {
      const ddayA = calculateDday(a.reservationDate);
      const ddayB = calculateDday(b.reservationDate);
      if (ddayA === 'D-day') return -1;
      if (ddayB === 'D-day') return 1;
      if (ddayA.startsWith('D-') && ddayB.startsWith('D-')) {
        return parseInt(ddayA.slice(2)) - parseInt(ddayB.slice(2));
      }
      return 0;
    });
  }, [validReservations, calculateDday]);

  const handleFilteredCounselorsChange = (newFilteredCounselors) => {
    setFilteredCounselors(newFilteredCounselors);
  };

  return (
    <div className="scroll">
      <div className="CounselorMain">
        <div className="CounselorCardBack">
          <div className="MP-RCard">
            <CounselorCard
              reservations={sortedReservations}
              counselors={counselors}
              onFilteredCounselorsChange={handleFilteredCounselorsChange}
            />
          </div>
        </div>
        <div className="MP-CounselorList">
          {filteredCounselors.length > 0 ? (
            filteredCounselors.map((counselor) => (
              <Link
                key={counselor.id}
                to={`/member/counseling/reserve/${counselor.id}`}
                style={{
                  textDecoration: "none",
                  color: "black",
                  marginBottom: "20px",
                  display: "block",
                }}
              >
                <CounselorListCard
                  name={counselor.name}
                  gender={displayGender(counselor.gender)}
                  field={counselor.field}
                  intro={counselor.intro}
                />
              </Link>
            ))
          ) : (
            <div style={center} className="no-counselors-message p-15">
              검색 조건에 맞는 상담사가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounselorMain;
