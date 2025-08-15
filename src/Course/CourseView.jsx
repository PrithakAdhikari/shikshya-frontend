import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import SideBar from "../Components/SideBar";
import Course from "./Course";
import { useAuth } from "../Contexts/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

const CourseView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const publicId = searchParams.get("c");

  const { authAxios } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!publicId) {
      setError("No course ID provided.");
      setLoading(false);
      navigate("/dashboard");
      return; // important to stop execution here
    }

    setLoading(true);
    setError(null);

    authAxios
      .get(`${API_URL}api/courses`, {
        params: { c: publicId },
      })
      .then((response) => {
        setCourse(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load course.");
        setLoading(false);
      });
  }, [publicId, navigate]);

  if (loading)
    return (
    <SideBar>
      <div className="flex h-[85vh] items-center justify-center">
        <button className="btn btn-square loading"></button>
      </div>
    </SideBar>
    );

  if (error)
    return (
      <SideBar>
        <div className="flex h-[85vh] items-center justify-center">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      </SideBar>
    );

  if (!course)
    return (
      <SideBar>
        <div className="flex h-[85vh] items-center justify-center">
          <p className="text-lg">No course found.</p>
        </div>
      </SideBar>
    );

  return (
    <SideBar isCourse={true}>
      <Course course={course} />
    </SideBar>
  );
};

export default CourseView;
