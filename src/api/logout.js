import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../store/user";

const logout = async () => {
  await axios.get("/api/oauth/logout");
  const data = {
    isLogin: false,
  };
  localStorage.setItem("userInfo", JSON.stringify(data));
  return data;
};

export default logout;
