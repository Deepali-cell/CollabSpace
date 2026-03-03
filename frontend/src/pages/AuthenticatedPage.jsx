import React, { useState } from "react";
import LoginPage from "../components/Login";
import RegisterPage from "../components/Register";

const AuthenticatedPage = () => {
  const [show, setShow] = useState("login");

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Left colorful glow */}
      <div className="absolute left-[-200px] top-1/4 w-[450px] h-[450px] bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full blur-[150px] opacity-70 animate-pulse"></div>

      {/* Right colorful glow */}
      <div className="absolute right-[-200px] bottom-1/4 w-[450px] h-[450px] bg-gradient-to-br from-teal-400 via-cyan-400 to-yellow-300 rounded-full blur-[150px] opacity-70 animate-pulse delay-200"></div>

      {/* Center glass form */}
      <div
        className="relative z-10 w-[360px] p-8 rounded-2xl 
        bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
      >
        {show === "login" ? (
          <LoginPage setShow={setShow} />
        ) : (
          <RegisterPage setShow={setShow} />
        )}
      </div>
    </div>
  );
};

export default AuthenticatedPage;
