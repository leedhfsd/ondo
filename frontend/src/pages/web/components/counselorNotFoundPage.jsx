import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/app/authStore";
import IncorrectAccessModal from "./incorrectAccessModal";

export default function CounselorNotFoundPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { role } = useAuthStore((state) => ({
    role: state.role,
  }));
  const closeModal = async () => {
    console.log("hi");
    setIsModalOpen(false);

    if (!role) {
      navigate("/");
    } else if (role && role == "USER") {
      navigate("/member/home");
    } else if (role && role == "COUNSELOR") {
      navigate("/counselor");
    }
  };
  return <IncorrectAccessModal isOpen={isModalOpen} closeModal={closeModal} />;
}
