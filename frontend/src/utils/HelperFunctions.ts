export const getToken = () => {
  return localStorage.getItem("token");
};
export const removeToken = () => {
  localStorage.removeItem("token");
};
export const setToken = (val) => {
  localStorage.setItem("token", val);
};

export const getUser = () => {
  localStorage.getItem("user");
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

export const setUser = (val) => {
  localStorage.setItem("user", val);
};
