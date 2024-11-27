import React, {useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTh,
  faList,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../Store/UseContext";
import "./header.css";

const Header = () => {
  const { token, usertype, getRegisteredUser } = useAuth();
  const [adminName, setAdminName] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    let userDetails = getRegisteredUser(); 
    
    
    if (typeof userDetails === "string") {
      try {
        userDetails = JSON.parse(userDetails); 
      } catch (error) {
        console.error("Error parsing userDetails:", error);
        return;
      }
    }
  console.log("pooja", userDetails);
  
    if (Array.isArray(userDetails)) {
      const currentUser = userDetails.find(user => user.usertype.toLowerCase() === usertype.toLowerCase());
  
      if (currentUser && currentUser.name) {
        if (usertype === "admin") {
          setAdminName(currentUser.name);
        } else {
          setUserName(currentUser.name);
        }
      } else {
        console.error("User details or name not found");
      }
    } else {
      console.error("Expected an array, but received:", typeof userDetails);
    }
  }, [usertype]);
  
  

  useEffect(() => {
    const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

    const mobileNavToggle = () => {
      document.querySelector("body").classList.toggle("mobile-nav-active");
      mobileNavToggleBtn.classList.toggle("bi-list");
      mobileNavToggleBtn.classList.toggle("bi-x");
    };

    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener("click", mobileNavToggle);
    }

    const navLinks = document.querySelectorAll("#navmenu a");
    navLinks.forEach((navmenu) => {
      navmenu.addEventListener("click", () => {
        if (document.querySelector(".mobile-nav-active")) {
          mobileNavToggle();
        }
      });
    });

    return () => {
      if (mobileNavToggleBtn) {
        mobileNavToggleBtn.removeEventListener("click", mobileNavToggle);
      }
      navLinks.forEach((navmenu) => {
        navmenu.removeEventListener("click", () => {
          if (document.querySelector(".mobile-nav-active")) {
            mobileNavToggle();
          }
        });
      });
    };
  }, []);

  return (
    <>
      <i className="bi bi-list mobile-nav-toggle"></i>

      <aside id="sidebar" className="sidebar d-flex flex-column sticky-top">
        <NavLink to="/" className="logo d-flex align-items-center mb-4">
          <h2 className="sitename">User Management</h2>
        </NavLink>

        <nav id="navmenu" className="navmenu flex-grow-1">
          <ul>
            {usertype === "admin" && (
              <>
                <li>
                  <NavLink
                    className="nav-link nav-profile d-flex align-items-center pe-0"
                    to="/profile"
                    
                  >
                    <img
                      src="assets/img/profile-img.jpg"
                      alt="Profile"
                      className="rounded-circle"
                    />
                    <span>Admin: {adminName}</span>
                  </NavLink>
                
                </li>
                <li>
                  <NavLink to="/user">
                    <FontAwesomeIcon icon={faList} /> User Management
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/roles">
                    <FontAwesomeIcon icon={faUsersCog} /> Roles Management
                  </NavLink>
                </li>
              </>
            )}
            {usertype === "user" && (
              <>
              <li>
              <NavLink
                className="nav-link nav-profile d-flex align-items-center pe-0"
                to="/profile"
                  >
                <img
                  src="assets/img/profile-img.jpg"
                  alt="Profile"
                  className="rounded-circle"
                />
                <span>User: {userName}</span>
              </NavLink>
            </li>
              </>
            )}
            {token ? (
              <li>
                <NavLink to="/logout">
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </NavLink>
              </li>
            ) : (
              <>
                <li>
                  <NavLink to="/register">
                    <FontAwesomeIcon icon={faUserPlus} /> Register
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login">
                    <FontAwesomeIcon icon={faSignInAlt} /> Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Header;
