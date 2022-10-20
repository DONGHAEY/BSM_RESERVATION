import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main/Main";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { userState } from "./store/user";
import ServicePage from "./components/Service/Service";
import getUser from "./api/getUser";

function App() {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    (async () => {
      if (!user.isLogin) {
        setUser({ ...(await getUser()) });
      }
    })();
  }, []);

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
