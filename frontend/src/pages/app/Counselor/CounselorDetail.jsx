import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCounselorStore from '../../../store/app/CounselorStore';
import back from "./../../../assets/images/back.png";
import './CounselorDetail.css';
import styled from "styled-components";
const mainProfileUrl = "https://d1kbrt3q8264bl.cloudfront.net/profile.png";

const Header = styled.div`
  width: 100%;
  height: 80px;
  padding: 20px 0px;
  display: flex;
  justify-content: center;
  & > div {
    width: 33%;
  }
  & > div:nth-child(1) {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  & > div:nth-child(2) {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const CounselorDetail = () => {
  const nav = useNavigate();
  const { counselorId } = useParams();
  const { selectedCounselor, fetchCounselorDetails, displayGender } =
    useCounselorStore();

  useEffect(() => {
    if (counselorId) {
      fetchCounselorDetails(parseInt(counselorId));
    }
  }, [counselorId, fetchCounselorDetails]);

  const onClickBack = () => {
    nav(-1);
  };

  if (!selectedCounselor) return null;

  return (
    <div className="scroll">
      <Header>
        <div onClick={onClickBack}>
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
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </div>
        <div>상담사 소개</div>
        <div></div>
      </Header>
      <div className="CD-Card">
        <div>
          <p id='CD-name'>{selectedCounselor.name} 상담사({displayGender(selectedCounselor.gender)})</p>
          <img
            src={selectedCounselor.profileUrl || mainProfileUrl}
            alt={`${selectedCounselor.name} 상담사 프로필`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = mainProfileUrl;
            }}
          />
          <p>분야</p>
          <p>{selectedCounselor.field}</p>
          <p>경력</p>
          <div className="Career">
            <ul>
              {selectedCounselor.career.map((item, index) => (
                <li key={index}>- {item}</li>
              ))}
            </ul>
          </div>
          <div id="CD-line"></div>
          <p>{selectedCounselor.intro}</p>
        </div>
      </div>
    </div>
  );
};

export default CounselorDetail;