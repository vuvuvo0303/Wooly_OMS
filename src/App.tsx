import { Route, Routes } from "react-router-dom";
import MainContainter from "./containers/main-comtainers";
import LoginPage from "./pages/auth/login-page";

function App() {
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
