import { create } from "zustand";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

const useBoardStore = create((set, get) => ({
  // 게시글 목록
  boards: [],

  // 페이지네이션 정보
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
  },

  // 현재 편집 중인 게시글
  currentBoard: {
    id: null,
    title: "",
    content: "",
    member_name: "",
    image: null,
  },

  // 상태 추가
  currentViewArticle: null,
  isLoadingArticle: false,
  articleError: null,

  // 게시글 목록 설정 (API 응답 구조에 맞게 수정)
  setBoards: (response) => {
    //console.log('setBoards 호출됨:', response); // 이 부분을 추가
    set((state) => {
      if (
        response &&
        response.boardList &&
        Array.isArray(response.boardList.content)
      ) {
        // console.log('새로운 boards 상태:', response.boardList.content);
        return {
          boards: response.boardList.content,
          pagination: {
            currentPage: response.boardList.number || 0,
            totalPages: response.boardList.totalPages || 0,
            totalItems: response.boardList.totalElements || 0,
          },
        };
      }
      console.log("유효하지 않은 응답, 빈 배열 반환"); // 이 부분을 추가
      return { boards: [] };
    });
  },

  setSearchBoards: (response) => {
    //console.log('setSearchBoards 호출됨:', response); // 이 부분을 추가
    set((state) => {
      if (
        response &&
        response.boardList &&
        Array.isArray(response.boardList)
      ) {
        console.log('새로운 boards 상태:', response.boardList);
        return {
          boards: [...response.boardList],
          pagination: {
            currentPage: response.boardList.number || 0,
            totalPages: response.boardList.totalPages || 0,
            totalItems: response.boardList.totalElements || 0,
          },
        };
      }
      console.log("유효하지 않은 응답, 빈 배열 반환"); // 이 부분을 추가
      return { boards: [] };
    });
  },

  toggleBoards: () => {
      set((state) => {
        const { boards } = get();
        const reversedArray = [...boards].reverse();
        return{
          boards: [...reversedArray]
        }
      })
  },

  // 현재 게시글 필드 설정
  setCurrentBoard: (field, value) =>
    set((state) => ({
      currentBoard: { ...state.currentBoard, [field]: value },
    })),

  setCurrentViewArticle: (field, value) =>
    set((state) => ({
      currentViewArticle: { ...state.currentViewArticle, [field]: value },
    })),

  deleteCurrentImage: (newImage) =>
    set((state) => ({
      currentBoard: {
        ...state.currentBoard, // 기존의 currentBoard 속성 유지
        imageUrl: newImage, // image 속성만 업데이트
      },
    })),

  // 게시글 생성
  createBoard: () => {
    const { currentBoard, boards } = get();
    const newBoard = {
      ...currentBoard,
      id: Date.now(), // 임시 ID 생성 방식
      createdAt: new Date().toISOString(),
    };
    set({
      boards: [...boards, newBoard],
      currentBoard: {
        id: null,
        title: "",
        content: "",
        member_name: "",
        image: null,
      },
    });
  },

  // 게시글 수정
  updateBoard: (id) => {
    const { currentBoard, boards } = get();
    set({
      boards: boards.map((board) =>
        board._id === id
          ? { ...board, ...currentBoard, updatedAt: new Date().toISOString() }
          : board
      ),
      currentBoard: {
        id: null,
        title: "",
        content: "",
        member_name: "",
        image: null,
      },
    });
  },

  // 게시글 삭제
  deleteBoard: (id) =>
    set((state) => ({
      boards: state.boards.filter((board) => board._id !== id),
    })),

  // 게시글 불러오기 (수정을 위해)
  loadBoard: (id) => {
    const { boards } = get();
    const boardToEdit = boards.find((board) => board._id === id);
    if (boardToEdit) {
      set({ currentBoard: { ...boardToEdit } });
    }
  },

  // 현재 게시글 초기화
  resetCurrentBoard: () =>
    set({
      currentBoard: {
        id: null,
        title: "",
        content: "",
        member_name: "",
        image: null,
      },
    }),

  // 페이지네이션 정보 업데이트 (필요한 경우 사용)
  updatePagination: (paginationInfo) =>
    set({
      pagination: {
        ...get().pagination,
        ...paginationInfo,
      },
    }),

  getArticleDetail: async (articleId) => {
    set({ isLoadingArticle: true, articleError: null });
    try {
      // 잘 조회되어서 주석처리
      // console.log('Getting article:', articleId);
      const response = await api.get(`/board/${articleId}`);
      console.log('Article data:', response.data);
      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        response.data.data.board
      ) {
        set({
          currentViewArticle: response.data.data.board,
          isLoadingArticle: false,
          articleError: null,
        });
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error getting article detail:", error);
      set({
        currentViewArticle: null,
        isLoadingArticle: false,
        articleError: error.response
          ? error.response.data.message
          : error.message,
      });
    }
  },

  // 컴포넌트 언마운트, 에러, 페이지 전환 시 데이터 의 초기화를 위한 것
  resetCurrentViewArticle: () =>
    set({
      currentViewArticle: null,
      isLoadingArticle: false,
      articleError: null,
    }),
}));

export default useBoardStore;
