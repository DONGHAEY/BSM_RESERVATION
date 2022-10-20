import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main/Main";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { useEffect } from "react";
import { userState } from "./store/user";
import axios, { AxiosError } from "axios";
import ServicePage from "./components/Service/Service";

function App() {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    (async () => {
      try {
        setUser({
          ...(await getUserInfo()).data,
          isLogin: true,
        });
      } catch (error) {
        if (error.response?.status === 401) {
          setUser((prev) => ({ ...prev, isLogin: false }));
        }
      }
    })();
  }, []);

  const getUserInfo = () => {
    return axios.get("/api/user", { withCredentials: true });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/service" element={<ServicePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
