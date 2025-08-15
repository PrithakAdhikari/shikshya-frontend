import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/useAuth";
import { useTheme } from "../Contexts/useTheme";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  const navbar = {
    title: "Shikshya",
    navItems: [
      {
        title: "Home",
        link: "/",
        requiresAuth: false
      },
      {
        title: "About",
        link: "/about",
        requiresAuth: false
      },
      {
        title: "Instructor",
        link: "/instructor",
        requiresAuth: true,
        callToAction: false,
      },
      {
        title: "Console",
        link: "/dashboard",
        requiresAuth: false,
        callToAction: false,
      },
    ]
  };

  const renderNavItems = () => {
    return navbar.navItems
      .filter(item => !item.requiresAuth || (item.requiresAuth && isAuthenticated() && (user.role === "Instructor" || user.role === "Admin")))
      .map(item => {
        const isCTA = item.callToAction;

        if (!isCTA) {
        return (
        <li key={item.title}>
          <a className="btn bg-transparent hover:bg-[#90a1b954] font-[400] border-0 shadow-none" onClick={() => navigate(item.link)}>{item.title}</a>
        </li>
      )
    } else {
      return (
        <li key={item.title}>
          <a className="btn btn-primary" onClick={() => navigate(item.link)}>{item.title}</a>
        </li>
      )
    }
    });
  };

  // const renderNavItems = (isMobile = false) => {
  // return navbar.navItems
  //   .filter(item => !item.requiresAuth || (item.requiresAuth && isAuthenticated()))
  //   .map((item, index) => {
  //     const isCTA = item.callToAction;

  //     return (
  //       <li key={item.title}>
  //         {isCTA && index === 0 ? (
  //           <button className="btn btn-primary" onClick={() => navigate(item.link)}>
  //             {item.title}
  //           </button>
  //         ) : (
  //           <a onClick={() => navigate(item.link)}>{item.title}</a>
  //         )}
  //       </li>
  //     );
  //   });
  // };
  return (
    <div className="navbar outline-2 outline-slate-400 shadow-2xl top-[1.3rem] md:top-2 z-[100] sticky w-[95%] rounded-3xl mx-auto mt-4 px-4 backdrop-blur-md">
      {/* Left Section: Hamburger Menu */}
      <div className="flex-none md:hidden">
        <div className="dropdown dropdown-start">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 bg-base-200 shadow-xl outline-1 outline-slate-400 rounded-2xl w-52 transition-all duration-200"
          >
            {renderNavItems()}
          </ul>
        </div>
      </div>

      {/* Center Section: Logo */}
      <div className="flex-1 navbar-center">
        <a onClick={() => navigate("/")} className="btn bg-transparent hover:bg-[#90a1b954] border-0 shadow-none text-xl">
          {navbar.title}
        </a>
      </div>

      {/* Right Section */}
      <div className="flex-none">
        <div className="flex items-center gap-2">
          {/* Desktop Nav Items */}
          <ul className="menu menu-horizontal hidden md:flex px-1 gap-x-0.5">
            {renderNavItems()}
          </ul>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              // Sun icon for dark mode (click to switch to light)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              // Moon icon for light mode (click to switch to dark)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Profile"
                  src={
                    isAuthenticated() && user?.profilePicture
                      ? user.profilePicture
                      : "https://cdn-icons-png.flaticon.com/512/12225/12225935.png"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content transform translate-y-1 md:translate-y-2 shadow-xl bg-base-200 rounded-2xl z-[1] mt-3 w-32 p-2 transition-all duration-200"
            >
              {isAuthenticated() ? (
                <>
                  <li>
                    <a className="btn bg-transparent hover:bg-[#90a1b954] font-[400] border-0 shadow-none" onClick={() => navigate(`/profile?p=${user.publicId}`)}>Profile</a>
                  </li>
                  <li>
                    <a className="btn bg-transparent hover:bg-[#90a1b954] font-[400] border-0 shadow-none" onClick={logout}>Logout</a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a className="btn bg-transparent hover:bg-[#90a1b954] font-[400] border-0 shadow-none" onClick={() => navigate("/login")}>Login</a>
                  </li>
                  <li>
                    <a className="btn bg-transparent hover:bg-[#90a1b954] font-[400] border-0 shadow-none" onClick={() => navigate("/register")}>Register</a>
                  </li>
                </>
              )}
            </ul>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Navbar;
