import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useCounselorStore from "../../../store/app/CounselorStore";
import CLCard from "../../../components/app/Counselor/CLCard";
import back from "./../../../assets/images/back.png";
import sort from "./../../../assets/images/Shape.png";
import "./CounselorList.css";

const CounselorList = () => {
  const nav = useNavigate();
  const {
    userReservations,
    fetchUserReservations,
    isLoading,
    displayGender,
    calculateExactDateTime,
  } = useCounselorStore();
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchUserReservations();
  }, [fetchUserReservations]);

  const sortedReservations = useMemo(() => {
    return [...userReservations]
      .map((reservation) => {
        const dateTimeInfo = calculateExactDateTime(
          reservation.reservationDate
        );
        return {
          ...reservation,
          isExpired: dateTimeInfo.isAfterReservation,
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.reservationDate);
        const dateB = new Date(b.reservationDate);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [userReservations, sortOrder, calculateExactDateTime]);

  const onClickBack = () => {
    nav(-1);
  };

  const onClickSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="scroll">
      <div className="CL-header">
        <div>
          <img
            onClick={onClickBack}
            style={{ cursor: "pointer" }}
            src={back}
            alt="Back"
          />
        </div>
        <div>상담예약내역</div>
        <div onClick={onClickSort} style={{ cursor: "pointer" }}>
          {/* <img src={sort} alt="Sort" /> */}
          {/* <span>{sortOrder === "asc" ? "오름차순" : "내림차순"}</span> */}
          <span>
            {sortOrder === "asc" ? (
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
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            ) : (
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
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            )}
          </span>
        </div>
      </div>
      <div className="CL-main">
        {sortedReservations.length === 0 ? (
          <div className="no-reservations">예약된 상담이 없습니다.</div>
        ) : (
          <div className="CS-List">
            {sortedReservations.map((reservation) => (
              <CLCard
                key={reservation.id}
                name={reservation.counselor?.name}
                gender={reservation.counselor?.gender}
                field={reservation.counselor?.field}
                intro={reservation.counselor?.intro}
                dday={reservation.dday}
                is_complete={reservation.is_complete}
                reservationDate={reservation.reservationDate}
                reservId={reservation.id}
                counselingUrl={reservation.counselingUrl}
                isExpired={reservation.isExpired}
                counselorId={reservation.counselorId}
              />
            ))}
          </div>
        )}
      </div>
      <div id="CL-empty"></div>
    </div>
  );
};

export default CounselorList;
