// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )



import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MatchList from "./pages/MatchList";
import MatchSetup from "./pages/MatchSetup";
import MatchTagging from "./pages/MatchTagging";
import "./index.css";
import MatchSummary from "./pages/MatchSummary";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MatchList />} />
        <Route path="/new" element={<MatchSetup />} />
        <Route path="/match/:matchId" element={<MatchTagging />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/match/:matchId/summary" element={<MatchSummary />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
