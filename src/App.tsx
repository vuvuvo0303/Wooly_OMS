import { Route, Routes } from "react-router-dom";
import MainContainter from "./containers/main-comtainers";
import LoginPage from "./pages/auth/login-page";
import useAuthStore from "./store/AuthStore";
import { useEffect } from "react";
import { checkToken } from "./lib/api/auth-api";
import { toast } from "react-toastify";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchData = async () => {
      const userResult = await checkToken();
      if (userResult.error) {
        toast.error(userResult.error, {
          toastId: "tokenError",
        });
        localStorage.removeItem("accessToken");
      } else {
        setUser(userResult.data ? userResult.data : null);
      }
    };
    if (accessToken) {
      fetchData();
    } else {
      <h1>oh nooo</h1>;
    }
  }, [setUser]);
  return (
    <>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="/*" element={<MainContainter />} />
      </Routes>
    </>
  );
}

export default App;
