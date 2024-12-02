import "./BoardCreatepage.css";
import useBoardStore from "../../../store/app/useBoardStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../../store/app/authStore";
import Button from "../../../components/app/Button";
import LoadingSpinner from "../../../components/app/Spinner";
import Swal from "sweetalert2";

const BoardUpdatepage = () => {
  const nav = useNavigate();
  const {
    currentViewArticle,
    getArticleDetail,
    setCurrentViewArticle,
    isLoadingArticle,
    articleError,
  } = useBoardStore();

  const checkAuth = useAuthStore((state) => state.checkAuth);
  // URL기반으로 ID를 가져옴
  const location = useLocation();
  const pathSegments = location.pathname.split("/"); // ['member', 'board', '66b55850f1dbc46fda08593b', 'update']
  const id = pathSegments[3]; // index 2 is '66b55850f1dbc46fda08593b'

  const [spinnerLoading, setSpinnerLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
  });

  const [imgName, setImgName] = useState("");

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

  useEffect(() => {
    // 새로고침 시 유저 undefined 문제 해결 위해서
    checkAuth();
  }, [id]);

  useEffect(() => {
    const loadAndProcessBoard = async (id) => {
      await getArticleDetail(id);
    };

    if (id) {
      loadAndProcessBoard(id);
    }
  }, []);

  useEffect(() => {
    if (currentViewArticle) {
      setImgName(extractAndDecodePath(currentViewArticle.imageUrl, "board"));
    }
  }, [currentViewArticle]);

  if (isLoadingArticle) {
    return <div>로딩 중...</div>;
  }

  if (articleError) {
    return <div>에러 발생: {articleError}</div>;
  }

  if (!currentViewArticle) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const onClickCancel = () => {
    nav(-1); // 바로 이전 페이지로 이동
  };

  const updateBoard = async () => {
    const boardData = {
      title: currentViewArticle.title,
      content: currentViewArticle.content,
    };

    // FormData 객체 생성
    const formData = new FormData();

    if (currentViewArticle.image) {
      formData.append("data", currentViewArticle.image);
    } else {
      const emptyFile = new Blob([""], { type: "image/jpeg" });
      formData.append("data", emptyFile, "empty.jpg");
    }

    // 요청 보내기
    try {
      const response = await api.patch("/board/" + id, boardData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        const imageResponse = await api.patch(
          "/board/articleImage/" + id,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (imageResponse.data.success) {
        } else {
          Swal.fire({
            icon: "error",
            title: "이미지 등록에 실패했습니다.",
          });
        }

        console.log("게시글 수정 성공.");
      } else if (response.status === 200) {
        await alertModeration(response.data.message);
      } else {
        console.error("예상치 못한 응답:", response.status);
      }
    } catch {}
  };

  const onClickUpdate = async (event) => {
    event.preventDefault();

    setSpinnerLoading(true);
    try {
      await updateBoard();
      nav(`/member/board/${id}`); // 바로 이전 페이지로 이동
    } catch {}
    setSpinnerLoading(false);
  };

  const extractAndDecodePath = (url, dirName) => {
    try {
      if (typeof url !== "string") {
        url = String(url);
      }

      // ".com/" 이후의 경로 추출
      let startIndex = url.indexOf(dirName + "/");
      // if (startIndex === -1) {
      //   throw new Error("Invalid directory name in URL");
      // }
      let path = url.substring(startIndex);

      // 경로 전체를 URL 디코딩
      let decodedPath = decodeURIComponent(path);
      let underscoreIndex = decodedPath.indexOf("_");
      if (underscoreIndex !== -1) {
        decodedPath = decodedPath.substring(underscoreIndex + 1);
      }

      return decodedPath;
    } catch (e) {
      console.log(e);
      return "";
    }
  };

  return (
    <>
      {spinnerLoading && <LoadingSpinner />}
      <form className="CreateForm">
        <div className="CF-Title">
          <input
            maxLength={20}
            id="CreateTitle"
            type="text"
            value={currentViewArticle.title}
            onChange={(e) => setCurrentViewArticle("title", e.target.value)}
          />
          <p onClick={onClickCancel} style={{ cursor: "pointer" }}>
            X
          </p>
        </div>
        <textarea
          maxLength={300}
          name=""
          id=""
          value={currentViewArticle.content}
          onChange={(e) => setCurrentViewArticle("content", e.target.value)}
        ></textarea>

        <label>{"기존 파일 : " + imgName}</label>
        <div id="deleteOriginFile" style={{ fontSize: "small" }}>
          수정시 기존의 파일은 사라집니다.
        </div>
        <input
          id="AddImage"
          type="file"
          accept="image/*"
          onChange={(e) => setCurrentViewArticle("image", e.target.files[0])}
        />
        {/* <button onClick={onClickUpdate}>수정</button> */}
        <Button text={"수정"} onClick={onClickUpdate} />
      </form>
      <div className="emptybox"></div>
    </>
  );
};

export default BoardUpdatepage;
