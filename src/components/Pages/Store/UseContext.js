import { createContext, useContext,useEffect,useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState("");
  // const [userID, setUserID] = useState("");
  const [usertype, setUsertype] = useState("");

  useEffect(() => {
    const storedToken = TokenFROMLSGet;
    const storedIsUserType = UserTypeFROMLSGet();
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedIsUserType) {
      setUsertype(storedIsUserType); // Set the isAdmin if found
      console.log("store usertype", usertype);
    }
  }, );


  const storerUser = (UserData) => {
    localStorage.setItem("users", JSON.stringify(UserData));
  };
  const UserFROMLSGet = () => {
    return localStorage.getItem("users");
  };
  const storerRole = (RoleData) => {
    localStorage.setItem("roles", JSON.stringify(RoleData));
  };
  const RoleFROMLSGet = () => {
    return localStorage.getItem("roles");
  };

  const storeregisterUser = (userData) => {
    // Get existing registered users from localStorage
    let existingUsers =
      JSON.parse(localStorage.getItem("registeredUser")) || [];
    console.log(existingUsers);

    // Add the new user to the array
    existingUsers.push(userData);

    // Save the updated array back to localStorage double code ma badhu hashe key and value both
    localStorage.setItem("registeredUser", JSON.stringify(existingUsers));
  };

  const getRegisteredUser = () => {
    const storedUsers =
      JSON.parse(localStorage.getItem("registeredUser")) || [];
    console.log(storedUsers);

    return Array.isArray(storedUsers) ? storedUsers : [storedUsers];
  };
  const storeloginUser = (serverToken) => {
    //  localStorage.removeItem("registeredUser");
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
  };

  const TokenFROMLSGet = () => {
    return localStorage.getItem("token");
  };

  const StoreUserTypeINLS = (serverUsertype) => {
    setUsertype(serverUsertype);
    localStorage.setItem("usertype", serverUsertype);
  };

  const UserTypeFROMLSGet = () => {
    return localStorage.getItem("usertype");
  };

  const logout = () => {
    setToken("");
    setUsertype("");
    localStorage.removeItem("token");
    localStorage.removeItem("usertype");
    // localStorage.removeItem("events");
  };

  return (
    <AuthContext.Provider
      value={{
        storerUser,
        UserFROMLSGet,
        storeregisterUser,
        getRegisteredUser,
        storeloginUser,
        TokenFROMLSGet,
        token,
        logout,
        usertype,
        StoreUserTypeINLS,
        storerRole,
        RoleFROMLSGet,

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};
