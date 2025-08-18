import Card from "../Components/Card";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from "../Contexts/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

const Courses = () => {

  // const categories = [
  //   { label: "Programming", icon: <FontAwesomeIcon icon="fa-solid fa-eye" /> },
  //   { label: "Science", icon: <FontAwesomeIcon icon="fa-solid fa-eye" /> },
  //   { label: "Mathematics", icon: <FontAwesomeIcon icon="fa-solid fa-eye" /> },
  //   { label: "Social", icon: <FontAwesomeIcon icon="fa-solid fa-eye" /> },
  // ];

  const { authAxios } = useAuth();
  
  const [ courses, setCourses ] = useState([]);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);
      const response = await authAxios.get(`${API_URL}api/courses?limit=4`);
      
      setCourses(response.data.data.courses);
      setLoading(false);
    }

    getCourses();
  }, [])


  return (
    <div className="my-[9.5rem] mx-2">
      <h1 className="text-3xl font-bold my-8 text-center">Some Recommended Courses</h1>

      {/* Category Filter Buttons
      <div className="container mx-auto flex justify-center items-center mb-8 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-2xl">
          {categories.map(({ label, icon }) => (
            <button
              key={label}
              className={`btn ${activeCategory === label ? 'btn-primary' : "btn-ghost font-light"}`}
              onClick={() => setActiveCategory(label)}
            >
              <span className="text-lg">{icon}</span>
              <span className="ml-2">{label}</span>
            </button>
          ))}
        </div>
      </div> */}

      {/* Course Cards */}
      <div className="container mx-auto px-4">
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <button className="btn btn-square loading"></button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course, key) => (
              <Card
                key={key}
                publicId={course.publicId}
                url={course.thumbnail}
                title={course.title}
                desc={course.desc}
                views={course.views}
                instructor={course.instructor}
                liked={course.liked}
                likes={course.likes}
              />
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Courses;
