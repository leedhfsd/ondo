import "./Comment.css";
import { useState } from "react";
import useCommentStore from "../../../store/app/CommentStore";
import useAuthStore from "../../../store/app/authStore";
import Swal from "sweetalert2";
const mainProfileUrl = "https://d1kbrt3q8264bl.cloudfront.net/profile.png";

const Comment = ({ comment }) => {
  const { deleteComment, updateComment } = useCommentStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { user } = useAuthStore();

  const isAuthor = user && user.id.toString() === comment.member_id;

  const onClickCommentDelete = async () => {
    if (isAuthor) {
      const result = await Swal.fire({
        title: "정말로 이 댓글을 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      });

      if (result.isConfirmed) {
        const success = await deleteComment(comment.id, user.id);
        Swal.fire({
          title: "댓글 삭제 완료",
          icon: "success",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "작성자만 삭제할 수 있습니다.",
      });
    }
  };

  const onClickCommentEdit = () => {
    if (isAuthor) {
      setIsEditing(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "댓글 작성자만 수정할 수 있습니다.",
      });
    }
  };

  const onSaveEdit = async () => {
    if (isAuthor) {
      const result = await updateComment(comment.id, editedContent, user.id);
      if (result.success) {
        setIsEditing(false);
        console.log("댓글 수정 완료");
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "댓글 작성자만 수정할 수 있습니다..",
      });
    }
  };

  return (
    <div className="CommentCard">
      <div className="CommentWriter">
        <div style={{ width: "50%" }}>
          <img
            src={comment.member_url || mainProfileUrl}
            alt={`${comment.memberName} 프로필`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = mainProfileUrl;
            }}
          />
          <p>{comment.memberName}</p>
        </div>
        {/* 수정 및 삭제 버튼을 작성자에게만 보이도록 */}
        {isAuthor && (
          <div
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div>
              <p
                onClick={onClickCommentEdit}
                style={{ cursor: "pointer", fontSize: "12px" }}
              >
                수정
              </p>
              <p
                onClick={onClickCommentDelete}
                style={{ cursor: "pointer", fontSize: "12px" }}
              >
                삭제
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="CommentContent">
        {isEditing ? (
          <div>
            <textarea
              maxLength={100}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              style={{
                width: "100%",
                minHeight: "50px",
                border: "1px solid #6ABFB4",
                borderRadius: "5px",
                padding: "5px",
                marginBottom: "10px",
                resize: "vertical",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span
                onClick={onSaveEdit}
                style={{
                  cursor: "pointer",
                  marginRight: "10px",
                  color: "#6ABFB4",
                }}
              >
                저장
              </span>
              <span
                onClick={() => setIsEditing(false)}
                style={{ cursor: "pointer", color: "gray" }}
              >
                취소
              </span>
            </div>
          </div>
        ) : (
          <div id="CommentContent">{comment.content}</div>
        )}
        <p id="CommentCreateDate">
          {/* UTC 세팅 - toLocaleString() 단지 표시 목적으로만 시간대를 변환할 뿐, 실제 저장된 시간 값은 변경X */}
          {new Date(comment.createdAt).toLocaleString("ko-KR", {
            // year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            // seconds: '2-digit', 이거 빼면 초는 안 나옴
            timeZone: "Asia/Seoul", // 이 옵션을 추가하여 확실하게 한국 시간으로 표시
          })}
        </p>
      </div>
    </div>
  );
};

export default Comment;
