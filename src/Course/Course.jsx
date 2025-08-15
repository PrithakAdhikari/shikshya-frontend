import { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { FiHeart } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

import { useTheme } from "../Contexts/useTheme";
import ReactMarkdownComponent from "../Components/ReactMarkdownComponent";
import { useAuth } from "../Contexts/useAuth";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const CoursePage = ({ course }) => { 
  const [activeIndex, setActiveIndex] = useState(0);
  const [likesCount, setLikesCount] = useState(course.likes || 0);
  const [liked, setLiked] = useState(course.liked || false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { isDark } = useTheme();
  const { user, isAuthenticated, authAxios } = useAuth(); // Add useAuth hook
  
  const dropdownRef = useRef(null);
  const contentRef = useRef(null);
  const viewTimeoutRef = useRef(null);
  const currentSection = course.curriculum[activeIndex];

  const navigate = useNavigate();
  
  const handleLikeOrUnlike = async () => {
    if (!isAuthenticated()) {
      toast.error("You need to be logged in to Like.");
      return;
    }

    try {
      const url = liked
        ? `${API_URL}api/courses/decrease-likes?c=${course.publicId}`
        : `${API_URL}api/courses/increase-likes?c=${course.publicId}`;

      const response = await authAxios.patch(url);

      if (response.status === 200) {
        // Update local state with returned likes count if provided
        if (response.data.likes !== undefined) {
          setLikesCount(response.data.likes);
        } else {
          setLikesCount(prev => liked ? Math.max(prev - 1, 0) : prev + 1);
        }
        setLiked(!liked);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update like status.");
    }
  };

  // Function to get or create anonymous user ID
  const getOrCreateAnonymousId = () => {
    const cookieName = 'anonymous_user_id';
    const existingCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${cookieName}=`));
    
    if (existingCookie) {
      return existingCookie.split('=')[1];
    }
    
    // Create new UUID and set cookie
    const anonymousId = uuidv4();
    // Set cookie to expire in 1 year
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    document.cookie = `${cookieName}=${anonymousId}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
    
    return anonymousId;
  };

  // Function to track page view
  // Function to track page view with 24-hour expiry
  const trackPageView = async () => {
    try {
      console.log("Attempting to Count View.");
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;

      // Get list from localStorage or create empty array
      let viewedCourses = JSON.parse(localStorage.getItem("viewCounted") || "[]");

      // Filter out any expired entries
      viewedCourses = viewedCourses.filter(entry => now - entry.timestamp < oneDayMs);

      // Check if this course is already in the list
      const alreadyViewed = viewedCourses.some(entry => entry.publicId === course.publicId);
      if (alreadyViewed) {
        console.log(`View for ${course.publicId} already counted within 24h.`);
        return;
      }

      const userId = isAuthenticated && user?.id ? user.id : getOrCreateAnonymousId();

      await axios.get(`${API_URL}redis/views?publicCourseId=${course.publicId}&userId=${userId}`);

      // Add new view with timestamp
      viewedCourses.push({ publicId: course.publicId, timestamp: now });

      // Save updated list back to localStorage
      localStorage.setItem("viewCounted", JSON.stringify(viewedCourses));

    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };


  // Track page view after 3 seconds
  useEffect(() => {
    // Clear any existing timeout
    if (viewTimeoutRef.current) {
      clearTimeout(viewTimeoutRef.current);
    }
    
    // Set new timeout for 3 seconds
    viewTimeoutRef.current = setTimeout(() => {
      trackPageView();
    }, 3000);
    
    // Cleanup timeout on unmount
    return () => {
      if (viewTimeoutRef.current) {
        clearTimeout(viewTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array means this only runs once on mount

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const lightThemeHref = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
    const darkThemeHref = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css";

    const existingLink = document.querySelector("link[data-hljs-theme]");
    if (existingLink) existingLink.remove();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.setAttribute("data-hljs-theme", "true");
    link.href = isDark ? darkThemeHref : lightThemeHref;
    document.head.appendChild(link);

    return () => {
        const linkToRemove = document.querySelector("link[data-hljs-theme]");
        if (linkToRemove) linkToRemove.remove();
    };
    }, [isDark]);

  return (
    <div className="h-screen w-full bg-base-200 p-4 overflow-hidden">
      {/* ====== MOBILE: Course Info ====== */}
      <div className="md:hidden mb-4 px-2">
         {/* Instructor Info */}
            <div onClick={() => { navigate(`/profile?p=${course.instructor.publicId}`) }} className="flex items-center gap-3 mb-2 cursor-pointer">
              <img
                src={course.instructor.profilePicture}
                alt={`${course.instructor.username}'s profile`}
                className="rounded-full size-12"
              />
              <p className="text-base-content/40 hover:text-primary/70 transition-colors duration-200 ease-in-out">{course.instructor.username}</p>
            </div>
        <h1 className="text-xl font-bold">{course.title}</h1>
        <div className="flex justify-between items-center">
        <p className="text-sm text-base-content/50 flex-1">{course.desc}</p>
        <div className="ml-4 flex space-x-4 text-base-content/30">
          <button
              onClick={handleLikeOrUnlike}
              aria-label="Like or unlike course"
              className="flex items-center cursor-pointer px-2 py-1 rounded hover:text-red-400 transition-colors duration-200 ease-in-out"
            >
              <FiHeart
                className="mr-1"
                fill={liked ? "oklch(70.4% 0.191 22.216)": "var(--color-base-200)"}
              />
              <span className="font-light">{likesCount.toLocaleString()}</span>
            </button>
        </div>
      </div>
      </div>

      {/* ====== MOBILE: Hamburger ====== */}
      <div className="md:hidden mb-4 left-4 top-4" ref={dropdownRef}>
        <div className="relative">
          <button
            className="btn btn-circle btn-secondary shadow-lg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </button>

          {menuOpen && (
            <div className="absolute mt-2 w-64 bg-base-100 rounded-lg shadow z-50 p-4 space-y-2">
              {course.curriculum.map((section, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveIndex(idx);
                    setMenuOpen(false);
                    if (contentRef.current) {
                        contentRef.current.scrollTop = 0;
                    }
                  }}
                  className={`flex items-center gap-3 cursor-pointer px-2 py-1 rounded-lg transition-all ${
                    activeIndex === idx
                      ? "bg-secondary/30 font-semibold"
                      : "hover:bg-base-200"
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full border-2 ${
                      activeIndex === idx ? "bg-primary border-primary" : "border-primary"
                    }`}
                  ></span>
                  <span className="text-sm">{section.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ====== LAYOUT ====== */}
      <div className="flex h-[calc(100%-6rem)] gap-4">
        {/* ====== DESKTOP: Sidebar + Info ====== */}
        <div className="hidden md:flex flex-col w-1/5 bg-base-100 rounded-lg shadow p-4 overflow-y-auto">
          {/* Course Info (desktop only) */}
          <div className="mb-4">
            {/* Instructor Info */}
            <div onClick={() => { navigate(`/profile?p=${course.instructor.publicId}`) }} className="flex items-center gap-3 mb-2 cursor-pointer">
              <img
                src={course.instructor.profilePicture}
                alt={`${course.instructor.username}'s profile`}
                className="rounded-full size-12"
              />
              <p className="text-base-content/40 hover:text-primary/70 transition-colors duration-200 ease-in-out">{course.instructor.username}</p>
            </div>

      <h1 className="text-2xl mb-1 font-bold">{course.title}</h1>
      <div className="flex justify-between items-center">
        <p className="text-sm text-base-content/50 flex-1">{course.desc}</p>
        <div className="ml-4 flex space-x-4 text-base-content/30">
          <button
              onClick={handleLikeOrUnlike}
              aria-label="Like or unlike course"
              className="flex items-center cursor-pointer px-2 py-1 rounded hover:text-red-400 transition-colors duration-200 ease-in-out"
            >
              <FiHeart
                className="mr-1"
                fill={liked ? "oklch(70.4% 0.191 22.216)": "var(--color-base-200)"}
              />
              <span className="font-light">{likesCount.toLocaleString()}</span>
            </button>
        </div>
      </div>
    </div>

          {/* Sidebar Sections */}
          {course.curriculum.map((section, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveIndex(idx)
                if (contentRef.current) {
                    contentRef.current.scrollTop = 0;
                }  
              }}
              className={`flex items-center gap-3 cursor-pointer px-2 py-2 rounded-lg transition-all mb-2 ${
                activeIndex === idx
                  ? "bg-secondary/30 font-semibold"
                  : "hover:bg-base-200"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full border-2 ${
                  activeIndex === idx ? "bg-primary border-primary" : "border-primary"
                }`}
              ></span>
              <span>{section.title}</span>
            </div>
          ))}
        </div>

        {/* ====== MAIN CONTENT ====== */}
        <div ref={contentRef} className="flex-1 bg-base-100 rounded-lg shadow p-2 md:p-4 lg:p-6 overflow-y-auto">
          <div className="mx-0 md:mx-[3rem] lg:mx-[8rem] 2xl:mx-[18rem]">
            <ReactMarkdownComponent md_text={currentSection.md_text} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;