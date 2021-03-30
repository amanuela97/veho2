import React from "react";
import { db_auth } from "../Api/Db";
import { AuthProvider } from "../context/AppAuthContextMain";
import Routes from "./Routes";

const Providers = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default Providers;
