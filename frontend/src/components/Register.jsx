
import { StateContext } from "@/context/stateContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "sonner";

const RegisterPage = ({ setShow }) => {
  const { backend_url } = useContext(StateContext);
  const [loading, setLoading] = useState(false);
  const [registerData, setregisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setregisterData({ ...registerData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backend_url}/api/v1/user/register`,
        registerData,
      );
      if (data.success) {
        toast.success(data.message || "You are Registered Successfully");
        setShow("login");
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
      <form onSubmit={handleRegister}>
        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          Register
        </h2>

        <input
          type="text"
          placeholder="Username"
          name="name"
          value={registerData.name}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10 text-white 
        placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={registerData.email}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10 text-white 
        placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={registerData.password}
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
          {loading ? "Creating..." : "Create Workspace"}
        </button>

        <p className="text-gray-300 text-sm text-center mt-4">
          Already registered?
          <span
            onClick={() => setShow("login")}
            className="text-cyan-400 cursor-pointer ml-1 hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </>
  );
};

export default RegisterPage;
