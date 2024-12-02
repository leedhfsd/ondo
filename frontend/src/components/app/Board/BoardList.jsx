import {
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import axios from "axios";
import "./BoardList.css";
import useBoardStore from "../../../store/app/useBoardStore";
import Board from "./Board";

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

const BoardList = forwardRef((props, ref) => {
  const {
    boards,
    setSearchBoards,
    setBoards,
    pagination,
    updatePagination,
    toggleBoards,
  } = useBoardStore();
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");

  const updateBoard = async (text) => {
    try {
      if (text === "") {
        setIsLoading(true);
        try {
          const res = await api.get(
            `/board/list?page=${pagination.currentPage}&size=10`
          );
          if (res.data && res.data.data) {
            setBoards(res.data.data);
          } else {
            console.error("Unexpected API response structure:", res.data);
            setBoards({ boardList: { content: [] } });
          }
        } catch (error) {
          console.error("게시글 목록을 가져오는데 실패했습니다:", error);
          setBoards({ boardList: { content: [] } });
        } finally {
          setIsLoading(false);
        }
        return;
      }
      const response = await api.get(`/board/search?searchWord=${text}`);
      if (response.data && response.data.data) {
        setSearchBoards(response.data.data);
      } else {
        setSearchBoards({ boardList: { content: [] } });
      }
    } catch (error) {
      console.log(error);
      setSearchBoards({ boardList: { content: [] } });
    }
  };

  const toggleSortBy = async () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    await toggleBoards();
  };

  useImperativeHandle(ref, () => ({
    triggerUpdateBoard: updateBoard,
    triggerToggleSortBy: toggleSortBy,
  }));

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(
          `/board/list?page=${pagination.currentPage}&size=10`
        );
        console.log('게시글 res',res)
        if (res.data && res.data.data && res.data.data.boardList) {
          setBoards(res.data.data);
          updatePagination({
            currentPage: res.data.data.boardList.number || 0,
            totalPages: res.data.data.boardList.totalPages || 0,
            totalItems: res.data.data.boardList.totalElements || 0,
          });
        } else {
          console.error("Unexpected API response structure:", res.data);
          setBoards([]);
        }
      } catch (error) {
        console.error("게시글 목록을 가져오는데 실패했습니다:", error);
        setBoards([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoards();
  }, [pagination.currentPage, setBoards, updatePagination]);

  const sortedBoards = useMemo(() => {
    if (!Array.isArray(boards)) return [];
    const sorted = [...boards].sort((a, b) => {
      // created_at, createdAt 모두 처리
      const dateA = new Date(a.created_at || a.createdAt || 0);
      const dateB = new Date(b.created_at || b.createdAt || 0);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [boards, sortOrder]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="BoardList">
      {sortedBoards.length > 0 ? (
        <>
          {sortedBoards.map((article) => (
            <Board key={article._id} article={article} />
          ))}
          <br />
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() =>
                updatePagination({
                  currentPage: Math.max(0, pagination.currentPage - 1),
                })
              }
              disabled={pagination.currentPage === 0}
            >
              &lt;
            </button>
            <span>
              페이지 {pagination.currentPage + 1} / {pagination.totalPages}
            </span>
            <button
              className="pagination-button"
              onClick={() =>
                updatePagination({
                  currentPage: Math.min(
                    pagination.totalPages - 1,
                    pagination.currentPage + 1
                  ),
                })
              }
              disabled={pagination.currentPage === pagination.totalPages - 1}
            >
              &gt;
            </button>
          </div>
        </>
      ) : (
        <p>게시글이 없습니다.</p>
        // <p>게시글이 없습니다. (boards: {JSON.stringify(boards)})</p>
      )}
    </div>
  );
});

// 컴포넌트에 displayName 설정
BoardList.displayName = "BoardList";

export default BoardList;
