import React, { createContext } from "react";

export const AppAuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [charger, setcharger] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
