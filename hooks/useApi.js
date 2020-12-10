import { useState } from "react";

export default useApi = (apiFunc) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const request = async (...args) => {
    setLoading(true);
    const response = await apiFunc(...args);
    console.log("jjj", response);
    setLoading(false);

    setError(response.error);
    setData(response.data);
    return response;
  };

  return { data, error, loading, request };
};
