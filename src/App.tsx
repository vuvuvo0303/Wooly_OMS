import { Route, Routes } from "react-router-dom";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <Routes>
        <Route path="log-in" element={<LoginPage />} />
        <Route path="/*" element={<MainContainter />} />
      </Routes>
    </>
  );
}

export default App;
