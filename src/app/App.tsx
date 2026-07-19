import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CampoGirasol from "../pages/CampoGirasol";
import Editor from "../pages/Editor";
import Pagar from "../pages/Pagar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campo" element={<CampoGirasol />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/pagar" element={<Pagar />} />
      </Routes>
    </BrowserRouter>
  );
}
