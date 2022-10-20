import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../../store/user";
import { Bell } from "react-feather";
const Header = () => {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.isLogin) navigate("/");
  }, []);
  return (
    <div style={{ width: "100%", height: "65px", backgroundColor: "gray" }}>
      <h3 style={{ float: "left", marginLeft: "30px" }}>BSSM_RES</h3>
      <div style={{ float: "right" }}>
        <p style={{ marginRight: "30px" }}>
          <Bell />
          <img
            width={"22px"}
            height={"22px"}
            style={{ borderRadius: "3rem" }}
            src={"https://cdn-icons-png.flaticon.com/512/14/14660.png"}
          ></img>
        </p>
      </div>
    </div>
  );
};

export default Header;
