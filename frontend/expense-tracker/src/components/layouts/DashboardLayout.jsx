// src/components/layouts/DashboardLayout.jsx
import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
// paste right after the imports in DashboardLayout.jsx
console.log("TYPE CHECK:", {
  Navbar_type: typeof Navbar,
  Navbar_val: Navbar,
  SideMenu_type: typeof SideMenu,
  SideMenu_val: SideMenu,
  children_type: typeof children,
  children_isValidElement: !!(typeof children !== "undefined" && React && React.isValidElement && React.Children)
});


const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const [openSideMenu, setOpenSideMenu] = useState(false);

  console.log("USER:", user);
  console.log("Navbar import:", Navbar);
  console.log("SideMenu import:", SideMenu);

  return (
    <div>
      <Navbar
        activeMenu={activeMenu}
        openSideMenu={openSideMenu}
        setOpenSideMenu={setOpenSideMenu}
      />

      {user && (
        <div className="flex">
          <SideMenu activeMenu={activeMenu} />

          <div className="grow mx-5">{children}</div>

          {openSideMenu && (
            <div
              className="side-menu-overlay fixed top-0 left-0 w-72 h-full bg-white/20 backdrop-blur-xl shadow-2xl z-50 border-r border-violet-200/40 flex flex-col px-4 py-8 transition-all duration-300 ease-in-out"
              onClick={() => setOpenSideMenu(false)}
            >
              <SideMenu activeMenu={activeMenu} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
