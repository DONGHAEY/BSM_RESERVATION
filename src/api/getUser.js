import axios from "axios";

const getUser = async () => {
  let dt;
  try {
    const { data } = await axios.get("/api/user", { withCredentials: true });
    dt = {
      ...data,
      isLogin: true,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      dt = {
        isLogin: false,
      };
    }
  }
  localStorage.setItem("userInfo", JSON.stringify(dt));
  return dt;
};

export default getUser;
