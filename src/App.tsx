import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/Index";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IndexPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;