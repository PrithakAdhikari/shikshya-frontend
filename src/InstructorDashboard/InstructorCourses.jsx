import InstructorCoursesTable from "../Components/InstructorCoursesTable";
import { useState, useEffect } from "react";
import { useAuth } from "../Contexts/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const { authAxios } = useAuth();

  useEffect(() => {
    const getInstructorCourses = async () => {
      const response = await authAxios.get(`${API_URL}api/courses/instructor-courses`);

      console.log(response.data.data.courses);
      setCourses(response.data.data.courses);

    }

    getInstructorCourses();

  }, [])

  //   const courses = [
  //   {
  //     title: "Javascript Fundamentals",
  //     category: "Programming",
  //     url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
  //     views: 1000,
  //     premiumViews: 500,
  //     comments: 300,
  //     likes: 10,
  //     visibility: "Public",
  //     date: "2025-07-18",
  //   },
  //   {
  //     title: "CSS Mastery",
  //     category: "Programming",
  //     url: "https://cdn-icons-png.flaticon.com/512/16020/16020753.png",
  //     views: 1600000,
  //     premiumViews: 500,
  //     comments: 120,
  //     likes: 85,
  //     visibility: "Private",
  //     date: "2025-07-10",
  //   },
  //   {
  //     title: "React Essentials",
  //     category: "Programming",
  //     url: "https://cdn-icons-png.flaticon.com/512/3459/3459528.png",
  //     views: 7500,
  //     premiumViews: 300,
  //     comments: 45,
  //     likes: 15,
  //     visibility: "Unlisted",
  //     date: "2025-07-05",
  //   },
  //   {
  //     title: "Javascript Fundamentals",
  //     category: "Programming",
  //     url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
  //     views: 1000,
  //     premiumViews: 500,
  //     comments: 300,
  //     likes: 10,
  //     visibility: "Public",
  //     date: "2025-07-18",
  //   },
  //   {
  //     title: "CSS Mastery",
  //     category: "Programming",
  //     url: "https://cdn-icons-png.flaticon.com/512/16020/16020753.png",
  //     views: 1600000,
  //     premiumViews: 500,
  //     comments: 120,
  //     likes: 85,
  //     visibility: "Private",
  //     date: "2025-07-10",
  //   },
  //   {
  //     title: "React Essentials",
  //     category: "Programming",
  //     url: "https://cdn-icons-png.flaticon.com/512/3459/3459528.png",
  //     views: 7500,
  //     premiumViews: 300,
  //     comments: 45,
  //     likes: 15,
  //     visibility: "Unlisted",
  //     date: "2025-07-05",
  //   },
    
  // ];

  return (
    <div className="bg-base-200 min-h-[85vh] p-6">
      
            <h2 className="text-4xl font-semibold mb-4">Courses</h2>
            <p className="text-[1rem] text-base-content/40 mb-4">
            Courses uploaded by you as an instructor
            </p>
            <InstructorCoursesTable courses={courses} isCoursesPage={true} />
      
    </div>
  )

}

export default InstructorCourses;