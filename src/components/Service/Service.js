import "../Main/Main.css";
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
const ServicePage = () => {
  const [user, setUser] = useRecoilState(userState);

  const teacherInfo =
    user.role === "TEACHER" &&
    user?.incharged.map((incharge, idx) => {
      return (
        <div style={{ backgroundColor: "gainsboro" }} key={idx}>
          <p>담당 : {incharge.inChargeType}</p>
        </div>
      );
    });

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
          <p>역할{user?.role}</p>
          {user?.role === "TEACHER" && <div>{teacherInfo}</div>}
        </div>
      )}
    </div>
  );
};

export default ServicePage;
