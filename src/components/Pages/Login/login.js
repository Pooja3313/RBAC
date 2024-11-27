import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Store/UseContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const { getRegisteredUser, storeloginUser, StoreUserTypeINLS } = useAuth();
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.password) {
      errors.password = "Password is required!";
    }
    return errors;
  };

  const loginUser = (e) => {
    e.preventDefault();

    // Validate form inputs
    const validationErrors = validate(user);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Retrieve the registered users from localStorage (array of users)
      const registeredUsers = getRegisteredUser();
      console.log("Registered users:", registeredUsers);

      // Check if registered user exists by filtering the array
      const matchingUser = registeredUsers.find(
        (registeredUser) =>
          registeredUser.email === user.email &&
          registeredUser.password === user.password
      );

      // If matching user is found, proceed with login
      if (matchingUser) {
        // Redirect based on user type
        if (matchingUser.usertype === "user") {
          toast.success("User login successful");
          storeloginUser("123-abc"); // Store token
          StoreUserTypeINLS(matchingUser.usertype); // Store user type
          navigate("/eventdashboard");
        } else {
          toast.success("Admin login successful");
          storeloginUser("123-abc"); // Store token
          StoreUserTypeINLS(matchingUser.usertype); // Store user type
          navigate("/addevent");
        }
      } else {
        toast.error("Invalid email or password");
      }
    }
  };
  // other logic for us for verify
  // Check if a user with the given email exists
// const userByEmail = registeredUsers.find(
//   (registeredUser) => registeredUser.email === user.email
// );

// if (userByEmail) {
//   // Email exists, now check if the password matches
//   if (userByEmail.password === user.password) {
//     // Both email and password match, login successful
//     console.log("Login successful");
//     // Perform your login actions here
//   } else {
//     // Email exists but password is incorrect
//     console.log("Incorrect password");
//   }
// } else {
//   // No user found with the given email
//   console.log("Email does not exist");
// }


  return (
    <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title text-center pb-0 fs-4">
                  Login to Your Account
                </h5>
                <form className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Email-Id</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={user.email}
                      onChange={handleInput}
                    />
                    <p className="text-danger">{formErrors.email}</p>
                  </div>

                  {/* <div className="col-12">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={user.password}
                      onChange={handleInput}
                    />
                    <p className="text-danger">{formErrors.password}</p>
                  </div> */}

                  {/* <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">
                        Password
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"} // Toggle visibility based on state
                          name="password"
                          className="form-control"
                          id="yourPassword"
                          value={user.password}
                          onChange={handleInput}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)} // Toggle the state
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      <p className="text-danger">{formErrors.password}</p>
                    </div> */}
                  <div className="col-12">
                    <label htmlFor="yourPassword" className="form-label">
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"} // Toggle visibility based on state
                        name="password"
                        className="form-control"
                        id="yourPassword"
                        value={user.password}
                        onChange={handleInput}
                      />
                      <span
                        className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)} // Toggle the state
                        style={{ cursor: "pointer" }} // Add a pointer cursor to indicate clickability
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </span>
                    </div>
                    <p className="text-danger">{formErrors.password}</p>
                  </div>

                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      type="submit"
                      onClick={loginUser}
                    >
                      Login
                    </button>
                  </div>
                  <div className="col-12">
                    <p className="small mb-0">
                      Don't have an account? <a href="/register">Create one</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
