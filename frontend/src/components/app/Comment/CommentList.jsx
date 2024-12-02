import { useEffect, useState, useRef, useCallback } from "react";
import Comment from "./Comment";
import "./CommentList.css";
import useCommentStore from "../../../store/app/CommentStore";

const CommentList = ({ articleId }) => {
  const { comments, getComments } = useCommentStore();
  const [page, setPage] = useState(0); // 현재 페이지를 추적하는 상태
  const observer = useRef(); // IntersectionObserver를 참조하는 변수

  useEffect(() => {
    if (articleId) {
      console.log("he")
      getComments(articleId, page); // 초기 페이지에 대한 댓글을 가져옴
    }
  }, [getComments, articleId, page]);

  const lastCommentRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1); // 페이지 번호를 증가시켜 다음 댓글을 가져오게 함
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {comments.length > 0 ? (
        comments.map((comment, index) => {
          if (comments.length === index + 1) {
            // 마지막 댓글 요소에 ref를 연결
            return (
              <Comment
                ref={lastCommentRef}
                key={comment.id}
                comment={comment}
              />
            );
          } else {
            return <Comment key={comment.id} comment={comment} />;
          }
        })
      ) : (
        <p style={{ textAlign: "center", color: "gray", padding: "20px" }}>
          댓글이 없습니다.
        </p>
      )}
    </div>
  );
};

export default CommentList;
