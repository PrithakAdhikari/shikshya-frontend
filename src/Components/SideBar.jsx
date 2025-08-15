import { useState, useEffect } from "react";
import { FaBars, FaCog, FaSearch, FaHome, FaFire, FaEye, FaTachometerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/useAuth";
import { useTheme } from "../Contexts/useTheme";
import { useSearch } from "../Contexts/useSearch";

const SideBar = ({ children, isCourse = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  const { searchText, setSearchText } = useSearch();

  useEffect(() => {
    console.log(user);
  }, [user])

  const instructors = [
    {
        username: "Prithak",
        profilePicture: "https://i.pinimg.com/736x/c1/21/9b/c1219b3b15b5a5dc06b3bd7be5019df3.jpg",
    },
    {
        username: "Prism",
        profilePicture: "https://i.pinimg.com/736x/29/16/72/2916721b0d6ae30771f952dc11852407.jpg",
    },
    {

        username: "Azoth",
        profilePicture: "https://i.pinimg.com/736x/71/52/a6/7152a62fd461039a474d64cfb4cb8ed1.jpg",
    },
    {
        username: "Schiße",
        profilePicture: "https://i.pinimg.com/736x/44/d8/25/44d82592971e1bfda28732d09592122a.jpg",
    }
  ]

  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Sidebar Overlay */}
      <div
        className={`fixed top-0 left-0 h-full bg-base-200 z-50 p-4 pt-6 w-64 transform transition-transform duration-300 backdrop-blur-md ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo */}
          <button onClick={() => navigate("/dashboard")} className="btn btn-ghost text-2xl font-bold mb-6 mx-auto w-full">Shikshya</button>

          {/* Nav Links */}
          <ul className="menu">
            <li><a onClick={() => navigate("/")} className="font-light text-[1rem] mb-2"><FaHome />Main Menu</a></li>
            <li><a onClick={() =>{
              navigate("/dashboard")
              setSidebarOpen(false);
              }} className="font-light text-[1rem] mb-2"><FaTachometerAlt />Dashboard</a></li>
            <li><a onClick={() => {
              navigate("/dashboard/trending");
              setSidebarOpen(false);
            }} className="font-light text-[1rem] mb-2"><FaFire />Trending Courses</a></li>
            <li><button onClick={() => {
              if (isAuthenticated()) {
                navigate("/dashboard/liked")
                setSidebarOpen(false);
              }
              }} className={isAuthenticated() ? `font-light mb-8 text-[1rem]`: `font-light mb-8 text-[1rem] text-base-content/40 cursor-not-allowed`}><FaEye />Liked Courses</button></li>
            {/* <li><a className="font-semibold text-[1rem]">Followed Instructors</a></li> */}

            {/* Followed Instructors Avatars */}
            {/* {instructors.map((instructor, idx) => (
              <li key={idx}>
                <div className="flex items-center gap-3">
                  <div className="avatar size-10">
                    <img src={instructor.profilePicture} className="rounded-full object-contain"></img>
                  </div>
                  <div className="flex-1">{instructor.username}</div>
                </div>
              </li>
            ))} */}
          </ul>
        </div>

        {/* Settings */}
        {/* <div className="mt-8">
          <a className="flex items-center gap-2">
            <FaCog />
            <span className="font-light">Settings</span>
          </a>
        </div> */}
      </div>

      {/* Overlay Click Area */}
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
            <button onClick={() => setSidebarOpen(true)} className="btn btn-ghost">
              <FaBars className="text-xl" />
            </button>
            <button onClick={() => navigate("/dashboard")} className="btn btn-ghost text-2xl font-bold transform ml-[-1rem]">Shikshya</button>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block w-full max-w-2xl">
            <input
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value) }}
              type="text"
              placeholder="Search..."
              className="input input-bordered w-full"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center">
            {/* Mobile Search Button */}
            <div className="md:hidden">
              <button className="btn btn-ghost" onClick={() => setShowSearch(!showSearch)}>
                <FaSearch className="text-lg" />
              </button>
            </div>

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

        {/* Mobile search input */}
        {showSearch && (
          <div className="md:hidden px-4 py-2 bg-base-100 sticky top-[4.5rem] z-20">
            <input
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value) }}
              type="text"
              placeholder="Search..."
              className="input input-bordered w-full"
            />
          </div>
        )}

        {/* Scrollable Content Including Topbar */}
        <div className={`flex-1 ${!isCourse ? 'overflow-y-auto' : 'overflow-y-auto md:overflow-y-hidden'} mb-12`}>
          <div className="p-2 md:p-4 lg:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
