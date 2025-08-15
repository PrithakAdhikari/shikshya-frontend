import React from "react";

import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import Footer from "../Components/Footer";
import Courses from "./Courses";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero
        title={"Shikshya"}
        desc={
          "The Best Learning Site for Nepalis! Learn about anything and everything in the best way!"
        }
        background={
          "https://i.pinimg.com/736x/1e/13/01/1e13014d51f0f62125dacabeb7486138.jpg"
        }
        isAtTop={true}
        getStartedUrl={"/dashboard"}
      />
      <Courses />
      <Footer />
    </>
  );
};

export default HomePage;
