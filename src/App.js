import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AfterLogin from "./components/AfterLogin/AfterLogin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/afterLogin" element={<AfterLogin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
