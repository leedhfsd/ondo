import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/app/authStore";
import axios from "axios";
import useFcmStore from "../../../store/app/FcmStore.js";
const OAuthCallback = () => {
  const nav = useNavigate();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { fcmtoken } = useFcmStore();

  const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
  });

  useEffect(() => {
    // Define an async function inside the useEffect
    const handleAuth = async () => {
      try {
        await checkAuth();
        console.log("hi");
        const response = await api.post(
          "/alarm/fcmtoken",
          { fcmtoken },
          { withCredentials: true }
        );
        nav("/member/home");
      } catch (error) {
        console.error("Authentication failed:", error);
        nav("/member/login"); // Or any error handling logic
      }
    };

    handleAuth();
  }, [checkAuth, nav]); // Add dependencies if any

  return null; // The component doesn't need to render anything
};

export default OAuthCallback;
