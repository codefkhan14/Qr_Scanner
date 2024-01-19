import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Generate from "./routes/Generate";
import Scan from "./routes/Scan";
import backend_ref from "./components/Backend_ref";

function App() {
  console.warn(backend_ref)
  return (
    <> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Generate />} />
          <Route path="/scan-qr" element={<Scan />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
