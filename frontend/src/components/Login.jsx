import { stateContext } from "@/context/StateContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginPage = ({ setShow }) => {
  const { backend_url, setAccessToken, setUser } = useContext(stateContext);
  const [loading, setLoading] = useState(false);
  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setloginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backend_url}/api/v1/user/login`,
        loginData,
        {
          withCredentials: true,
        },
      );
      if (data.success) {
        setUser(data.data);
        setAccessToken(data.accessToken);
        navigate("/");
        toast.success(data.message || "You are Login Successfully");
      } else {
        console.log(data.message);
        toast(data.message);
      }
    } catch (error) {
      console.log("register error :", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleLogin}>
        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10 text-white 
        placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-3 rounded-xl bg-white/10 text-white 
        placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-black 
    bg-gradient-to-r from-cyan-400 to-indigo-500 
    hover:scale-105 transition-transform duration-200
    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Joining..." : "Join Workspace"}
        </button>
        <p className="text-gray-300 text-sm text-center mt-4">
          Don't have an account?
          <span
            onClick={() => setShow("register")}
            className="text-cyan-400 cursor-pointer ml-1 hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </>
  );
};

export default LoginPage;
