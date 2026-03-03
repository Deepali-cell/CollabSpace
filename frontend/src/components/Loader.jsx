import React from "react";

const Loader = ({ title }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      <p className="mt-4 text-gray-600 font-medium">{title}</p>
    </div>
  );
};

export default Loader;
