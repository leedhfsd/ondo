import { useEffect, useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import axios from "axios";
import Swal from "sweetalert2";

const View = styled.div`
  padding: 0px 20px 20px 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const UserProfile = styled.div`
  padding: 30px 0px;
  display: flex;
`;

const Col = styled.div`
  &:nth-child(1) {
    width: 30%;
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
  padding: 0px 30px 20px 30px;
  border-radius: 15px;
  border: 2px solid black;
  overflow-y: scroll;
  div:last-child {
    border: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
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
    background-color: #fae6e6;
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
  }
`;
const baseUrl = import.meta.env.VITE_BASE_URL;

const UserInfoComponent = ({ memberInfo }) => {
  const [historyList, setHistoryList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const memberId = memberInfo.memberId;
  const size = 10;

  const [formData, setFormData] = useState([]);

  const updateDetail = (reservId) => async () => {
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
            title: "저장이 완료되었습니다.",
          });
        }
      } catch (error) {
        console.log("상담내역 수정 시 오류가 발생했습니다.");
      }
    } else {
      console.log("정보가 존재하지 않습니다.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + "Z");
    const koreaDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );

    return (
      koreaDate.getFullYear() +
      "-" +
      String(koreaDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(koreaDate.getDate()).padStart(2, "0")
    );
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
      setHistoryList((prevHistories) => [...prevHistories, ...newHistories]); // 기존 데이터에 추가

      if (newHistories.length < size) {
        setHasMore(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (page > 0) {
      getReservationHistory();
    }
  }, [page]);

  useEffect(() => {
    if (memberId) {
      setPage(0);
      setHistoryList([]);
      setHasMore(true);
      getReservationHistory();
    }
  }, [memberId]);

  useEffect(() => {
    const updatedFormData = historyList.map((item) => ({
      reservationId: item.reservationId || "",
      reservationDate: item.reservationDate || "",
      counselingReservationDetail: item.counselingReservationDetail || "",
      counsellingDetail: item.counsellingDetail || "",
    }));

    setFormData(updatedFormData);
  }, [historyList]);

  const handleInputChange = (field, reservId) => (event) => {
    const newValue = event.target.value;
    setFormData((prevFormData) =>
      prevFormData.map((item) =>
        item.reservationId === reservId ? { ...item, [field]: newValue } : item
      )
    );
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
          const lastElement = historyList.length === index + 1;
          return (
            <CounselingMemo
              key={index}
              ref={lastElement ? lastHistoryElementRef : null}
            >
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
        })}
      </History>
    </View>
  );
};

export default UserInfoComponent;
