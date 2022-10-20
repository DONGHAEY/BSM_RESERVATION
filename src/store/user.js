import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";

const user = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : {
      isLogin: false,
    };

const userState = atom({
  key: "userState",
  default: user,
});

export { userState };
