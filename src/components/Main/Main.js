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

  useEffect(() => {
    console.log(user);
  }, []);
  return (
    <div>
      <h1>dd</h1>
      {user.isLogin === false ? (
        <a
          href="https://auth.bssm.kro.kr/oauth?clientId=c53c85eb&redirectURI=http://localhost/api/oauth/bsm"
          class="button accent"
        >
          BSM 계정으로 계속
        </a>
      ) : (
        <a
          onClick={() => {
            navigate("/service");
          }}
          class="button accent"
        >
          서비스로 가기
        </a>
      )}
    </div>
  );
};

export default Main;
