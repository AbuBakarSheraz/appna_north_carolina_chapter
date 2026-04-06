import { api } from "./api";

export const getUsername = async () => {
  const res = await api.get("/profile/me");
  console.log(res);
  return res.data;
};
