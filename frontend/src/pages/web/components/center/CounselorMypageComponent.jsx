import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useAuthStore from "../../../../store/app/authStore";
import camera from "../../../../assets/images/camera.png";
// import { useNavigate } from "react-router-dom";
// import { useRef } from "react";
import Swal from "sweetalert2";

const View = styled.div`
  position: relative;
  margin: 0 auto;
  padding: 10px 80px;
  width: 90%;
  // height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 35px;
  font-size: 17px;
`;

const CameraIcon = styled.div`
  position: absolute;
  z-index: 100;
  left: 60%;
  top: 27%;
  & > img {
    width: 47px;
    height: 47px;
  }
`;

// const InfoTag = styled.div`
//   display: flex;
//   flex-direction: column;
// `

const Bold = styled.div`
  font-weight: 600;
  font-size: 22px;
  display: inline-block;
  color: #121481;
`;

const IntroTitle = styled.div`
  display: flex;
  justify-content: space-between;
  // padding-bottom: 10px;
`;

const LiTag = styled.div`
  padding: 5px 0px;
  // padding-left: 7%;
`;

// const Content = styled.div`
//   display: flex;
//   flex-direction: column;
//   text-align: center;
//   gap: 20px;
// `

const Name = styled.div`
  font-size: 35px;
  font-weight: 800;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 30px;
  font-size: 20px;
  // align-items: center;
`;

const IntroductionInput = styled.div`
  border: 2px black solid;
  border-radius: 10px;
  // background-color: gray;
  & textarea {
    border-radius: 10px;
    width: 100%;
    min-height: 10vh;
    height: 30px;
    border: none;
    resize: none;
    padding: 1px 10px;

    // background-color: rgba(255, 255, 255, 0);
  }
  :focus {
    outline: none;
  }
`;

const ProfileImg = styled.div`
  width: 200px;
  height: 200px;
  border: 3px black solid;
  background-color: #fff7f7;
  margin: 0 auto;
  overflow: hidden; // 변경된 부분: " " 제거
  border-radius: 50%; // 변경된 부분: " " 제거
`;

const Tab = styled.div`
  color: #6769ba;
  font-weight: 600;
  // font-size: 36px;
  display: flex;
  gap: 10px;
  margin: 0 auto;
  font-size: 25px;
  padding: 15px 0px;
  & > p:active {
    color: #f7867a;
  }
`;
const baseUrl = import.meta.env.VITE_BASE_URL;
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
const mainProfileUrl = "https://d1kbrt3q8264bl.cloudfront.net/profile.png";

// const nav = useNavigate()

