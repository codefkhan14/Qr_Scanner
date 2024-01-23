import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Scan from "./routes/Scan";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Scan />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
