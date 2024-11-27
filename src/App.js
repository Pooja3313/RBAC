import "./App.css";
import User from "./components/Pages/Users/User";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/Pages/Login/login";
import Register from "./components/Pages/Register/register";
import Header from "./components/Pages/Header/header";
import Logout  from "./components/Pages/Logout/Logout";
import Footer from "./components/Pages/Footer/Footer";
import Roles from "./components/Pages/Roles/Roles";
import Profile from "./components/Pages/Profile/Profile";

function App() {
 
  return (
    <>
      <Header />
      <Routes>
        <Route path="/user" element={<User />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/roles" element={<Roles/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={3000} // Toast disappears after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}


export default App;
