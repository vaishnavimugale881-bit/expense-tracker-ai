import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../pages/Dashboard/utils/data";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const SideMenu = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Utility to get initials
  const initials = (user?.fullName || "")
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Handler for navigation and logout
  const handleClick = (route) => {
    if (route === "/logout") {
      localStorage.clear();
      if (typeof clearUser === "function") clearUser();
      navigate("/login");
    } else {
      navigate(route);
    }
  };

  return (
    <div className="side-menu flex flex-col items-center p-4 bg-gray-800 text-white h-full">
      <div className="user-block flex flex-col items-center mb-6">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-20 h-20 bg-slate-400 rounded-full mb-2 object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-slate-400 text-gray-900 flex items-center justify-center text-xl font-semibold mb-2">
            {initials || "U"}
          </div>
        )}
        <h5 className="text-gray-300 font-medium leading-6">
          {user?.fullName || ""}
        </h5>
      </div>

      <div className="menu-items w-full">
        {SIDE_MENU_DATA.map((item) => {
          const Icon = item.icon;
          const isValidIcon = typeof Icon === "function";

          return (
            <button
              key={item.id}
              className="w-full flex items-center p-3 mb-2 rounded hover:bg-gray-700 transition"
              onClick={() => handleClick(item.path)}
            >
              <span className="mr-3 text-xl">
                {isValidIcon ? (
                  <Icon />
                ) : (
                  <span>{item.label[0]}</span> // fallback if icon is invalid/undefined
                )}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;
