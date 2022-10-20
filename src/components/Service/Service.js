import "../Main/Main.css";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import axios from "axios";
import { userState } from "../../store/user";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import logout from "../../api/logout";
const ServicePage = () => {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  const logoutEvent = async () => {
    setUser({ ...(await logout()) });
    navigate("/");
  };
  return (
    <div>
      <Header />
      {user && (
        <div>
          <p>유저정보</p>
          <p>이름 : {user?.name}</p>
          <p>이메일 : {user?.email}</p>
          <p>닉넴 : {user?.nickname}</p>
          {user.role === "STUDENT" && (
            <div>
              <p>입학년도 : {user?.enrolledAt}</p>
              <p>학년{user?.grade}</p>
              <p>반{user?.classNo}</p>
              <p>번호{user?.studentNo}</p>
              <p>역할{user?.role}</p>
            </div>
          )}
        </div>
      )}
      <button onClick={logoutEvent}>로그아웃하기</button>
    </div>
  );
};

export default ServicePage;
