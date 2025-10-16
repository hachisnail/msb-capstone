import axiosClient from "./axiosClient";

// loginCredentials
export async function loginCredentials(identifier, password) {
  const res = await axiosClient.post("/auth/login", {
    username: identifier,
    password,
  });
  return res.data; // do NOT redirect here
}

export async function logout() {
  const res = await axiosClient.post("/auth/logout");
  return res.data;
}

export async function me() {
  const { data } = await axiosClient.get("/auth/me");
  return data; // { session }
}

export async function register(payload) {
  const { data } = await axiosClient.post("/auth/register", payload);
  return data; // { user }
}
