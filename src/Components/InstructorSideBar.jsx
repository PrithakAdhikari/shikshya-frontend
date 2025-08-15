import { useState } from "react";
import { FaBars, FaCog, FaTachometerAlt, FaBook, FaChartLine, FaDollarSign, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/useAuth";
import { useTheme } from "../Contexts/useTheme";

const InstructorSideBar = ({ children, isCourse = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-base-200 z-50 p-4 pt-6 w-64 transform transition-transform duration-300 backdrop-blur-md ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <button
          onClick={() => navigate("/instructor")}
          className="btn btn-ghost flex flex-col items-start mb-6 w-full"
        >
          <span className="text-xl font-bold leading-none">Shikshya</span>
          <span className="text-sm font-semibold text-primary">
            Instructors
          </span>
        </button>

        {/* Nav Links */}
        <ul className="menu">
          <li>
            <a onClick={() => navigate("/")}> <FaHome /> Home </a>
            <a onClick={() => {
                navigate('/instructor')
                setSidebarOpen(false);
            }} className="font-light text-[1rem] mb-2 flex items-center gap-2">
              <FaTachometerAlt /> Dashboard
            </a>
          </li>
          <li>
            <a onClick={() => {
            navigate('/instructor/courses')
            setSidebarOpen(false);
            }} className="font-light text-[1rem] mb-2 flex items-center gap-2">
              <FaBook /> Courses
            </a>
          </li>
          {/* <li>
            <a className="font-light text-[1rem] mb-2 flex items-center gap-2">
              <FaChartLine /> Analytics
            </a>
          </li> */}
          <li>
            <button
              disabled
              className="text-base-content/40 font-light text-[1rem] mb-8 flex items-center gap-2 cursor-not-allowed"
            >
              <FaDollarSign /> Earn
            </button>
          </li>

        </ul>

        {/* Settings */}
        {/* <div className="mt-8">
          <a className="flex items-center gap-2">
            <FaCog />
            <span className="font-light">Settings</span>
          </a>
        </div> */}
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/10 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="h-screen flex flex-col">
        {/* Top Bar */}
        <div className="sticky top-0 flex justify-between items-center p-4 shadow bg-base-100 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-ghost"
            >
              <FaBars className="text-xl" />
            </button>
            <button
              onClick={() => navigate("/instructor")}
              className="btn btn-ghost flex flex-col items-start ml-[-1rem]"
            >
              <span className="text-xl font-bold leading-none">Shikshya</span>
              <span className="text-sm font-semibold text-primary">
                Instructors
              </span>
            </button>
          </div>

          {/* Theme Toggle + Profile */}
          <div className="flex items-center">
            <button onClick={() => navigate("/create-course")} className="btn btn-ghost">Create</button>
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
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
            <div className="mr-5 dropdown dropdown-end">
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
                      <a
                        className="btn bg-transparent hover:bg-[#90a1b954] font-[400] border-0 shadow-none"
                        onClick={() => navigate(`/profile?p=${user.publicId}`)}
                      >
                        Profile
                      </a>
                    </li>
                    <li>
                      <a
                        className="btn bg-transparent hover:bg-[#90a1b954] font-[400] border-0 shadow-none"
                        onClick={logout}
                      >
                        Logout
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <a
                        className="btn bg-transparent hover:bg-[#90a1b954] font-[400] border-0 shadow-none"
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </a>
                    </li>
                    <li>
                      <a
                        className="btn bg-transparent hover:bg-[#90a1b954] font-[400] border-0 shadow-none"
                        onClick={() => navigate("/register")}
                      >
                        Register
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 ${
            !isCourse ? "overflow-y-auto" : "overflow-y-auto md:overflow-y-hidden"
          } mb-12`}
        >
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSideBar;
