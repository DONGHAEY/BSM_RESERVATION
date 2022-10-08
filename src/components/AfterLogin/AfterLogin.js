import { useLocation, useMatches, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { userState } from "../../store/user";

const AfterLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useSetRecoilState(userState);
  // https://auth.bssm.kro.kr/oauth?clientId=e8f78fa2&redirectURI=http://localhost:3000/afterLogin
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery();

  useEffect(() => {
    (async () => {
      let code = query.get("code");
      try {
        const userResponse = await axios.get(`/api/oauth/login?code=${code}`);
        console.log(userResponse.data.user);
        setUser({ ...userResponse.data.user, isLogin: true });
        localStorage.setItem(
          "userInfo",
          JSON.stringify(userResponse.data.user)
        );
        navigate("/");
      } catch (error) {
        alert(error);
        navigate("/");
      }
    })();
  }, []);

  return <div>로딩중..</div>;
};

export default AfterLogin;
