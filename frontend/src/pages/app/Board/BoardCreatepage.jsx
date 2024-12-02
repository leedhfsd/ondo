import "./BoardCreatepage.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../components/app/Button";
import Footer from "../../../components/app/Footer";
import useBoardStore from "../../../store/app/useBoardStore";
import useAuthStore from "../../../store/app/authStore";
import LoadingSpinner from "../../../components/app/Spinner";
import Swal from "sweetalert2";
import styled from "styled-components";
const RemovePic = styled.div`
  position: absolute;
  top: 0;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Pic = styled.div`
  position: relative;
`;

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
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

const BoardCreatepage = () => {
  const nav = useNavigate();
  const { currentBoard, setCurrentBoard, createBoard, resetCurrentBoard } =
    useBoardStore();
  const { user } = useAuthStore();
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 상태

  // 새로고침 시, 문제 해결 위해서 checkAuth
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const onClickCancel = () => {
    resetCurrentBoard();
    nav("/member/board");
  };

  useEffect(() => {
    const checkAuthAndSetBoard = async () => {
      await checkAuth();
      setCurrentBoard("member_name", user.nickname);
    };

    checkAuthAndSetBoard();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // 이미지 미리보기 설정
        setCurrentBoard("image", file); // 상태에 파일 설정
      };
      reader.readAsDataURL(file); // 파일을 읽어 DataURL로 변환
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null); // 이미지 미리보기 초기화
    setCurrentBoard("image", null); // 상태에서 파일 제거
    document.getElementById("AddImage").value = null; // input 파일 값 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSpinnerLoading(true);
    try {
      const boardData = {
        title: currentBoard.title,
        content: currentBoard.content,
        member_name: currentBoard.member_name,
      };

      // FormData 객체 생성
      const formData = new FormData();

      if (currentBoard.image) {
        formData.append("data", currentBoard.image);
      } else {
        const emptyFile = new Blob([""], { type: "image/jpeg" });
        formData.append("data", emptyFile, "empty.jpg");
      }

      // 요청 보내기
      const response = await api.post("/board/article", boardData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        // 요청 보내기
        try {
          const imageResponse = await api.post(
            "/board/articleImage/" + response.data.data.id,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (!imageResponse.data.success) {
            Swal.fire({
              icon: "warning",
              title: "이미지 등록에서 오류가 발생했습니다.",
            });
          }
        } catch {
          Swal.fire({
            icon: "warning",
            title: "게시글 업로드가 실패했습니다.",
          });
        }
        console.log("게시글이 성공적으로 생성되었습니다.");
        console.log("서버 응답:", response.data);
        createBoard(); // Zustand store에 게시글 추가
        resetCurrentBoard();
        nav("/member/board/" + response.data.data.id);
      } else if (response.status === 200) {
        await alertModeration(response.data.message);
      } else {
        console.error("예상치 못한 응답:", response.status);
      }
    } catch (error) {
      console.error(
        "게시글 생성 중 오류가 발생했습니다:",
        error.response ? error.response.data : error.message
      );
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        console.error("Headers:", error.response.headers);
      }
    }
    setSpinnerLoading(false);
  };

  return (
    <>
      {spinnerLoading && <LoadingSpinner />}
      <form className="CreateForm" onSubmit={handleSubmit}>
        <div onClick={onClickCancel} style={{ cursor: "pointer" }}>
          X
        </div>
        <div>
          <input
            maxLength={20}
            id="CreateTitle"
            type="text"
            placeholder="Title"
            value={currentBoard.title}
            onChange={(e) => setCurrentBoard("title", e.target.value)}
          />
        </div>
        <textarea
          style={{ marginBottom: "20px" }}
          maxLength={300}
          placeholder="나누고 싶은 이야기를 적어보세요!"
          value={currentBoard.content}
          onChange={(e) => setCurrentBoard("content", e.target.value)}
        ></textarea>
        <div style={{ marginBottom: "20px", display: "flex" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
            />
          </svg>
          <label style={{ marginLeft: "5px" }} htmlFor="AddImage">
            사진추가하기
          </label>
        </div>
        <div className="imgBox">
          {imagePreview && (
            <div>
              <Pic>
                <img
                  src={imagePreview}
                  alt="미리보기"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
                <RemovePic type="button" onClick={handleImageRemove}>
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
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </RemovePic>
              </Pic>
            </div>
          )}
        </div>
        <input
          style={{ display: "none" }}
          id="AddImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <Button text="게시" type="submit" />
      </form>
      <div className="emptybox"></div>
    </>
  );
};

export default BoardCreatepage;
