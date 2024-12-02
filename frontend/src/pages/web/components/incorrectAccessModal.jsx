import Modal from "react-modal";
import styled from "styled-components";
import useAuthStore from "../../../store/app/authStore";

Modal.setAppElement("#root"); // 모달이 애플리케이션의 루트 엘리먼트에 렌더링되도록 설정

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  h2 {
    font-size: 20px;
    color: ${({ role }) => (role === "COUNSELOR" ? "white" : "white")};
  }
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  background-color: ${({ role }) =>
    role === "COUNSELOR" ? "#3b3a83" : "#f7867a"};
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: ${({ role }) =>
      role === "COUNSELOR" ? "#2a2a5e" : "#bc675e"};
  }
`;

const IncorrectAccessModal = ({ isOpen, closeModal }) => {
  const { role, user } = useAuthStore((state) => ({
    role: state.role,
    user: state.user,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="잘못된 접근"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          backgroundColor: role === "COUNSELOR" ? "#3b3a83" : "#f7867a",
          color: "white",
        },
        overlay: {
          backgroundColor: "#fff4e4",
          zIndex: 1000,
        },
      }}
    >
      <ModalContent role={role}>
        <h2>잘못된 접근입니다.</h2>
        <ModalButton role={role} onClick={closeModal}>
          확인
        </ModalButton>
      </ModalContent>
    </Modal>
  );
};

export default IncorrectAccessModal;
