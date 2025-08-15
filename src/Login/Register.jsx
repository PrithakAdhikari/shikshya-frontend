import { useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/useAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    setLoading(true);
    const response = await register(formData);

    if (response.status === "SUCCESS") {
      navigate("/login");
    } else {
      console.log(response.error);
      setError(response);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="grid w-full h-full place-items-center items-center mt-32">
        <div className="card pl-2 w-96 bg-base-200 shadow-xl">
          <div className="card-body">
            {error && (<p className="text-sm text-center text-orange-600">ERROR: {error.error}</p>)}
            <h2 className="card-title text-2xl text-center mx-auto font-bold mb-6">Register</h2>
            <form onSubmit={handleRegister} encType="multipart/form-data">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="input input-bordered flex items-center gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="grow"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Profile Picture</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                />
              </div>

              <div className="form-control mt-6 flex justify-center">
                {!loading ? (
                  <button className="btn btn-primary w-1/2">Register</button>
                ) : (
                  <button className="btn btn-primary opacity-30 w-1/2" disabled>
                    <span className="loading loading-dots loading-sm"></span>
                  </button>
                )}
              </div>
            </form>

            <div className="divider">OR</div>

            <div className="text-center">
              <p>Already have an account?</p>
              <a
                onClick={() => navigate("/login")}
                className="link link-primary cursor-pointer"
              >
                Login here
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
