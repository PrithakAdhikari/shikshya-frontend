import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Card from "../Components/Card";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const publicId = searchParams.get("p");
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}auth/public-profile?p=${publicId}`);
        setProfileData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };
    getProfile();
  }, [publicId]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-4 py-8 gap-8">
        {profileData ? (
          <>
            {/* Profile Card */}
            <div className="max-w-3xl w-full bg-base-200 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0">
                <img
                  src={profileData?.profilePicture}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-primary"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-semibold">
                  {profileData?.firstName} {profileData?.lastName}
                </h2>
                <p className="text-sm text-gray-600">@{profileData?.username}</p>
                <p className="mt-2 text-gray-700">{profileData?.email}</p>
              </div>
            </div>

            {/* Courses Grid */}
            {profileData?.courses?.length > 0 && (
              <div className="w-full max-w-7xl mt-8">
                <h3 className="text-xl font-semibold mb-4">Courses by {profileData?.firstName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-4">
                  {profileData.courses.map((course) => (
                    <Card
                      key={course.publicId}
                      publicId={course.publicId}
                      url={course.thumbnail}
                      title={course.title}
                      desc={course.desc}
                      views={course.views}
                      instructor={{
                        username: profileData.username,
                        profilePicture: profileData.profilePicture
                      }}
                      likes={course.likes}
                      liked={false} // Public profile view; you may not know if current user liked
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
