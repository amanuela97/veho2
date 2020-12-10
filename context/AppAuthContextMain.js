import React, { createContext, useState } from "react";
import { loginUser, registerUser } from "../Api/AppAuth";
import { db_auth } from "../Api/Db";

export const AuthContextMain = createContext();

export const AuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState(null);

  return (
    <AuthContextMain.Provider
      value={{
        userAuth,
        setUserAuth,
        login: loginUser,
        register: registerUser,
        logout: async () => {
          try {
            await db_auth.signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}
    >
      {children}
    </AuthContextMain.Provider>
  );
};
