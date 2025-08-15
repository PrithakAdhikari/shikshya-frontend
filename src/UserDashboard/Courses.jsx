import { useEffect, useState } from "react";
import Card from "../Components/Card";
import { useAuth } from "../Contexts/useAuth";
import { useSearch } from "../Contexts/useSearch";

const API_URL = import.meta.env.VITE_API_URL;
const LIMIT = 8;

const DashboardCourses = () => {
  const [courses, setCourses] = useState([]);
  const [offset, setOffset] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(false);
  const { authAxios } = useAuth();

  const { searchText } = useSearch();

  useEffect(() => {
  const controller = new AbortController();

  const getCourses = async () => {
    setLoading(true);
    try {
      const response = await authAxios.get(`${API_URL}api/courses`, {
        params: { limit: LIMIT, offset, s: searchText || undefined },
        signal: controller.signal
      });
      setCourses(response.data.data.courses);
      setTotalCourses(response.data.data.total || 0);
    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error("Failed to fetch courses:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  let debounceTimer;

  // If search text is empty (first load or cleared), fetch immediately
  if (!searchText) {
    getCourses();
  } else {
    // Delay only when searching
    debounceTimer = setTimeout(() => {
      getCourses();
    }, 500);
  }

  return () => {
    clearTimeout(debounceTimer);
    controller.abort();
  };
}, [offset, searchText]);

// Reset to first page when search changes
useEffect(() => {
  setOffset(0);
}, [searchText]);


  const totalPages = Math.ceil(totalCourses / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  const handlePageClick = (pageNumber) => {
    setOffset((pageNumber - 1) * LIMIT);
  };

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7; // adjust how many page buttons to show
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first, last, current, and neighbors
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
    <div className="container w-full mx-auto px-4">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <button className="btn btn-square loading"></button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4">
            {courses.map((quizz) => (
              <Card
                key={quizz.publicId}
                publicId={quizz.publicId}
                url={quizz.thumbnail}
                title={quizz.title}
                desc={quizz.desc}
                views={quizz.views}
                instructor={quizz.instructor}
                likes={quizz.likes}
                liked={quizz.liked}
              />
            ))}
          </div>

          {/* Numbered Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              className="btn btn-sm"
              onClick={() => setOffset(Math.max(0, offset - LIMIT))}
              disabled={offset === 0}
            >
              {`<`}
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
                  className={`btn btn-sm ${
                    page === currentPage ? "btn-primary" : ""
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="btn btn-sm"
              onClick={() =>
                setOffset(
                  Math.min(offset + LIMIT, (totalPages - 1) * LIMIT)
                )
              }
              disabled={offset + LIMIT >= totalCourses}
            >
              {'>'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardCourses;
