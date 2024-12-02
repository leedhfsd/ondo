import useJoinStore from "../../../store/app/JoinStore";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/app/Button.jsx";
import Input from "../../../components/app/Input";
import camera from "./../../../assets/images/camera.png";
import useAuthStore from "../../../store/app/authStore.js";
import useFcmStore from "../../../store/app/FcmStore.js";
import "./Join.css";
// import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import Error from "./inputError.jsx";
import Swal from "sweetalert2";

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

const JoinForm = () => {
  const nav = useNavigate();
  const mainProfileUrl = "https://d1kbrt3q8264bl.cloudfront.net/profile.png";
  const { error, success } = useJoinStore();
  const { fcmtoken } = useFcmStore();

  const login = useAuthStore((state) => state.login);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [errors, setErrors] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: "",
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file); // 파일의 미리보기 URL 생성
      setPreviewUrl(url); // 미리보기 URL을 상태에 저장
    }
  };

  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // img 클릭 시 input 클릭하도록 함
    }
  };

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
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // URL 객체 해제
      }
    };
  }, [previewUrl]);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: "",
    profileUrl: "",
  });

  const onClickLogin = () => {
    nav("/member/login");
  };

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" }); // 입력 시 해당 필드의 에러 초기화
  };

  const handleGenderSelect = (gender) => {
    setFormData({ ...formData, gender: gender === "여" ? "FEMALE" : "MALE" });
    setErrors({ ...errors, gender: "" }); // 선택 시 에러 초기화
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.length > 18) {
      newErrors.name = "이름은 최대 18글자까지 입력 가능합니다.";
    }
    if (formData.name.length == 0) {
      newErrors.name = "이름을 입력하세요";
    }

    if (formData.nickname.length > 18) {
      newErrors.nickname = "별명은 최대 18글자까지 입력 가능합니다.";
    }
    if (formData.nickname.length == 0) {
      newErrors.nickname = "별명을 입력하세요";
    }

    if (formData.email.length < 5 || formData.email.length > 20) {
      newErrors.email = "아이디는 5글자 이상 20글자 이하로 입력해주세요.";
    }

    if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 최소 8글자 이상이어야 합니다.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (!formData.gender) {
      newErrors.gender = "성별을 선택해주세요.";
    }

    const today = new Date();
    const birthDate = new Date(formData.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (birthDate > today || age > 120) {
      newErrors.birthDate = "잘못된 생년월일입니다. 다시 입력해주세요.";
    }

    if (age < 8) {
      newErrors.birthDate = "8세 미만은 가입 불가합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const join = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.post(`/member/join`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        try {
          const imgFormData = new FormData();
          if (selectedFile) {
            imgFormData.append("data", selectedFile);
          } else if (previewUrl === mainProfileUrl) {
            const emptyFile = new Blob([""], { type: "image/jpeg" });
            imgFormData.append("data", emptyFile, "default.jpg");
          } else {
            const emptyFile = new Blob([""], { type: "image/jpeg" });
            imgFormData.append("data", emptyFile, "empty.jpg");
          }
          const imageRespose = await api.post(
            `/image/upload/MemberProfile/${response.data.data.id}`,
            imgFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (!imageRespose.data.success) {
            Swal.fire({
              icon: "error",
              title: "이미지 업로드에 실패했습니다.",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "오류가 발생했습니다.",
          });
        }
        Swal.fire({
          icon: "success",
          title: "회원가입에 성공했습니다.",
        });
        await login(formData.email, formData.password, fcmtoken);
        await checkAuth();
        nav("/member/story");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "회원가입 중 오류가 발생했습니다.",
      });
    }
  };

  const genderButtonStyle = (selectedGender) => ({
    backgroundColor: formData.gender === selectedGender ? "#61C0BF" : "white",
    color: formData.gender === selectedGender ? "white" : "#61C0BF",
    border: "2px solid #61C0BF",
    padding: "10px 20px",
    margin: "5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  return (
    <div className="scroll">
      <div className="JoinPage">
        <div className="JoinProfile">
          <img
            src={previewUrl || mainProfileUrl}
            alt="프로필 이미지"
            onClick={handleImageDelete}
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center",
              cursor: "pointer",
            }}
          />
          <img
            id="JoinCamera"
            style={{ cursor: "pointer" }}
            src={camera}
            alt="카메라 아이콘"
            onClick={handleImageClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        <form id="JoinForm" onSubmit={join} className="flex flex-col space-y-4">
          <Input
            label="이름"
            placeholder=" 이름을 입력해주세요"
            value={formData.name}
            onChange={handleInputChange("name")}
            labelClassName="text-left"
          />
          {errors.name && <Error message={errors.name} />}

          <Input
            label="별명"
            placeholder=" 별명을 입력해주세요"
            value={formData.nickname}
            onChange={handleInputChange("nickname")}
            labelClassName="text-left"
          />
          {errors.nickname && <Error message={errors.nickname} />}

          <Input
            label="아이디"
            placeholder="아이디를 입력해주세요"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            labelClassName="text-left"
          />
          {errors.email && <Error message={errors.email} />}

          <Input
            label="비밀번호"
            placeholder=" 비밀번호를 입력해주세요"
            type="password"
            value={formData.password}
            onChange={handleInputChange("password")}
            labelClassName="text-left"
          />
          {errors.password && <Error message={errors.password} />}

          <Input
            label="비밀번호 확인"
            placeholder=" 비밀번호를 다시 입력해주세요"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange("confirmPassword")}
            labelClassName="text-left"
          />
          {errors.confirmPassword && <Error message={errors.confirmPassword} />}

          <Input
            label="생년월일"
            placeholder=" 생년월일을 입력해주세요"
            type="date"
            value={formData.birthDate}
            onChange={handleInputChange("birthDate")}
            labelClassName="text-left"
          />
          {errors.birthDate && <Error message={errors.birthDate} />}

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              style={genderButtonStyle("MALE")}
              onClick={() => handleGenderSelect("남")}
            >
              남
            </button>
            <button
              type="button"
              style={genderButtonStyle("FEMALE")}
              onClick={() => handleGenderSelect("여")}
            >
              여
            </button>
          </div>
          {errors.gender && <Error message={errors.gender} />}

          <Button
            text="회원가입하기"
            type="submit Button_PINK"
            onClick={join}
          />
          <p
            onClick={onClickLogin}
            className="cursor-pointer text-center text-sm text-gray-500 mt-4"
          >
            로그인하러가기
          </p>
        </form>
      </div>
    </div>
  );
};

export default JoinForm;
