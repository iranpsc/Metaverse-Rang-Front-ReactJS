import { useState } from "react";
import useRequest from "../services/Hooks/useRequest";

const useRequestDetails = (type) => {
  const { Request } = useRequest();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRequestDetails = async (id) => {
    setLoading(true);
    try {
      const endpoint =
        type === "send"
          ? `dynasty/requests/sent/${id}`
          : `dynasty/requests/recieved/${id}`;

      const response = await Request(endpoint);
      setData(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching request details:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetchRequestDetails,
  };
};

export default useRequestDetails;
