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
const Main = () => {
  const [user, setUser] = useRecoilState(userState);
  useEffect(() => {}, []);
  return (
    <div>
      {user && (
        <div>
          <p>유저정보</p>
          <p>이름 : {user?.name}</p>
          <p>이메일 : {user?.email}</p>
          <p>닉넴 : {user?.nickname}</p>
          <p>입학년도 : {user?.enrolledAt}</p>
          <p>학년{user?.grade}</p>
          <p>반{user?.classNo}</p>
          <p>번호{user?.studentNo}</p>
        </div>
      )}
      <a
        href="https://auth.bssm.kro.kr/oauth?clientId=e8f78fa2&redirectURI=http://localhost:3000/afterLogin"
        class="button accent"
      >
        BSM 계정으로 계속
      </a>
    </div>
  );
};

export default Main;
