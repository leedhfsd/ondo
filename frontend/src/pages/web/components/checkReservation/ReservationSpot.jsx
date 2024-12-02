import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled, { ServerStyleSheet } from "styled-components";
import Reservation from "./reservation";
import useAuthStore from "../../../../store/app/authStore";

import EmptySchedule from "./../../../../assets/images/counselor_Calendar.png" 

const View = styled.div`
  padding: 50px 50px;
  width: 45%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  font-weight: 700;
  font-size: 25px;
  margin-bottom: 15px;
`;

const Search = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 20px;
  margin-bottom: 10px;
  border-bottom: 3px solid black;
  & > input {
    flex: 1;
    border-radius: 15px;
    margin-right: 30px;
    padding: 0px 20px;
  } :: placeholder {
    color: #C2C2C2; 
  } :focus{
    outline:none; 
  }
  & > button {
    width: 80px;
    color: white;
    background-color: #ffa79d;
  } :hover{
     outline:none; 
  }
     
  & > button: hover{
    background-color: #FD8679;
  }
`;

const ReservationList = styled.div`
  height: 90%;
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE와 Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const baseUrl = import.meta.env.VITE_BASE_URL;

function ReservationSpot() {
  const [reservationList, setReservationList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(0);
  const [searchPage, setSearchPage] = useState(0);
  const size = 10;
  const [searchWord, setSearchWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 일반 리스트
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(true); // 검색 결과
  const [isSearching, setIsSearching] = useState(false); // 검색 중인지 여부
  const observerTarget = useRef(null);
 const { role } = useAuthStore((state) => ({
    role: state.role,
  }));
  const getReservationList = async (reset = false) => {
    if (role !== "COUNSELOR") {
      console.warn("You do not have permission to view this content.");
      return;
    }
    if (!hasMore) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/counselor/reservation?page=${page}&size=${size}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 쿠키를 포함하여 요청
        }
      );

      const newReservations = response.data.data.reservations;
      if (newReservations.length < size) {
        setHasMore(false);
      }

      setReservationList((prevList) =>
        reset ? newReservations : [...prevList, ...newReservations]
      );
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
    setIsLoading(false);
  };

  const getSearchResults = async (reset = false) => {
    if (role !== "COUNSELOR") {
      console.warn("You do not have permission to view this content.");
      return;
    }
    if (!hasMoreSearchResults) return;
    //
    if (searchWord == "") {
      setIsSearching(false);
      getReservationList();
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/counselor/reservation/search/${encodeURIComponent(
          searchWord
        )}?page=${searchPage}&size=${size}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newSearchResults = response.data.data.reservations;
      if (newSearchResults.length < size) {
        setHasMoreSearchResults(false);
      }

      setSearchResults((prevList) =>
        reset ? newSearchResults : [...prevList, ...newSearchResults]
      );
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
    setIsLoading(false);
  };

  const searchByName = () => {
    setIsSearching(true);
    setSearchPage(0);
    setPage(0);
    setHasMoreSearchResults(true);
    getSearchResults(true);
  };

  const handleInputChange = (event) => {
    setSearchWord(event.target.value);
  };

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoading) {
      if (isSearching) {
        setSearchPage((prevPage) => prevPage + 1);
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0,
    });
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [isLoading]);

  useEffect(() => {
    if (isSearching) {
      getSearchResults();
    } else {
      getReservationList();
    }
  }, [page, searchPage]);

  return (
    <View>
      <Header>전체 상담 관리</Header>
      <Search>
        <input onChange={handleInputChange} type="text" value={searchWord} placeholder="찾으시는 내담자의 이름을 입력해주세요." />
        <button onClick={searchByName}>검색</button>
      </Search>
      <ReservationList>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        (isSearching ? searchResults : reservationList).length > 0 ? (
          (isSearching ? searchResults : reservationList).map(
            (reservation, index) => (
              <div key={index} >
                <Reservation key={index} reservation={reservation} />
                <div ref={observerTarget} style={{ height: "10px" }}></div>
              </div>
            )
          )
        ) : (
          <div>예약된 상담 일정이 없습니다.</div>
            )
        )}
      </ReservationList>
    </View>
  );
}

export default ReservationSpot;
