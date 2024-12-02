import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Slider from "react-slick";
import useCounselorStore from "../../../store/app/CounselorStore";
import CardCarousel from "./CardCarousel";
import search from "./../../../assets/images/ic_search.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CounselorCard.css";

const GenderFilter = ({ selectedGender, onGenderChange }) => (
  <div className="OptionSelect">
    {["전체", "남", "여"].map((gender) => (
      <div key={gender}>
        <input
          type="radio"
          name="gender"
          value={gender}
          checked={selectedGender === gender}
          onChange={() => onGenderChange(gender)}
        />{" "}
        {gender}
      </div>
    ))}
  </div>
);

const SearchFilter = ({
  searchField,
  onSearchFieldChange,
  searchKeyword,
  onSearchKeywordChange,
}) => (
  <div className="FilterSearch">
    <select
      className="FS-Filter"
      onChange={(e) => onSearchFieldChange(e.target.value)}
      value={searchField}
    >
      <option value="">▽ 선택</option>
      <option value="name">이름</option>
      <option value="field">분야</option>
    </select>
    <div className="FS-Search">
      <input
        type="text"
        placeholder={
          searchField
            ? searchField === "name"
              ? "이름으로 검색하기"
              : "상담 분야로 검색하기"
            : "검색어를 입력하세요."
        }
        value={searchKeyword}
        onChange={(e) => onSearchKeywordChange(e.target.value)}
      />
      <img src={search} alt="Search" />
    </div>
  </div>
);


const CounselorCard = ({ reservations, counselors, onFilteredCounselorsChange }) => {
  const nav = useNavigate();
  const [selectedGender, setSelectedGender] = useState('전체');
  const [searchField, setSearchField] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const { displayGender, calculateDday, calculateExactDateTime } = useCounselorStore();

  const sortedReservations = useMemo(() => {
    return reservations
    .filter(reservation => {
      const { hoursPassed } = calculateExactDateTime(reservation.reservationDate);
      return hoursPassed < 1; // 1시간 이상 지나지 않은 예약만 포함
    })
    .sort((a, b) => {
      const ddayA = calculateDday(a.reservationDate);
      const ddayB = calculateDday(b.reservationDate);
      if (ddayA === 'D-day') return -1;
      if (ddayB === 'D-day') return 1;
      if (ddayA.startsWith('D-') && ddayB.startsWith('D-')) {
        return parseInt(ddayA.slice(2)) - parseInt(ddayB.slice(2));
      }
      return 0;
    });
  }, [reservations, calculateDday, calculateExactDateTime]);

  const filteredCounselors = useMemo(() => {
    return counselors.filter((counselor) => {
      const genderMatch =
        selectedGender === "전체" ||
        displayGender(counselor.gender) === selectedGender;
      const keywordMatch =
        !searchKeyword ||
        (searchField === "name" && counselor.name.includes(searchKeyword)) ||
        (searchField === "field" && counselor.field.includes(searchKeyword));
      return genderMatch && keywordMatch;
    });
  }, [counselors, selectedGender, searchField, searchKeyword, displayGender]);

  useEffect(() => {
    onFilteredCounselorsChange(filteredCounselors);
  }, [filteredCounselors, onFilteredCounselorsChange]);

  const settings = {
    dots: true,
    infinite: sortedReservations.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: true,
    adaptiveHeight: true,
  };

  const handleCardClick = () => {
    nav("/member/counseling/list");
  };

  return (
    <div className="CounselorPageTop">
      <div className="CounselorCard">
        {sortedReservations.length > 0 ? (
          <Slider {...settings}>
            {sortedReservations.map((reservation, index) => (
              <div
                key={index}
                onClick={handleCardClick}
                style={{ cursor: "pointer" }}
              >
                <CardCarousel
                  name={reservation.counselor?.name}
                  reservationDate={reservation.reservationDate}
                  gender={reservation.counselor?.gender}
                  field={reservation.counselor?.field}
                  intro={reservation.counselor?.selfIntroduction}
                  id={reservation.id}
                  dday={reservation.dday}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="no-reservations-message">예약된 상담이 없습니다.</div>
        )}
      </div>

      <GenderFilter
        selectedGender={selectedGender}
        onGenderChange={setSelectedGender}
      />

      <SearchFilter
        searchField={searchField}
        onSearchFieldChange={setSearchField}
        searchKeyword={searchKeyword}
        onSearchKeywordChange={setSearchKeyword}
      />
    </div>
  );
};

CounselorCard.propTypes = {
  reservations: PropTypes.array.isRequired,
  counselors: PropTypes.array.isRequired,
  onFilteredCounselorsChange: PropTypes.func.isRequired,
};

export default CounselorCard;
