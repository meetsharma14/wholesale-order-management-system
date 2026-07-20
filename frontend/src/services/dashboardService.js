import api from "../api/axios";

export const getDashboard = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data;
};