import React from "react";
import { Link } from "react-router-dom";

const Hero = ({ title, desc, background, isAtTop = false, getStartedUrl }) => {
  return (
    <>
      <div
        className={`hero min-h-[85svh] ${isAtTop ? "-mt-[5.5rem]" : ""}`}
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className="hero-overlay bg-opacity-40"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <div className="mb-5 text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-indigo-500 to-green-500 animate-pulse drop-shadow-[0_0_8px_rgba(0,0,0,0.4)]">
              {title}
            </div>
            <p className="mb-5 text-slate-300 text-sm">{desc}</p>

            <Link
                  to={getStartedUrl}
                  className="relative inline-flex items-center justify-center p-4 md:p-6 text-sm md:text-lg font-bold transition-all duration-300 btn btn-primary rounded-xl transform hover:scale-105 hover:-translate-y-1 active:scale-95 group overflow-hidden drop-shadow-[0_0_8px_rgba(0,0,0,0.4)]"
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Button text with subtle animation */}
                  <span className="relative z-10 tracking-wide group-hover:tracking-wider transition-all duration-300">
                    Get Started
                  </span>
                  
                  {/* Arrow icon that slides in on hover */}
                  <svg 
                    className="relative z-10 w-5 h-5 ml-2 transition-all duration-300 transform group-hover:translate-x-1 group-hover:scale-110" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  
                  {/* Ripple effect on click */}
                  <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-active:scale-100 transition-transform duration-300"></div>
                </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
