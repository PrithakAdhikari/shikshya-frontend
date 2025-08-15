import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContextProvider";
import { ThemeProvider } from "./Contexts/ThemeContextProvider";
import { SearchProvider } from "./Contexts/SearchContextProvider";

import HomePage from "./HomePage/HomePage";
import Login from "./Login/Login";
import Register from "./Login/Register";
import Profile from "./Profile/Profile";
import UserDashboard from "./UserDashboard/UserDashboard";
import CourseView from "./Course/CourseView";
import CreateCourse from "./CreateCourse/CreateCourse";
import UpdateCourse from "./CreateCourse/UpdateCourse";
import InstructorView from "./InstructorDashboard/InstructorView";
import InstructorDashboard from "./InstructorDashboard/InstructorDashboard";
import InstructorCourses from "./InstructorDashboard/InstructorCourses";
import DashboardCourses from "./UserDashboard/Courses";
import LikedCourses from "./UserDashboard/LikedCourses";
import TrendingCourses from "./UserDashboard/TrendingCourses";

import AppToaster from "./Components/AppToaster";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas);

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SearchProvider>
          <AppToaster />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<UserDashboard children={ <DashboardCourses /> } />} />
              <Route path="/dashboard/liked" element={<UserDashboard children={ <LikedCourses /> } />} />
              <Route path="/dashboard/trending" element={<UserDashboard children={ <TrendingCourses /> } />} />
              <Route path="/course" element={<CourseView />} />
              <Route path="/create-course" element={<InstructorView children={<CreateCourse />} />} />
              <Route path="/update-course" element={<InstructorView children={<UpdateCourse />} />} />
              <Route path="/instructor" element={<InstructorView children={<InstructorDashboard />} />} />
              <Route path="/instructor/courses" element={<InstructorView children={<InstructorCourses />} />} />
            </Routes>
          </SearchProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
