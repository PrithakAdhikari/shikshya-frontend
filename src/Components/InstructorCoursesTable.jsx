import React, { useState, useEffect, useRef } from "react";
import {
  FaEllipsisV,
  FaGlobe,
  FaLock,
  FaEyeSlash,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import { useAuth } from "../Contexts/useAuth";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const visibilityOptions = [
  { label: "Public", icon: <FaGlobe className="inline mr-2" /> },
  { label: "Private", icon: <FaLock className="inline mr-2" /> },
  { label: "Unlisted", icon: <FaEyeSlash className="inline mr-2" /> },
];

const InstructorCoursesTable = ({ isCoursesPage = false, limit=8 }) => {
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const { authAxios } = useAuth();

  const totalPages = Math.ceil(totalCourses / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const navigate = useNavigate();

  // Refs for dropdown toggles keyed by course publicId
  const actionDropdownRefs = useRef({});
  const visibilityDropdownRefs = useRef({});

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await authAxios.get(`${API_URL}api/courses/instructor-courses`, {
          params: { limit: limit, offset },
        });
        setCourses(res.data.data.courses || []);
        setTotalCourses(res.data.data.total || 0);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [offset, authAxios]);

  const handleVisibilityUpdate = async (publicId, changeTo) => {
    try {
      const res = await authAxios.patch(
        `${API_URL}api/courses`,
        { visibility: changeTo }, // Request body
        { params: { c: publicId } } // Query params
      );

      if (res.status === 200) {
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.publicId === publicId
              ? { ...course, visibility: changeTo }
              : course
          )
        );

        // Close visibility dropdown by blurring toggle button
        if (visibilityDropdownRefs.current[publicId]) {
          visibilityDropdownRefs.current[publicId].blur();
        }
      }
    } catch (err) {
      console.error("Failed to update course visibility", err);
      alert("Could not update visibility. Please try again.");
    }
  };

  const handleDelete = async (publicId, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await authAxios.delete(`${API_URL}api/courses`, {
        params: { c: publicId },
      });

      if (res.status === 200) {
        setCourses((prev) => prev.filter((course) => course.publicId !== publicId));
        setTotalCourses((prev) => prev - 1);

        // Close action dropdown by blurring toggle button
        if (actionDropdownRefs.current[publicId]) {
          actionDropdownRefs.current[publicId].blur();
        }
      }
    } catch (error) {
      console.error("Failed to delete course", error);
      alert("Failed to delete course.");
    }
  };

  const getIconForVisibility = (visibility) => {
    const found = visibilityOptions.find((opt) => opt.label === visibility);
    return found ? found.icon : null;
  };

  const handlePageClick = (pageNumber) => {
    setOffset((pageNumber - 1) * limit);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (startPage > 2) pages.push("left-ellipsis");
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages - 1) pages.push("right-ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <button className="btn btn-square loading"></button>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div
            className={`hidden md:grid ${
              isCoursesPage ? "grid-cols-6" : "grid-cols-5"
            } gap-4 border-b border-gray-300/30 pb-2 font-semibold text-sm text-gray-500`}
          >
            <span>Course</span>
            {isCoursesPage && <span>Visibility</span>}
            <span>Date</span>
            <span>Views</span>
            <span>Comments</span>
            <span>Likes</span>
          </div>

          {/* Table Rows */}
          {courses.map((course, idx) => (
            <div
              key={course.id || idx}
              className={`grid ${
                isCoursesPage ? "md:grid-cols-6" : "md:grid-cols-5"
              } gap-4 items-center border-b border-gray-300/30 py-3 text-sm`}
            >
              {/* Course info */}
              <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div>
                  <p
                    className={`font-medium ${
                      isCoursesPage ? "text-xl" : ""
                    }`}
                  >
                    {course.title}
                  </p>
                  <p className="text-xs text-gray-500">{course.category}</p>
                </div>
              </div>

              {/* Visibility dropdown */}
              {isCoursesPage && (
                <div className="relative">
                  <div className="dropdown dropdown-end">
                    <label
                      tabIndex={idx}
                      className="btn btn-ghost font-light"
                      ref={(el) => (visibilityDropdownRefs.current[course.publicId] = el)}
                    >
                      {getIconForVisibility(course.visibility)}{" "}
                      {course.visibility}
                    </label>
                    <ul
                      tabIndex={idx}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-36"
                    >
                      <li onClick={() => handleVisibilityUpdate(course.publicId, "Public")}>
                        <a>
                          {getIconForVisibility("Public")} Public
                        </a>
                      </li>
                      <li onClick={() => handleVisibilityUpdate(course.publicId, "Unlisted")}>
                        <a>
                          {getIconForVisibility("Unlisted")} Unlisted
                        </a>
                      </li>
                      <li onClick={() => handleVisibilityUpdate(course.publicId, "Private")}>
                        <a>
                          {getIconForVisibility("Private")} Private
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="hidden md:block">
                {new Date(course.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              {/* Views */}
              <div className="hidden md:block">
                {course.views?.toLocaleString()}
              </div>

              {/* Comments */}
              {/* <div className="hidden md:block">{course.comments}</div> */}
              <div className="hidden md:block w-full mx-auto">X</div>

              {/* Likes + Actions */}
              <div className="flex items-center justify-between">
                <span className="hidden md:block">{course.likes}</span>
                {isCoursesPage && (
                  <div className="dropdown dropdown-end">
                    <label
                      tabIndex={0}
                      className="btn btn-ghost btn-xs"
                      ref={(el) => (actionDropdownRefs.current[course.publicId] = el)}
                    >
                      <FaEllipsisV />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-28"
                    >
                      <li>
                        <a onClick={() => navigate(`/update-course?c=${course.publicId}`)}>
                          <FaPen /> Edit
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => handleDelete(course.publicId, course.title)}
                          className="text-red-500"
                        >
                          <FaTrash /> Delete
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Mobile extra info */}
              <div className="md:hidden col-span-full text-xs text-gray-500 mt-2 flex flex-wrap gap-4">
                <span>
                  <strong>Views:</strong> {course.views?.toLocaleString()}
                </span>
                <span>
                  {/* <strong>Comments:</strong> {course.comments} */}
                  <strong>Comments:</strong> <span className="w-full mx-auto">X</span>
                </span>
                <span>
                  <strong>Likes:</strong> {course.likes}
                </span>
                <span>
                  <strong>Date:</strong> {new Date(course.date).toLocaleDateString()}
                </span>
                {isCoursesPage && (
                  <span>
                    <strong>Visibility:</strong> {course.visibility}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              className="btn btn-sm"
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
            >
              {"<"}
            </button>

            {pageNumbers.map((page, idx) =>
              page === "left-ellipsis" || page === "right-ellipsis" ? (
                <span key={page + idx} className="px-2 select-none">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`btn btn-sm ${page === currentPage ? "btn-primary" : ""}`}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="btn btn-sm"
              onClick={() =>
                setOffset(Math.min(offset + limit, (totalPages - 1) * limit))
              }
              disabled={offset + limit >= totalCourses}
            >
              {">"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InstructorCoursesTable;
