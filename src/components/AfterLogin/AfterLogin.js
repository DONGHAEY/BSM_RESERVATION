import { useLocation, useMatches, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const AfterLogin = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const location = useLocation();
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
        if (!userResponse.data.user) {
          alert("로그인 실패");
          navigate("/");
        }
        console.log(userResponse.data.user);
        setUser(userResponse.data.user);
      } catch (error) {
        alert(error.response.data.message);
        navigate("/");
      }
    })();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h1>dd</h1>
          <h1>이름 : {user?.username}</h1>
          <h1>이메일 : {user?.email}</h1>
          <h1>닉넴 : {user?.nickname}</h1>
          <h1>입학년도 : {user?.enrolled}</h1>
          <h1>학년{user?.grade}</h1>
          <h1>반{user?.class}</h1>
          <h1>번호{user?.studentNo}</h1>
        </div>
      ) : (
        <div>로딩중..</div>
      )}
    </div>
  );
};

export default AfterLogin;
