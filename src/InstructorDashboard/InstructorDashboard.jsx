import React from "react";
import { useAuth } from "../Contexts/useAuth";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import InstructorCoursesTable from "../Components/InstructorCoursesTable";

ChartJS.register(ArcElement, Tooltip, Legend);

const InstructorDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  // Dummy data
  const totalViews = 5002;
  const latestCourseViews = 1240;
  const totalComments = 324;
  const totalEarnings = 7251;
  const earningsThisMonth = 2700;
  const premiumEarnings = 800;
  const normalEarnings = earningsThisMonth - premiumEarnings;

  const latestCourses = [
    {
      title: "Javascript Fundamentals",
      category: "Programming",
      url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
      views: 1000,
      premiumViews: 500,
      comments: 300,
      likes: 10,
      visibility: "Public",
      date: "2025-07-18",
    },
    {
      title: "CSS Mastery",
      category: "Programming",
      url: "https://cdn-icons-png.flaticon.com/512/16020/16020753.png",
      views: 1600000,
      premiumViews: 500,
      comments: 120,
      likes: 85,
      visibility: "Private",
      date: "2025-07-10",
    },
    {
      title: "React Essentials",
      category: "Programming",
      url: "https://cdn-icons-png.flaticon.com/512/3459/3459528.png",
      views: 7500,
      premiumViews: 300,
      comments: 45,
      likes: 15,
      visibility: "Unlisted",
      date: "2025-07-05",
    },
  ];

  // Chart config
  const chartData = {
    labels: ["We are working on earnings.", "Premium Earnings"],
    datasets: [
      {
        data: [1, 0],
        backgroundColor: ["#97aec9", "#facc15"],
        hoverOffset: 6,
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: Rs. ${context.raw}`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    cutout: "70%",
    responsive: true,
    animation: false

    };

  return (
    <div className="bg-base-200 min-h-[85vh] flex flex-col p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        
        {/* Instructor Info */}
        <div className="bg-base-100 rounded-lg shadow p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
        <img
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
            src={
            isAuthenticated() && user?.profilePicture
                ? user.profilePicture
                : "https://cdn-icons-png.flaticon.com/512/12225/12225935.png"
            }
        />
        <h2 className="text-xl font-semibold">
            {isAuthenticated() && user?.username
            ? user.username
            : "Instructor"}
        </h2>
        <p className="text-sm text-gray-500">Welcome back!</p>
        </div>

        {/* Quick Stats */}
        <div className="bg-base-100 rounded-lg shadow p-4 grid grid-cols-2 gap-4 text-center">
            <div className="bg-base-200 rounded-xl flex flex-col items-center justify-center transition-all ease-in-out hover:-translate-y-2">
                <p className="text-3xl md:text-4xl font-bold">{totalViews}</p>
                <p className="text-xs md:text-sm">Total Views</p>
            </div>
            <div className="bg-base-200 rounded-xl flex flex-col items-center justify-center transition-all ease-in-out hover:-translate-y-2">
                <p className="text-3xl md:text-4xl font-bold">{latestCourseViews}</p>
                <p className="text-xs md:text-sm">Views on Latest Course</p>
            </div>
            <div className="bg-base-200 rounded-xl flex flex-col items-center justify-center transition-all ease-in-out hover:-translate-y-2">
                {/* <p className="text-3xl md:text-4xl font-bold">{totalComments}</p> */}
                <p className="text-3xl md:text-4xl font-bold">X</p>
                <p className="text-xs md:text-sm">Total Comments</p>
            </div>
            <div className="bg-base-200 rounded-xl flex flex-col items-center justify-center transition-all ease-in-out hover:-translate-y-2">
                {/* <p className="text-3xl md:text-4xl font-bold">Rs. {totalEarnings}</p> */}
                <p className="text-3xl md:text-4xl font-bold">X</p>
                <p className="text-xs md:text-sm">Total Earnings</p>
            </div>
        </div>

        {/* Earnings This Month */}
        <div className="bg-base-100 rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <div className="w-72 h-72 relative">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {/* <p className="text-2xl font-bold">Rs. {earningsThisMonth}</p>
                <p className="text-lg text-gray-500">This Month</p> */}

                <p className="text-2xl font-bold">X</p>

                </div>
            </div>
        </div>


        {/* Latest Courses */}
        <div className="bg-base-100 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Your Latest Courses</h3>
          <InstructorCoursesTable courses={latestCourses} limit={4} />
        </div>

      </div>
    </div>
  );
};

export default InstructorDashboard;
