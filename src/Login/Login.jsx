import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/useAuth";
import Navbar from "../Components/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await login(email, password);
    if (response.status == "SUCCESS") {
      navigate("/");
    } else {
      setError(response.error);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="grid w-full h-full place-items-center items-center mt-32">
        <div className="card w-96 bg-base-200 shadow-xl">
          <div className="card-body">
            {error && (<p className="text-sm text-center text-orange-600">ERROR: {error.error}</p>)}
            <h2 className="card-title text-2xl font-bold mb-6 text-center mx-auto">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 opacity-70"
                  >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    type="email"
                    className="grow"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="grow"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <FontAwesomeIcon className="cursor-pointer" icon="fa-solid fa-eye-low-vision" />
                    ) : (
                      <FontAwesomeIcon className="cursor-pointer" icon="fa-solid fa-eye" />
                    )}
                  </button>
                </div>
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">
                    Forgot password?
                  </a>
                </label>
              </div>

              <div className="form-control mt-6 flex justify-center">
                {!loading ? (
                  <button className="btn btn-primary w-1/2">Login</button>
                ) : (
                  <button className="btn btn-primary opacity-30 w-1/2" disabled>
                    <span className="loading loading-dots loading-sm"></span>
                  </button>
                )}
              </div>
            </form>

            <div className="divider">OR</div>

            <div className="text-center">
              <p>Don't have an account?</p>
              <a
                onClick={() => navigate("/register")}
                className="link link-primary cursor-pointer"
              >
                Sign up now
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
