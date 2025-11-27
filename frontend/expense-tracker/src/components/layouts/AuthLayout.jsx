import React from "react";
import { LuTrendingUpDown } from "react-icons/lu";

const StatsInfoCard = ({ icon, label, value, color }) => (
  <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-200">
    <div className="w-12 h-12 flex items-center justify-center text-[26px] text-white">
      {icon}
    </div>
    <div>
      <h6 className="text-xs text-gray-500 mb-1">{label}</h6>
      <span className="">{value}</span>
    </div>
  </div>
);

const AuthLayout = ({ children }) => (
  <div className="flex">
    <div className="h-screen md:w-[60vw] w-[60vw] px-12 pt-8 pb-12">
      <h2 className="text-lg font-medium text-black">Expense Tracker</h2>
      {children}
    </div>
    <div className="hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img relative">
      <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute top-7 left-20"></div>
      <div className="w-48 h-48 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-72 left-10"></div>
      <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute bottom-0 -left-20"></div>
      <div className="grid grid-cols-1 z-20 relative">
        <StatsInfoCard
          icon={<LuTrendingUpDown />}
          label="Track Your Income & Expenses"
          value="430,000"
          color="bg-primary"
        />
      </div>
    </div>
  </div>
);

export default AuthLayout;
