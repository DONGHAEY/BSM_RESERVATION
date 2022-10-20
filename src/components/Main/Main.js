import "./Main.css";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { userState } from "../../store/user";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Main = () => {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 style={{ fontSize: "10vw" }}>bsm_reservation</h1>
      {user.isLogin === false ? (
        <div>
          <p>전자 이석증으로 베르실 예약을 간편하게..</p>
          <a
            href="https://auth.bssm.kro.kr/oauth?clientId=c53c85eb&redirectURI=http://localhost/api/oauth/bsm"
            class="button accent"
          >
            BSM 계정으로 계속
          </a>
        </div>
      ) : (
        <div>
          <a
            onClick={() => {
              navigate("/service");
            }}
            class="button accent"
          >
            서비스 이용 시작
          </a>
        </div>
      )}
    </div>
  );
};

export default Main;
