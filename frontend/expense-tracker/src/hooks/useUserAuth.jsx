import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../pages/Dashboard/utils/axiosInstance";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return; // If user already exists, do nothing

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/auth/user");
        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        if (isMounted) {
          clearUser();
          setTimeout(() => navigate("/login"), 0);
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [user, updateUser, clearUser, navigate]);

  return { user, updateUser, clearUser };
};
