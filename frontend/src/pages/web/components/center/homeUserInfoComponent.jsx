import { useEffect, useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import axios from "axios";
import { faAppStoreIos } from "@fortawesome/free-brands-svg-icons";
import { formatLocalDateToISO } from "../../../../utils/dateUtils";
import Swal from "sweetalert2";

const View = styled.div`
  padding: 0px 20px 0px 20px;
  width: 90%;
  height: 95%;
  display: flex;
  flex-direction: column;
`;

const UserProfile = styled.div`
  padding: 30px 5px;
  display: flex;
`;

const Col = styled.div`
  &:nth-child(1) {
    width: 20%;
    height: 100%;
    & > div {
      width: 100%;
      height: 100%;
    }
  }
  &:nth-child(2) {
    margin-left: 20px;
    & > div:nth-child(1) {
      font-size: 30px;
      font-weight: 800;
    }
  }
`;

const History = styled.div`
  flex: 1;
  background-color: white;
  padding: 0px 30px 10px 30px;
  border-radius: 10px;
  border: 2px solid black;
  overflow-y: scroll;
  div:last-child {
    border: none;
  }
  /* Hide scrollbar for WebKit-based browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none; /* Firefox */

  /* Optional: Hide scrollbar for IE, Edge */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
`;

const CounselingMemo = styled.div`
  border-bottom: 2px solid black;
  padding: 20px 0px;
  & > p:nth-child(1) {
    font-size: 20px;
    font-weight: 800;
  }
  & > p:nth-child(2) {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 10px;
  }
  .memo {
    background-color: #cdd3d5;
    padding: 10px 20px;
    border-radius: 10px;
    width: 100%;
    textarea {
      width: 100%;
      background-color: inherit;
    }
    & > div:nth-child(2) {
      display: flex;
      justify-content: flex-end;
      button {
        height: fit-content;
        width: fit-content;
        color: gray;
        font-size: 15px;
        background-color: inherit;
        padding: 0px;
      }
    }
    & textarea {
      height: 90px;
      resize: none;
    }
    :focus {
      outline: none;
    }
  }
`;
const baseUrl = import.meta.env.VITE_BASE_URL;

const HomeUserInfoComponent = () => {
  const [memberInfo, setMemberInfo] = useState({});
  const [historyList, setHistoryList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const location = useLocation();
  const memberId = location.state.memberId;
  const size = 10;

  const [formData, setFormData] = useState([
    {
      reservationId: "",
      reservationDate: "",
      counselingReservationDetail: "",
      counsellingDetail: "",
    },
  ]);

  const updateDetail = (reservId) => async (event) => {
    const itemToUpdate = formData.find(
      (item) => item.reservationId === reservId
    );

    if (itemToUpdate) {
      try {
        const response = await axios.put(
          `${baseUrl}/counselor/memberReservation`,
          itemToUpdate,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          console.log("수정이 완료되었습니다. ");
          Swal.fire({
            icon: "success",
            title: "상담내역 저장 완료.",
          });
        }
      } catch (error) {
        console.log("상담내역 수정 시 오류가 발생했습니다.");
      }
    } else {
      console.log("정보가 존재하지 않습니다.");
    }
  };

  useEffect(() => {
    getMemberInfo();
    getReservationHistory();
  }, [memberId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    console.log("예약", date);
    console.log("새함수 예약", formatLocalDateToISO(date));
    // 새로운 함수
    return formatLocalDateToISO(date).split("T")[0];
  };

  const getMemberInfo = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/counselor/getMember?memberId=${memberId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data.data.member;
      setMemberInfo({
        birthDate: data.birthDate,
        gender: data.gender === "MALE" ? "남성" : "여성",
        memberId: data.memberId,
        memberName: data.memberName,
      });
    } catch (e) {
      console.log("Error fetching member info:", e);
    }
  };

  const getReservationHistory = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/counselor/memberReservation?memberId=${memberId}&page=${page}&size=${size}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const newHistories = response.data.data.reservations;

      setHistoryList([...newHistories]); //초기화 먼저 한 후 넣기
      if (newHistories.length < size) {
        setHasMore(false); // 더 이상 로드할 데이터가 없을 때
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // historyList의 길이에 맞게 formData 업데이트
    const updatedFormData = historyList.map((item) => ({
      reservationId: item.reservationId || "",
      reservationDate: item.reservationDate || "",
      counselingReservationDetail: item.counselingReservationDetail || "",
      counsellingDetail: item.counsellingDetail || "",
    }));

    setFormData(updatedFormData);
  }, [historyList]); // historyList가 변경될 때마다 실행됩니다.

  const handleInputChange = (field, reservId) => (event) => {
    const newValue = event.target.value;
    setFormData((prevFormData) => {
      // 새 formData 배열을 만듭니다.
      const updatedFormData = prevFormData.map((item) =>
        // 항목의 reservationId가 reservId와 같으면 업데이트
        item.reservationId === reservId ? { ...item, [field]: newValue } : item
      );
      return updatedFormData;
    });
  };

  const lastHistoryElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    if (page !== 0) {
      getReservationHistory();
    }
  }, [page]);

  return (
    <View>
      <UserProfile>
        <Col>
          {false ? (
            <div>
              <img src="" alt="Profile" />
            </div>
          ) : (
            <div
              style={{
                padding: "20px 10px",
                border: "2px solid black",
                backgroundColor: "white",
              }}
            >
              <FontAwesomeIcon
                style={{ width: "100%", height: "100%" }}
                icon={faUser}
              />
            </div>
          )}
        </Col>
        <Col>
          <div>{memberInfo.memberName}</div>
          <div>
            <div>생년월일: {memberInfo.birthDate}</div>
            <div>성별: {memberInfo.gender}</div>
          </div>
        </Col>
      </UserProfile>
      <History>
        {historyList.map((history, index) => {
          if (historyList.length === index + 1) {
            //마지막 component
            return (
              <CounselingMemo key={index} ref={lastHistoryElementRef}>
                <p>{formatDate(history.reservationDate)}</p>
                <p>{history.counselingReservationDetail}</p>
                <div className="memo">
                  <div>
                    <textarea
                      onChange={handleInputChange(
                        "counsellingDetail",
                        history.reservationId
                      )}
                      value={formData[index]?.counsellingDetail}
                      placeholder="상담 내용을 기록하세요."
                    />
                  </div>
                  <div>
                    <button onClick={updateDetail(history.reservationId)}>
                      수정
                    </button>
                  </div>
                </div>
              </CounselingMemo>
            );
          } else {
            return (
              <CounselingMemo key={index}>
                <p>{formatDate(history.reservationDate)}</p>
                <p>{history.counselingReservationDetail}</p>
                <div className="memo">
                  <div>
                    <textarea
                      onChange={handleInputChange(
                        "counsellingDetail",
                        history.reservationId
                      )}
                      value={formData[index]?.counsellingDetail}
                      placeholder="상담 내용을 기록하세요."
                    />
                  </div>
                  <div>
                    <button onClick={updateDetail(history.reservationId)}>
                      저장
                    </button>
                  </div>
                </div>
              </CounselingMemo>
            );
          }
        })}
      </History>
    </View>
  );
};

export default HomeUserInfoComponent;
