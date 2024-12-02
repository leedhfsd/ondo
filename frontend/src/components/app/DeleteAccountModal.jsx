import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../../store/app/authStore";
import Swal from "sweetalert2";

const baseUrl = import.meta.env.VITE_BASE_URL;
const api = axios.create({ baseURL: baseUrl, withCredentials: true });

const DeleteAccountModal = ({ isOpen, onClose, baseUrl }) => {
  const [step, setStep] = useState(1);
  const nav = useNavigate();
  const [deleteFormData, setDeleteFormData] = useState({ password: "" });
  const userDelete = useAuthStore((state) => state.userDelete);
  const handlePasswordChange = (e) => {
    setDeleteFormData({ ...deleteFormData, password: e.target.value });
  };

  const handleConfirmDelete = () => {
    setStep(2);
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await userDelete(deleteFormData.password);
      if (response) {
        Swal.fire({
          icon: "success",
          title: "탈퇴가 완료되었습니다",
        });
        nav("/member/main");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "비밀번호가 일치하지 않습니다",
      });
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="delete-account-modal-overlay">
      <div className="delete-account-modal-content">
        {step === 1 ? (
          <>
            <h2 className="delete-account-modal-title">
              정말 탈퇴하시겠습니까?
            </h2>
            <div className="delete-account-modal-button-container">
              <button
                onClick={handleConfirmDelete}
                className="delete-account-modal-button delete-account-modal-button-confirm"
              >
                확인
              </button>
              <button
                onClick={onClose}
                className="delete-account-modal-button delete-account-modal-button-cancel"
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="delete-account-modal-title">
              비밀번호를 다시 입력해주세요
            </h2>
            <input
              type="password"
              value={deleteFormData.password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력하세요"
              className="delete-account-modal-input"
            />
            <div className="delete-account-modal-button-container">
              <button
                onClick={handlePasswordSubmit}
                className="delete-account-modal-button delete-account-modal-button-confirm"
              >
                확인
              </button>
              <button
                onClick={onClose}
                className="delete-account-modal-button delete-account-modal-button-cancel"
              >
                취소
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountModal;
