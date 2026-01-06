// File: src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <>
      <Header />
      <Navbar />

      {/* MUST HAVE */}
      <Outlet />

      <Footer />
    </>
  );
}
