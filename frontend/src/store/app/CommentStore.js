import { create } from "zustand";
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = import.meta.env.VITE_BASE_URL;
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const alertModeration = async (text) => {
  const alertMessage = await extractType(text);

  Swal.fire({
    icon: "warning",
    title: "부적절한 표현이 감지되었습니다.",
    text: `${alertMessage}`,
  });
};

const extractType = async (text) => {
  const type = text.split(" ")[0].slice(0, -1);
  const score = text.split(" ")[1].slice(2, 4);

  switch (type) {
    case "TOXICITY":
      return `유해성(${type}) ${score}점`;
    case "SEVERE_TOXICITY":
      return `심각한 유해성(${type}) ${score}점`;
    case "INSULT":
      return `모욕(${type}) ${score}점`;
    case "PROFANITY":
      return `욕설(${type}) ${score}점`;
    case "IDENTITY_ATTACK":
      return `인신공격(${type}) ${score}점`;
    case "THREAT":
      return `위협(${type}) ${score}점`;
    default:
      return "오류";
  }
};

const useCommentStore = create((set) => ({
  comments: [],
  currentPage: 1, // 현재 페이지를 상태로 관리
  hasMoreComments: true, // 더 가져올 댓글이 있는지 여부
  addComment: async (comment) => {
    try {
      const response = await api.post("/board/comment", comment);
      if (response.status === 201) {
        const articleId = comment.article_id;
        const commentsResponse = await api.get(`/board/comment/${articleId}`);
        set({
          comments: commentsResponse.data,
          currentPage: 1,
          hasMoreComments: true,
        });
        return true;
      } else if (response.status == 200) {
        await alertModeration(response.data.message);
      }
      return false;
    } catch (error) {
      console.error("댓글 추가 실패:", error);
    }
    return false;
  },
  getComments: async (articleId, page) => {
    try {
      const response = await api.get(
        `/board/comment/${articleId}?page=${page}`
      );
      set({
        comments: response.data.data.comments.content,
        currentPage: 1,
        hasMoreComments: response.data.data.comments.totalPages > 1,
      });
    } catch (error) {
      console.error("댓글 목록 불러오기 실패:", error);
    }
  },
  loadMoreComments: async (articleId) => {
    try {
      set((state) => ({ currentPage: state.currentPage + 1 }));
      const { currentPage, comments } = useCommentStore.getState();
      const response = await api.get(
        `/board/comment/${articleId}?page=${currentPage}`
      );
      const newComments = response.data.data.comments.content;
      set({
        comments: [...comments, ...newComments],
        hasMoreComments: newComments.length > 0,
      });
    } catch (error) {
      console.error("추가 댓글 불러오기 실패:", error);
    }
  },
  deleteComment: async (commentId) => {
    try {
      await api.delete(`/board/comment/${commentId}`);
      set((state) => ({
        comments: state.comments.filter((comment) => comment.id !== commentId),
      }));
      return true;
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      return false;
    }
  },
  updateComment: async (commentId, modifiedContent) => {
    try {
      const response = await api.patch(`/board/comment/${commentId}`, {
        content: modifiedContent,
      });
      if (response.status === 204) {
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, content: modifiedContent }
              : comment
          ),
        }));
        return { success: true };
      } else if (response.status == 200) {
        await alertModeration(response.data.message);
      }

      if (response.data && response.data.success === false) {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
      }
      return { success: false, message: "댓글 수정 중 오류가 발생했습니다." };
    }
  },
}));

export default useCommentStore;