const CounselorMypage = () => {
  const [MyInfo, setMyInfo] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const [info, InfoState] = useState("");
  const [edit, EditState] = useState(false);
  console.log(info);

  const { checkAuth, user } = useAuthStore();

  const [selectedFile, setSelectedFile] = useState(null); // 선택한 이미지 state
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 url state

  const [formData, setFormData] = useState({
    selfIntroduction: "",
  });

  // 수정모드 중에 프로필 이미지를 클릭하면 input태그가 동작하도록 설정
  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // img 클릭 시 input 클릭하도록
    }
  };

  // 이미지를 추가한 경우에만 이미지 담기
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file); // 파일의 미리보기 URL 생성
      setPreviewUrl(url); // 미리보기 URL을 상태에 저장
    }
  };

  const getMyInfo = async () => {
    try {
      const response = await axios.get(`${baseUrl}/counselor/mypage`, {
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`, // 로그인중인 상담사 토큰 보내기
        },
        withCredentials: true, // 쿠키를 포함하여 요청
      });
      if (response.status === 200) {
        console.log("상담사 정보 조회 성공");
        console.log("서버 응답:", response.data);
        setMyInfo(response.data.data.counselor);
        console.log("상담사 정보 확인용", MyInfo); // 맨 처음 로딩 시 바로 채워지지 않음... 채워지는 데 시간이 좀 필요한 듯 함
        setLoading(false); // 데이터 로딩이 끝나면 로딩 상태를 false로 설정
        setFormData({
          selfIntroduction: response.data.data.counselor.selfIntroduction, // 변경된 부분: MyInfo가 아닌 response.data를 사용
        });
        console.log("폼데이터 자기소개", formData.selfIntroduction);
      }
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setLoading(false); // 에러가 발생해도 로딩 상태를 false로 설정
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  //이미지 클릭시 삭제
  const handleImageDelete = async () => {
    const result = await Swal.fire({
      title: "이미지를 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      setPreviewUrl(mainProfileUrl); // '네'를 클릭 시 기본 이미지로 설정
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    getMyInfo();
  }, []);

  //  마이페이지 수정(자기소개 및 프로필 사진)
  const putMyInfo = async () => {
    // Blob 객체는 후에 FormData 객체에 추가 되어
    // JSON 데이터와 파일(ex: 이미지)를 한 번에 전송할 수 있게 해줌
    const userData = {
      password: "",
      selfIntroduction: formData.selfIntroduction,
    };

    const imageData = new FormData();

    if (selectedFile) {
      console.log(selectedFile);
      imageData.append("data", selectedFile);
    } else if (previewUrl === mainProfileUrl) {
      const defaultFile = new Blob([""], { type: "image/jpeg" });
      imageData.append("data", defaultFile, "default.jpg");
    } else {
      const emptyFile = new Blob([""], { type: "image/jpeg" });
      imageData.append("data", emptyFile, "empty.jpg");
    }

    try {
      const response = await axios.put(
        `${baseUrl}/counselor/updateMypage`,
        userData,
        {
          header: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 쿠키를 포함하여 요청
        }
      );
      if (response.data.success) {
        try {
          const imageResponse = await api.post(
            `/counselor/updateImage/CounselorProfile`,
            imageData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (imageResponse.data.success) {
          } else {
            Swal.fire({
              icon: "warning",
              title: "이미지 등록에 실패했습니다.",
            });
          }
        } catch {}
        console.log("마이페이지 수정 완료");
        Swal.fire({
          icon: "success",
          title: "수정이 완료되었습니다.",
        });
        InfoState(""); // 입력창 초기화
        EditState(!edit); // 수정모드 비활성화

        // 여기서 MyInfo 상태를 직접 업데이트함으로써 수정 후 바로 수정된 정보가 보이게 함
        setMyInfo((prev) => ({
          ...prev,
          selfIntroduction: userData.selfIntroduction,
          profileUrl: user.profileUrl, // 프로필 이미지도 업데이트
        }));
        await getMyInfo();
        // nav('/counselor/')
        // nav('/counselor/mypage')
      }
    } catch (err) {
      console.error("에러 발생:", err);
      InfoState(""); // 입력창 초기화
      EditState(!edit); // 수정모드 비활성화
    }
  };

  const onClickEdit = () => {
    setPreviewUrl(null);
    formData.selfIntroduction = MyInfo.selfIntroduction;
    EditState(!edit);
  };

  // 데이터 로딩 중일 때 로딩 메시지 표시
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <View>
      <Tab>마이페이지</Tab>
      {edit ? (
        <div>
          <img
            src={previewUrl || MyInfo.profileUrl || mainProfileUrl} // 기본 프로필 이미지 추가
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              objectPosition: "center",
              cursor: "pointer",
              borderRadius: "50%",
              border: "3px black solid",
              margin: "0 auto",
            }}
            alt="프로필 이미지"
            onClick={handleImageDelete}
          />
          <CameraIcon>
            <img
              // id="updateCamera"
              style={{ cursor: "pointer" }}
              src={camera}
              alt="카메라 아이콘"
              onClick={handleImageClick} // 카메라 아이콘 클릭 시 input 클릭 이벤트 핸들러 호출
            />
          </CameraIcon>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      ) : (
        <img
          src={MyInfo.profileUrl || mainProfileUrl} // 기본 프로필 이미지 추가
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            objectPosition: "center",
            cursor: "pointer",
            borderRadius: "50%",
            border: "3px black solid",
            margin: "0 auto",
          }}
          alt="프로필 이미지"
        />
      )}
      <Name>
        {MyInfo.name} (
        {MyInfo.gender === "FEMALE"
          ? "여"
          : MyInfo.gender === "MALE"
            ? "남"
            : ""}
        )
      </Name>
      <Content>
        <p>
          <Bold>분야:</Bold> {MyInfo.field}
        </p>
        {MyInfo.career.length > 0 ? (
          <ul>
            <Bold>경력:</Bold>
            {MyInfo.career.map((career, index) => (
              <LiTag key={index}>◾ {career}</LiTag>
            ))}
          </ul>
        ) : (
          <div></div>
        )}
        <hr />
        <div>
          <IntroTitle>
            <p>
              <Bold>소개</Bold>
            </p>
            {edit ? (
              <p
                onClick={putMyInfo}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "gray",
                }}
              >
                저장
              </p>
            ) : (
              <p
                onClick={onClickEdit}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "gray",
                }}
              >
                수정
              </p>
            )}
          </IntroTitle>
        </div>
        <div>
          {edit ? (
            <IntroductionInput>
              <textarea
                type="text"
                value={formData.selfIntroduction}
                onChange={handleInputChange("selfIntroduction")}
              />
            </IntroductionInput>
          ) : (
            <div>{MyInfo.selfIntroduction}</div>
          )}
        </div>
        <br />
      </Content>
    </View>
  );
};

export default CounselorMypage;
