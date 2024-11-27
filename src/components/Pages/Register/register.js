import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./register.css";
import { useAuth } from "../Store/UseContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const { getRegisteredUser, storeregisterUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    // cpassword: "",
    usertype: "",
  });

  const handleInput = (e) => {
    let { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

    if (!values.name) {
      errors.name = "Username is required!";
    }
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.phone) {
      errors.phone = "Phone is required!";
    } else if (values.phone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits!";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    // if (!values.cpassword) {
    //   errors.cpassword = "Password is required";
    // } else if (values.cpassword !== values.password) {
    //   errors.cpassword = "Passwords do not match!";
    // }
    return errors;
  };

  const PostData = (e) => {
    e.preventDefault();

    // Validate the form and set errors if any
    const validationErrors = validate(user);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Store user data in localStorage
      let existingUsers = getRegisteredUser();

      // Ensure existingUsers is an array, handling cases where it's not
      // if (Array.isArray(existingUsers)) {
      if (existingUsers) {
        const isEmailExist = existingUsers.some(
          (existingUser) => existingUser.email === user.email
        );

        const isPhoneExist = existingUsers.some(
          (existingUser) => existingUser.phone === user.phone
        );

        // Check if email or phone already exists
        if (isEmailExist && isPhoneExist) {
          toast.error(
            "Both email and phone number are already registered! Please use different ones."
          );
        } else if (isEmailExist) {
          toast.error(
            "Email already registered! Please use a different email."
          );
        } else if (isPhoneExist) {
          toast.error(
            "Phone number already registered! Please use a different phone number."
          );
        } else {
          // Store the new user
          storeregisterUser(user);
          toast.success("Registration successful");

          // Clear the form
          setUser({
            name: "",
            email: "",
            phone: "",
            password: "",
            usertype: "",
          });

          // Redirect to login page
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong with user data.");
      }
    }
  };

  return (
    <>
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-2 pb-1">
                    <h5 className="card-title text-center pb-0 fs-4">
                      Create an Account
                    </h5>
                    <p className="text-center small">
                      Enter your personal details to create account
                    </p>
                  </div>
                  <form className="row g-3" method="POST">
                    <div className="col-12">
                      <label htmlFor="yourName" className="form-label">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        id="yourName"
                        value={user.name}
                        onChange={handleInput}
                      />
                      <p className="text-danger">{formErrors.name}</p>
                    </div>

                    <div className="col-12">
                      <label htmlFor="yourEmail" className="form-label">
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="yourEmail"
                        value={user.email}
                        onChange={handleInput}
                      />
                      <p className="text-danger">{formErrors.email}</p>
                    </div>

                    <div className="col-12">
                      <label htmlFor="yourContact" className="form-label">
                        Your Contact
                      </label>
                      <input
                        type="number"
                        name="phone"
                        className="form-control"
                        id="yourContact"
                        value={user.phone}
                        onChange={handleInput}
                      />
                      <p className="text-danger">{formErrors.phone}</p>
                    </div>
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

                    {/* <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="cpassword"
                        className="form-control"
                        id="yourPassword"
                        value={user.cpassword}
                        onChange={handleInput}
                      />
                      <p className="text-danger">{formErrors.cpassword}</p>
                    </div> */}

                    <div className="col-12">
                      <label htmlFor="userType" className="form-label">
                        User Type
                      </label>
                      <div className="row">
                        <div className="form-check col-lg-6">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="usertype"
                            id="user"
                            value="user"
                            onChange={handleInput}
                          />
                          <label className="form-check-label" htmlFor="user">
                            User
                          </label>
                        </div>
                        <div className="form-check col-lg-6">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="usertype"
                            id="admin"
                            value="admin"
                            onChange={handleInput}
                          />
                          <label className="form-check-label" htmlFor="admin">
                            Admin
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-primary w-100"
                        type="submit"
                        onClick={PostData}
                      >
                        Create Account
                      </button>
                    </div>

                    <div className="col-12">
                      <p className="small mb-0">
                        Already have an account?{" "}
                        <NavLink to="/login">Log in</NavLink>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
